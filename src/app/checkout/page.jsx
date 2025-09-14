"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  selectCartTotalWithShipping,
  selectShippingCost,
  selectShippingLocation,
  updateShippingLocation,
  clearCart,
} from "@/lib/redux/slices/cartSlice";
import { selectCurrentUser, selectToken } from "@/lib/redux/slices/userSlice";

import { useTranslation } from "@/lib/use-translation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const { t, currentLanguage, isRTL } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  // Cart data
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const shippingCost = useSelector(selectShippingCost);
  const total = useSelector(selectCartTotalWithShipping);
  const shippingLocation = useSelector(selectShippingLocation);
  const currentUser = useSelector(selectCurrentUser);
  const token = useSelector(selectToken);

  // Form handling
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      paymentMethod: "cashOnDelivery",
    },
  });

  const paymentMethod = watch("paymentMethod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPrice = (value) => {
    return `EGP ${
      typeof value === "number"
        ? value.toFixed(2)
        : parseFloat(value).toFixed(2)
    }`;
  };

  const handleLocationChange = (e) => {
    dispatch(updateShippingLocation(e.target.value));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Check if user is authenticated
      if (!currentUser || !token) {
        toast.error("Please log in to complete your order");
        router.push("/login");
        return;
      }

      // Create order in local database first
      const orderRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user: currentUser._id,
            orderItems: cartItems.map((item) => ({
              product: item._id,
              name: item.name,
              image: item.image,
              price: item.price,
              qty: item.quantity,
            })),
            shippingAddress: {
              address: data.address,
              city: data.city,
              postalCode: data.postalCode || "00000", // Provide default if empty
              country: "Egypt",
            },
            paymentMethod: data.paymentMethod,
            subtotal,
            shippingCost,
            totalPrice: total,
            shippingLocation: shippingLocation,
            status: "pending",
          }),
        }
      );

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      const newOrder = await orderRes.json();

      // For credit card payments
      if (data.paymentMethod === "creditCard") {
        localStorage.setItem(
          "pendingOrder",
          JSON.stringify({
            orderId: newOrder._id,
            timestamp: Date.now(),
          })
        );

        const paymentRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/create-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              amount: total,
              orderId: newOrder._id,
              userId: currentUser._id,
              items: cartItems.map((item) => ({
                name: item.name.substring(0, 50),
                description:
                  item.description?.substring(0, 100) ||
                  item.name.substring(0, 100),
                price: item.price,
                quantity: item.quantity,
                productId: item._id,
              })),
              customer: {
                first_name: data.firstName.substring(0, 30),
                last_name: data.lastName.substring(0, 30),
                email: data.email,
                phone_number: data.phone.startsWith("+20")
                  ? data.phone
                  : `+20${data.phone.replace(/^0/, "")}`,
              },
              shipping_address: {
                street: data.address.substring(0, 100),
                city: data.city.substring(0, 30),
                area: data.area?.substring(0, 30) || "",
                postal_code: data.postalCode || "00000",
                country: "EGY",
              },
            }),
          }
        );

        const result = await paymentRes.json();

        if (!paymentRes.ok || !result.paymentUrl) {
          throw new Error(result.error || "Payment processing failed");
        }

        const paymentWindow = window.open("", "_blank");
        paymentWindow.location.href = result.paymentUrl;

        const checkPayment = setInterval(async () => {
          try {
            const statusRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders/${newOrder._id}/status`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!statusRes.ok) {
              throw new Error("Failed to check payment status");
            }

            const status = await statusRes.json();

            if (status.isPaid) {
              clearInterval(checkPayment);
              paymentWindow.close();
              dispatch(clearCart());
              localStorage.removeItem("pendingOrder");
              router.push(`/checkout/success?orderId=${newOrder._id}`);
            }
          } catch (error) {
            console.error("Status check failed:", error);
          }
        }, 3000);

        return;
      }

      // For cash on delivery
      dispatch(clearCart());
      router.push(`/checkout/success?orderId=${newOrder._id}`);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Checkout failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setValue("firstName", currentUser.name.split(" ")[0] || "");
      setValue(
        "lastName",
        currentUser.name.split(" ").slice(1).join(" ") || ""
      );
      setValue("email", currentUser.email || "");
      setValue("phone", currentUser.phone || "");
    }
  }, [currentUser, setValue]);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">{t("cart.empty")}</h1>
        <Button onClick={() => router.push("/products")}>
          {t("cart.continue_shopping")}
        </Button>
      </div>
    );
  }

  // Check if user is logged in
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">
          {t("checkout.login_required")}
        </h1>
        <Button onClick={() => router.push("/login")}>
          {t("checkout.go_to_login")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("checkout.title")}</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Shipping Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="text-xl font-bold">
              {t("checkout.shipping_info")}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block mb-2 font-medium">
                    {t("checkout.first_name")} *
                  </label>
                  <Input
                    id="firstName"
                    {...register("firstName", {
                      required: t("validation.required"),
                    })}
                    className={errors.firstName && "border-red-500"}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-2 font-medium">
                    {t("checkout.last_name")} *
                  </label>
                  <Input
                    id="lastName"
                    {...register("lastName", {
                      required: t("validation.required"),
                    })}
                    className={errors.lastName && "border-red-500"}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block mb-2 font-medium">
                  {t("checkout.phone")} *
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  {...register("phone", {
                    required: t("validation.required"),
                    pattern: {
                      value: /^01[0-9]{9}$/,
                      message: t("validation.invalid_phone"),
                    },
                  })}
                  className={errors.phone && "border-red-500"}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 font-medium">
                  {t("checkout.email")} *
                </label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: t("validation.required"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("validation.invalid_email"),
                    },
                  })}
                  className={errors.email && "border-red-500"}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Shipping Location Selector */}
              <div>
                <label
                  htmlFor="shippingLocation"
                  className="block mb-2 font-medium"
                >
                  {t("checkout.shipping_location")} *
                </label>
                <select
                  id="shippingLocation"
                  value={shippingLocation}
                  onChange={handleLocationChange}
                  className="w-full p-3 border rounded-md"
                >
                  <option value="Cairo">القاهرة والجيزة </option>
                  <option value="Alexandria">الإسكندرية </option>
                  <option value="Delta">الدلتا والقناة </option>
                  <option value="UpperEgypt">الصعيد والبحر الأحمر</option>
                </select>
              </div>

              <div>
                <label htmlFor="city" className="block mb-2 font-medium">
                  {t("checkout.city")} *
                </label>
                <Input
                  id="city"
                  placeholder="المدينة"
                  {...register("city", {
                    required: t("validation.required"),
                  })}
                  className={errors.city && "border-red-500"}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="block mb-2 font-medium">
                  {t("checkout.address")} *
                </label>
                <Textarea
                  id="address"
                  rows={2}
                  placeholder="اسم الشارع، رقم العمارة، الدور، الشقة"
                  {...register("address", {
                    required: t("validation.required"),
                  })}
                  className={errors.address && "border-red-500"}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="postalCode" className="block mb-2 font-medium">
                  {t("checkout.postal_code")} *
                </label>
                <Input
                  id="postalCode"
                  placeholder="12345"
                  {...register("postalCode", {
                    required: t("validation.required"),
                  })}
                  className={errors.postalCode && "border-red-500"}
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader className="text-xl font-bold">
              {t("checkout.payment_method")}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <input
                    type="radio"
                    id="creditCard"
                    value="creditCard"
                    {...register("paymentMethod")}
                    className="h-5 w-5"
                  />
                  <label htmlFor="creditCard" className="font-medium flex-1">
                    <div>{t("checkout.credit_card")}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {t("checkout.credit_card_description")}
                    </div>
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <input
                    type="radio"
                    id="cashOnDelivery"
                    value="cashOnDelivery"
                    {...register("paymentMethod")}
                    className="h-5 w-5"
                  />
                  <label
                    htmlFor="cashOnDelivery"
                    className="font-medium flex-1"
                  >
                    <div>{t("checkout.cash_on_delivery")}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {t("checkout.cash_on_delivery_description")}
                    </div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader className="text-xl font-bold">
              {t("checkout.order_summary")}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => {
                    const itemTotal =
                      typeof item.price === "string"
                        ? parseFloat(item.price) * item.quantity
                        : item.price * item.quantity;

                    return (
                      <div key={item._id} className="flex justify-between">
                        <span className="truncate max-w-[180px]">
                          {item.name}{" "}
                          <span className="text-gray-500">
                            × {item.quantity}
                          </span>
                        </span>
                        <span className="whitespace-nowrap">
                          {formatPrice(itemTotal)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span>{t("checkout.subtotal")}</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      {t("checkout.shipping")} (
                      {shippingLocation === "Cairo"
                        ? "القاهرة"
                        : shippingLocation === "Alexandria"
                        ? "الإسكندرية"
                        : shippingLocation === "Delta"
                        ? "الدلتا"
                        : "الصعيد"}
                      )
                    </span>
                    <span>{formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>{t("checkout.total")}</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full py-6 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("checkout.processing")}
                  </>
                ) : (
                  t("checkout.place_order")
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/lib/redux/slices/cartSlice";

import Link from "next/link";
import Image from "next/image";
import { X, ShoppingCart } from "lucide-react";
import { useTranslation } from "@/lib/use-translation";
import { toast } from "sonner";

export default function CartPage() {
  const { t } = useTranslation();
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleRemoveItem = (id, name) => {
    dispatch(removeFromCart(id));
    toast.error(t("cart.removed_item", { name }));
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity < 1) {
      dispatch(removeFromCart(id));
      toast.error(
        t("cart.removed_item", {
          name: items.find((item) => item._id === id)?.name,
        })
      );
      return;
    }
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClearCart = () => {
    if (items.length === 0) return;
    dispatch(clearCart());
    toast.info(t("cart.cleared"));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("cart.title")}</h1>

      {items.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="text-xl font-semibold mb-4">{t("cart.empty")}</h2>
          <Button asChild>
            <Link href="/products">{t("cart.continue_shopping")}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {items.length} {t("cart.items")}
              </h2>
              <Button
                variant="link"
                className="text-red-500"
                onClick={handleClearCart}
                disabled={items.length === 0}
              >
                {t("cart.clear_cart")}
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm divide-y dark:bg-gray-800 dark:divide-gray-700">
              {items.map((item) => (
                <div key={item._id} className="p-4 flex gap-4">
                  <div className="relative w-24 h-24 bg-gray-100 rounded-lg dark:bg-gray-700">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <ShoppingCart className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <Link
                        href={`/products/${item._id}`}
                        className="font-semibold dark:text-white hover:underline"
                      >
                        {item.name}
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-red-500"
                        onClick={() => handleRemoveItem(item._id, item.name)}
                        aria-label={t("cart.remove_item")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-gray-500 text-sm dark:text-gray-400">
                      {t("price_prefix")} {item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center mt-4">
                      <div className="flex items-center border rounded-md dark:border-gray-600">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-3"
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          aria-label={t("cart.decrease_quantity")}
                        >
                          -
                        </Button>
                        <span className="mx-4 w-8 text-center dark:text-white">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="px-3"
                          onClick={() =>
                            handleUpdateQuantity(item._id, item.quantity + 1)
                          }
                          aria-label={t("cart.increase_quantity")}
                        >
                          +
                        </Button>
                      </div>
                      <div className="ml-auto font-medium dark:text-white">
                        {t("price_prefix")}{" "}
                        {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">
              {t("cart.order_summary")}
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  {t("cart.subtotal")} (
                  {items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  {t("cart.items")})
                </span>
                <span className="dark:text-white">
                  {t("price_prefix")} {total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  {t("cart.shipping")}
                </span>
                <span className="text-green-600 dark:text-green-400">
                  {t("cart.free")}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-4 border-t dark:border-gray-700">
                <span className="dark:text-white">{t("cart.total")}</span>
                <span className="dark:text-white">
                  {t("price_prefix")} {total.toFixed(2)}
                </span>
              </div>
              <Button className="w-full mt-6" size="lg" asChild>
                <Link href="/checkout">{t("cart.checkout")}</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full mt-2"
                size="lg"
                asChild
              >
                <Link href="/products">{t("cart.continue_shopping")}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

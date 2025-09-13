"use client";

import { useEffect, use } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductById,
  fetchProducts,
} from "@/lib/redux/slices/productSlice";
import { addToCart } from "@/lib/redux/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/lib/redux/slices/wishlistSlice";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  ChevronLeft,
  Star,
  Check,
  Truck,
} from "lucide-react";
import { useTranslation } from "@/lib/use-translation";
import { toast } from "sonner";

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const dispatch = useDispatch();

  // Fix: Make sure you're accessing the correct state structure
  // Fix: Access the correct properties from Redux state
  const {
    currentProduct,
    items: products,
    status,
    error,
  } = useSelector((state) => state.products || {});
  const wishlist = useSelector((state) => state.wishlist?.items || []);
  const cart = useSelector((state) => state.cart?.items || []);

  const { t } = useTranslation();

  useEffect(() => {

    const productPromise = dispatch(fetchProductById(id));
    const productsPromise = dispatch(fetchProducts());



  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (!currentProduct) return;

    dispatch(addToCart(currentProduct));
    toast.success(t("product.added_to_cart"), {
      position: "top-center",
      duration: 2000,
    });
  };

  const handleWishlistToggle = () => {
    if (!currentProduct) return;

    const isInWishlist = wishlist.some(
      (item) => item._id === currentProduct._id
    );
    if (isInWishlist) {
      dispatch(removeFromWishlist(currentProduct._id));
      toast.info(t("wishlist.removed"), {
        position: "top-center",
        duration: 2000,
      });
    } else {
      dispatch(addToWishlist(currentProduct));
      toast.success(t("wishlist.added"), {
        position: "top-center",
        duration: 2000,
      });
    }
  };

  // Fix: Add error handling
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            {t("loading")}
          </p>
        </div>
      </div>
    );
  }

  if (status === "failed" || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
        <div className="text-center space-y-4">
          <p className="text-red-500 text-lg dark:text-red-400">
            {t("errors.fetch_failed")}
          </p>
          <Link href="/">
            <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
              {t("actions.back_to_home")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
        <div className="text-center space-y-4">
          <p className="text-red-500 text-lg dark:text-red-400">
            {t("errors.product_not_found")}
          </p>
          <Link href="/">
            <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
              {t("actions.back_to_home")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isInCart = cart.some((item) => item._id === currentProduct._id);
  const isInWishlist = wishlist.some((item) => item._id === currentProduct._id);

  // Fix: Add safety check for products array
  const recommendedProducts = (products || [])
    .filter(
      (prod) =>
        prod.category === currentProduct.category &&
        prod._id !== currentProduct._id
    )
    .slice(0, 4);



  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="font-medium">{t("actions.back_to_products")}</span>
      </Link>

      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="bg-white rounded-xl p-4 dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="aspect-square relative rounded-lg overflow-hidden">
              {currentProduct.image ? (
                <Image
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  fill
                  className="object-contain hover:scale-105 transition-transform duration-300"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl w-full h-full flex items-center justify-center dark:bg-gray-700 dark:border-gray-600">
                  <span className="text-gray-500 dark:text-gray-400">
                    {t("product.no_image")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Title and Brand */}
          <div>
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              {currentProduct.brand || t("product.brand_placeholder")}
            </span>
            <h1 className="text-3xl font-bold mt-1 mb-2 dark:text-white">
              {currentProduct.name}
            </h1>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(currentProduct.rating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentProduct.rating?.toFixed(1)} ·{" "}
                {currentProduct.numbersOfRating || 0} {t("product.reviews")}
              </span>
              <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline">
                {t("product.write_review")}
              </span>
            </div>
          </div>

          {/* Price Section */}
          <div className="space-y-2">
            {currentProduct.discount > 0 ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    {t("price_prefix")}
                    {(
                      currentProduct.price *
                      (1 - currentProduct.discount / 100)
                    ).toFixed(2)}
                  </span>
                  <span className="text-sm bg-red-100 text-red-800 px-2 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300 font-medium">
                    -{currentProduct.discount}%
                  </span>
                </div>
                <span className="text-lg text-gray-500 line-through dark:text-gray-400">
                  {t("price_prefix")}
                  {currentProduct.price}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {t("price_prefix")}
                {currentProduct.price}
              </span>
            )}

            {/* Savings message */}
            {currentProduct.discount > 0 && (
              <p className="text-sm text-green-600 dark:text-green-400">
                {t("product.save_amount", {
                  amount: (
                    currentProduct.price *
                    (currentProduct.discount / 100)
                  ).toFixed(2),
                })}
              </p>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2 text-sm">
            {currentProduct.stock ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-green-600 dark:text-green-400">
                  {t("product.in_stock")}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  · {t("product.ships_in")} 3 - 4 {t("product.days")}
                </span>
              </>
            ) : (
              <>
                <span className="text-red-600 dark:text-red-400">
                  {t("product.out_of_stock")}
                </span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            {/* Add to Cart */}
            <Button
              className={`flex-1 py-6 text-base font-medium ${
                isInCart
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              onClick={handleAddToCart}
              disabled={!currentProduct.stock}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isInCart ? t("product.in_cart") : t("product.add_to_cart")}
            </Button>

            {/* Wishlist */}
            <Button
              variant={isInWishlist ? "default" : "outline"}
              size="icon"
              className={`w-14 h-14 ${
                isInWishlist
                  ? "bg-red-500 hover:bg-red-600"
                  : "border-gray-300 dark:border-gray-600"
              }`}
              onClick={handleWishlistToggle}
            >
              <Heart
                className={`w-5 h-5 ${
                  isInWishlist ? "fill-white text-white" : ""
                }`}
              />
            </Button>
          </div>

          {/* Highlights */}
          <div className="pt-4">
            <h3 className="font-medium text-lg mb-2 dark:text-white">
              {t("product.highlights")}
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              {currentProduct.features?.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              )) || (
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t("product.premium_quality")}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Product Details */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-lg mb-3 dark:text-white">
              {t("product.details")}
            </h3>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <DetailRow
                label={t("product.category")}
                value={currentProduct.category}
              />
              <DetailRow
                label={t("product.brand")}
                value={currentProduct.brand || t("product.brand_placeholder")}
              />
              <DetailRow
                label={t("product.sku")}
                value={currentProduct._id.slice(0, 8).toUpperCase()}
              />
              <DetailRow
                label={t("product.weight")}
                value={currentProduct.weight || "0.5 kg"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          {t("product.description")}
        </h2>
        <div className="prose max-w-none dark:prose-invert">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {currentProduct.description}
          </p>
          {currentProduct.details && (
            <p className="text-gray-700 dark:text-gray-300 mt-4 leading-relaxed">
              {currentProduct.details}
            </p>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold dark:text-white">
            {t("product.recommended")}
          </h2>
          <Link
            href="/"
            className="text-indigo-600 hover:underline dark:text-indigo-400"
          >
            {t("product.view_all")}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">


          {recommendedProducts.length > 0 ? (
            recommendedProducts.map((prod) => (
              <Link
                href={`/products/${prod._id}`}
                key={prod._id}
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <div className="aspect-square relative">
                  {prod.image ? (
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform p-4"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                      {t("product.no_image")}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {prod.name}
                  </h3>
                  <div className="flex items-center mt-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(prod.rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1 dark:text-gray-400">
                      ({prod.numbersOfRating || 0})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {prod.discount > 0 ? (
                      <>
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">
                          {t("price_prefix")}
                          {(prod.price * (1 - prod.discount / 100)).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                          {t("price_prefix")}
                          {prod.price}
                        </span>
                      </>
                    ) : (
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">
                        {t("price_prefix")}
                        {prod.price}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {t("product.no_recommendations")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, valueClass = "" }) {
  return (
    <div className="flex">
      <span className="w-28 text-gray-500 dark:text-gray-400 font-medium">
        {label}
      </span>
      <span className={`flex-1 dark:text-white ${valueClass}`}>{value}</span>
    </div>
  );
}

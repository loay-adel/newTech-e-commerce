"use client";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "@/lib/redux/slices/wishlistSlice";
import { addToCart } from "@/lib/redux/slices/cartSlice";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, Check, Heart } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/lib/use-translation";

const Wishlist = () => {
  const { items } = useSelector((state) => state.wishlist);
  const [addingStates, setAddingStates] = useState({});
  const [removingStates, setRemovingStates] = useState({});
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleRemove = (productId) => {
    setRemovingStates((prev) => ({ ...prev, [productId]: true }));

    setTimeout(() => {
      dispatch(removeFromWishlist(productId));
      setRemovingStates((prev) => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
    }, 300);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    setAddingStates((prev) => ({ ...prev, [product._id]: true }));

    dispatch(
      addToCart({
        _id: product._id,
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug,
        quantity: 1,
      })
    );

    setTimeout(() => {
      setAddingStates((prev) => {
        const newState = { ...prev };
        delete newState[product._id];
        return newState;
      });
    }, 800);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-[60vh]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
          {t("wishlist.title")}
        </h1>
        {items.length > 0 && (
          <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
            {items.length} {t("wishlist.items")}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-10 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner">
          <Heart className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            {t("wishlist.empty")}
          </p>

          <Button asChild>
            <Link href="/products">{t("home.hero.browse_products")}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {items.map((product) => {
            const isAdding = addingStates[product._id || product.id];
            const isRemoving = removingStates[product._id || product.id];
            const isOutOfStock = product.stock === 0;
            const productId = product._id || product.id;

            return (
              <div
                dir="ltr"
                key={productId}
                className={`flex flex-col  sm:flex-row items-center bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 p-4 border border-gray-100 dark:border-gray-800 ${
                  isRemoving ? "opacity-50 scale-95" : ""
                }`}
              >
                <Link
                  href={`/products/${productId}`}
                  className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 relative rounded-md overflow-hidden mr-4 sm:mr-6"
                >
                  <Image
                    src={product.image || "/placeholder-product.jpg"}
                    alt={product.name}
                    fill
                    sizes="128px"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </Link>

                <div className="flex-grow text-center sm:text-left mt-4 sm:mt-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
                    <Link
                      href={`/products/${productId}`}
                      className="hover:underline"
                    >
                      {product.name}
                    </Link>
                  </h3>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {formatPrice(product.price)}
                  </p>
                  {isOutOfStock && (
                    <p className="text-xs text-red-500 mt-1 font-medium">
                      {t("product.out_of_stock")}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-center sm:justify-end space-x-2 mt-4 sm:mt-0">
                  <Button
                    onClick={() => handleRemove(productId)}
                    variant="outline"
                    size="sm"
                    disabled={isRemoving}
                    className={`text-red-600 cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:border-red-800 transition-colors ${
                      isRemoving ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t("wishlist.remove")}
                  </Button>

                  <Button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={isAdding || isOutOfStock || isRemoving}
                    size="sm"
                    className={`h-9 sm:h-10 text-xs sm:text-sm font-medium transition-all duration-300 min-w-[120px] cursor-pointer ${
                      isAdding
                        ? "bg-green-600 hover:bg-green-600 text-white scale-95 cursor-default"
                        : isOutOfStock
                        ? "bg-gray-400 hover:bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-lg hover:shadow-blue-500/25 active:scale-95"
                    }`}
                  >
                    {isAdding ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        {t("product.added_to_cart")}
                      </>
                    ) : isOutOfStock ? (
                      t("product.out_of_stock")
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {t("product.add_to_cart")}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

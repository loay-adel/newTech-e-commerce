"use client";

import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/lib/redux/slices/cartSlice";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Heart, Eye, Star, Zap } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/lib/use-translation";
import {
  addToWishlist,
  removeFromWishlist,
  selectWishlistItems,
} from "@/lib/redux/slices/wishlistSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlist = useSelector(selectWishlistItems);
  const [isAdding, setIsAdding] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { t } = useTranslation();

  const isLiked = wishlist.some((item) => item.id === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug,
      })
    );
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLiked) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(
        addToWishlist({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          slug: product.slug,
        })
      );
    }
  };

  const formatPrice = (price) => {
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      console.error("Invalid price value:", price);
      return "$0.00";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EGP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numericPrice);
  };

  const originalPrice =
    product.discount > 0 ? product.price / (1 - product.discount / 100) : null;

  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-500 hover:border-gray-200 dark:hover:border-gray-700 hover:-translate-y-1">
      {/* Background Gradient on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Product Link - Only wraps content, not buttons */}
      <Link href={`/products/${product._id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
          {/* Loading Skeleton */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse"></div>
          )}

          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onLoad={() => setImageLoading(false)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="text-center text-gray-400 dark:text-gray-600">
                <svg
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-xs sm:text-sm font-medium">No Image</p>
              </div>
            </div>
          )}

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden sm:flex items-center justify-center space-x-3 pointer-events-none">
            {/* Content remains the same but now with pointer-events-none */}
          </div>

          {/* Badges */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col space-y-2 pointer-events-none">
            {product.discount > 0 && (
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-lg shadow-lg flex items-center space-x-1 animate-pulse">
                <Zap className="w-3 h-3" />
                <span>{product.discount}% OFF</span>
              </div>
            )}
            {product.isNew && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                NEW
              </div>
            )}
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="relative p-3 sm:p-4 space-y-3">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg font-medium">
              {product.category || "Category"}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                {product.rating || "4.0"}
              </span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 line-clamp-2 leading-tight">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            {product.discount > 0 && (
              <div className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">
                You save {formatPrice(originalPrice - product.price)}
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                product.stock > 0 ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span
              className={`text-xs sm:text-sm font-medium ${
                product.stock > 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {product.stock > 0 ? ` in stock` : "Out of stock"}
            </span>
          </div>
        </div>
      </Link>

      {/* Wishlist Button - Now positioned outside the Link */}
      <button
        onClick={handleLike}
        className={`absolute top-2 sm:top-3 right-2 sm:right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 z-10 ${
          isLiked
            ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
            : "bg-white/80 text-gray-700 hover:bg-white hover:text-red-500"
        }`}
      >
        <Heart
          className={`w-3 h-3 sm:w-4 sm:h-4 ${isLiked ? "fill-current" : ""}`}
        />
      </button>

      {/* Action Buttons - Now outside the Link */}
      <div className="p-3 sm:p-4 pt-0 grid grid-cols-2 gap-2 sm:gap-3">
        <Button
          variant="outline"
          size="sm"
          className="h-9 sm:h-10 text-xs sm:text-sm border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-200"
          asChild
        >
          <Link
            href={`/products/${product._id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Details</span>
            <span className="sm:hidden">View</span>
          </Link>
        </Button>

        <Button
          onClick={handleAddToCart}
          disabled={isAdding || product.stock === 0}
          size="sm"
          className={`h-9 sm:h-10 text-xs sm:text-sm font-medium transition-all duration-300 ${
            isAdding
              ? "bg-green-600 hover:bg-green-700 scale-95"
              : product.stock === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
          }`}
        >
          {isAdding ? (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="hidden sm:inline">Adding...</span>
            </div>
          ) : product.stock === 0 ? (
            <span className="text-xs sm:text-sm">Sold Out</span>
          ) : (
            <div className="flex items-center">
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add to Cart</span>
              <span className="sm:hidden">Add</span>
            </div>
          )}
        </Button>
      </div>

      {/* Loading Overlay */}
      {isAdding && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">
              Adding to cart...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

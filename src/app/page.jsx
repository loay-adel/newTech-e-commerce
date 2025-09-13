"use client";

import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { fetchProducts } from "@/lib/redux/slices/productSlice";
import Link from "next/link";
import { useTranslation } from "@/lib/use-translation";
import { cn } from "@/lib/utils";

// Reusable Empty State Component
const EmptyState = ({ icon, message }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
      {icon}
    </div>
    <p className="text-lg text-gray-500 dark:text-gray-400">{message}</p>
  </div>
);

export default function Home() {
  const { t, currentLanguage } = useTranslation();
  const dispatch = useDispatch();
  const {
    items: products,
    status,
    error,
  } = useSelector(
    (state) => state.products,
    (prev, next) => prev.status === next.status && prev.items === next.items
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const uniqueCategories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  );

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="text-center backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-indigo-600 mx-auto dark:border-gray-700 dark:border-t-indigo-400"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 animate-pulse"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300">
            {t("loading")}
          </p>
          <div className="mt-2 flex justify-center space-x-1">
            <div
              className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 dark:from-gray-900 dark:to-red-950/20">
        <div className="text-center backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-2xl p-8 shadow-2xl border border-red-200/50 dark:border-red-800/50 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5C2.962 18.333 3.924 20 5.464 20z"
              />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
            {error || t("errors.fetch_products")}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t("errors.fetch_products_message")}
          </p>
          <Button
            onClick={() => dispatch(fetchProducts())}
            className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label={t("actions.try_again")}
          >
            {t("actions.try_again")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800"
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
    >
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        aria-labelledby="hero-title"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900 dark:from-indigo-950 dark:via-blue-900 dark:to-purple-950">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-8 left-1/3 w-72 h-72 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div
            className={cn(
              "max-w-3xl",
              currentLanguage === "ar"
                ? "text-right mr-auto"
                : "text-left ml-auto"
            )}
          >
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/20">
                🎉 {t("home.hero.new_collection")}
              </span>
            </div>
            <h1
              id="hero-title"
              className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight text-white"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                {t("home.hero.title")}
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 leading-relaxed">
              {t("home.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="group relative overflow-hidden text-lg px-8 py-6 bg-white text-indigo-700 hover:bg-gray-50 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border-2 border-white/20"
                asChild
              >
                <Link
                  href="/products"
                  aria-label={t("home.hero.browse_products")}
                >
                  <span className="relative z-10">
                    {t("home.hero.browse_products")}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
                asChild
              >
                <Link href="/about" aria-label={t("home.hero.learn_more")}>
                  {t("home.hero.learn_more")}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div
            className="animate-bounce"
            aria-label={t("home.scroll_indicator")}
          >
            <svg
              className="w-6 h-6 text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 relative" aria-labelledby="featured-title">
        <div className="container mx-auto px-4">
          <div
            className={cn(
              "flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16",
              currentLanguage === "ar" ? "flex-row-reverse" : ""
            )}
          >
            <div
              className={cn(
                "flex-1",
                currentLanguage === "ar" ? "text-right" : "text-left"
              )}
            >
              <div className="inline-block p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h2
                id="featured-title"
                className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white"
              >
                {t("home.featured.title")}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("home.featured.subtitle")}
              </p>
            </div>
            <Button
              variant="link"
              className="group text-lg text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold mt-4 lg:mt-0"
              asChild
            >
              <Link href="/products" aria-label={t("home.featured.view_all")}>
                {t("home.featured.view_all")}
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </Button>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.slice(0, 8).map((product, index) => (
                <div
                  key={product._id}
                  className="transform hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              }
              message={t("home.featured.no_products")}
            />
          )}
        </div>
      </section>

      {/* Categories Auto-Scroller */}
      <section
        className="py-12 sm:py-16 bg-gradient-to-r from-gray-900 via-black to-gray-900 relative overflow-hidden"
        aria-labelledby="categories-title"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E')]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div
            className={cn(
              "text-center mb-8 sm:mb-10",
              currentLanguage === "ar" ? "text-right" : "text-left"
            )}
          >
            <div className="inline-block p-2 sm:p-3 bg-purple-500/20 rounded-lg sm:rounded-xl mb-3 sm:mb-4">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h2
              id="categories-title"
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 text-white text-center"
            >
              {t("home.categories.title")}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-400 text-center max-w-xl sm:max-w-2xl mx-auto px-2 sm:px-4">
              {t("home.categories.subtitle")}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="relative">
              {/* Mobile: Horizontal Scroll */}
              <div className="block md:hidden">
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                  {uniqueCategories.map((category, index) => (
                    <Link
                      key={category}
                      href={`/categories/${category.toLowerCase()}`}
                      className="group/card flex-shrink-0 w-60 sm:w-64 p-4 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 rounded-lg shadow-md hover:shadow-purple-500/25 snap-start"
                      aria-label={t("home.categories.explore", { category })}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 rounded-md bg-purple-500/20 flex items-center justify-center">
                            <span className="text-base">📦</span>
                          </div>
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-white mb-2 group-hover/card:text-transparent group-hover/card:bg-clip-text group-hover/card:bg-gradient-to-r group-hover/card:from-purple-400 group-hover/card:to-pink-500 transition-all duration-300">
                          {category}
                        </h3>
                        <p className="text-gray-400 font-mono text-xs sm:text-sm">
                          {
                            products.filter((p) => p.category === category)
                              .length
                          }{" "}
                          {t("home.categories.products")}
                        </p>
                        <div className="mt-2 flex items-center text-purple-400 group-hover/card:text-purple-300">
                          <span className="text-xs font-medium">
                            {t("home.categories.explore")}
                          </span>
                          <svg
                            className="w-3 h-3 ml-1 group-hover/card:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                {/* Mobile scroll indicator */}
                <div className="flex justify-center mt-3 space-x-1">
                  {uniqueCategories
                    .slice(0, Math.min(uniqueCategories.length, 5))
                    .map((_, index) => (
                      <div
                        key={index}
                        className="w-1.5 h-1.5 rounded-full bg-gray-600 animate-pulse"
                        style={{ animationDelay: `${index * 200}ms` }}
                      ></div>
                    ))}
                </div>
              </div>

              {/* Desktop: Auto-scroll Animation */}
              <div className="hidden md:block">
                <div className="flex overflow-x-hidden group">
                  <div
                    className="flex animate-scroll hover:animation-pause"
                    dir={currentLanguage === "ar" ? "rtl" : "ltr"}
                  >
                    {uniqueCategories.map((category, index) => (
                      <Link
                        key={category}
                        href={`/categories/${category.toLowerCase()}`}
                        className="group/card flex-shrink-0 w-80 mx-3 p-6 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 rounded-xl shadow-xl hover:shadow-purple-500/25"
                        aria-label={t("home.categories.explore", { category })}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                              <span className="text-lg">📦</span>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover/card:text-transparent group-hover/card:bg-clip-text group-hover/card:bg-gradient-to-r group-hover/card:from-purple-400 group-hover/card:to-pink-500 transition-all duration-300">
                            {category}
                          </h3>
                          <p className="text-gray-400 font-mono text-base">
                            {
                              products.filter((p) => p.category === category)
                                .length
                            }{" "}
                            {t("home.categories.products")}
                          </p>
                          <div className="mt-3 flex items-center text-purple-400 group-hover/card:text-purple-300">
                            <span className="text-sm font-medium">
                              {t("home.categories.explore")}
                            </span>
                            <svg
                              className="w-4 h-4 ml-1 group-hover/card:translate-x-1 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {uniqueCategories.map((category) => (
                      <Link
                        key={`${category}-clone`}
                        href={`/category/${category.toLowerCase()}`}
                        className="group/card flex-shrink-0 w-80 mx-3 p-6 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 rounded-xl shadow-xl hover:shadow-purple-500/25"
                        aria-hidden="true"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                              <span className="text-lg">📦</span>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">
                            {category}
                          </h3>
                          <p className="text-gray-400 font-mono text-base">
                            {
                              products.filter((p) => p.category === category)
                                .length
                            }{" "}
                            {t("home.categories.products")}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                <div
                  className={cn(
                    "absolute top-0 w-24 h-full z-20 pointer-events-none",
                    currentLanguage === "ar"
                      ? "right-0 bg-gradient-to-l from-black via-black/80 to-transparent"
                      : "left-0 bg-gradient-to-r from-black via-black/80 to-transparent"
                  )}
                ></div>
                <div
                  className={cn(
                    "absolute top-0 w-24 h-full z-20 pointer-events-none",
                    currentLanguage === "ar"
                      ? "left-0 bg-gradient-to-r from-black via-black/80 to-transparent"
                      : "right-0 bg-gradient-to-l from-black via-black/80 to-transparent"
                  )}
                ></div>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              }
              message={t("home.categories.no_categories")}
            />
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section
        className="py-10 md:py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950"
        aria-labelledby="new-arrivals-title"
      >
        <div className="container mx-auto px-4">
          <div
            className={cn(
              "flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16",
              currentLanguage === "ar" ? "flex-row-reverse" : ""
            )}
          >
            <div
              className={cn(
                "flex-1",
                currentLanguage === "ar" ? "text-right" : "text-left"
              )}
            >
              <div className="inline-block p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mb-4">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2
                id="new-arrivals-title"
                className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white"
              >
                {t("home.new_arrivals.title")}
              </h2>
              <p className="text-md text-gray-600 dark:text-gray-400 leading-relaxed">
                {t("home.new_arrivals.subtitle")}
              </p>
            </div>
            <Button
              variant="link"
              className="group text-lg text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold mt-4 lg:mt-0"
              asChild
            >
              <Link
                href="/categories"
                aria-label={t("home.new_arrivals.view_all")}
              >
                {t("home.new_arrivals.view_all")}
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </Button>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.slice(-8).map((product, index) => (
                <div
                  key={product._id}
                  className="transform hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <div className="absolute -top-2 -right-2 z-10">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                        {t("home.new_arrivals.new")}
                      </span>
                    </div>
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              message={t("home.new_arrivals.no_products")}
            />
          )}
        </div>
      </section>

      {/* Newsletter/CTA Section */}
      <section
        className="py-20 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 relative overflow-hidden"
        aria-labelledby="newsletter-title"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full mix-blend-overlay filter blur-2xl animate-float-delayed"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block p-3 bg-white/10 backdrop-blur-sm rounded-xl mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2
              id="newsletter-title"
              className="text-4xl md:text-5xl font-bold mb-6 text-white"
            >
              {t("home.newsletter.title")}
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              {t("home.newsletter.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto items-center">
              <input
                type="email"
                placeholder={t("home.newsletter.placeholder")}
                className="flex-1 px-6 py-4 rounded-xl bg-white/90 backdrop-blur-sm border border-white/20 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/25 transition-all duration-300"
                aria-label={t("home.newsletter.placeholder")}
              />
              <Button
                size="lg"
                className="px-8 py-4 bg-white text-indigo-600 hover:bg-gray-100 font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                aria-label={t("home.newsletter.subscribe")}
              >
                {t("home.newsletter.subscribe")}
              </Button>
            </div>
            <p className="mt-6 text-sm text-blue-200">
              {t("home.newsletter.privacy")}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="py-16 bg-white dark:bg-gray-900"
        aria-labelledby="stats-title"
      >
        <div className="container mx-auto px-4">
          <h2 id="stats-title" className="sr-only">
            {t("home.stats.title")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {products.length}+
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                {t("home.stats.products")}
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                10K+
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                {t("home.stats.customers")}
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                4.9
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                {t("home.stats.rating")}
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                24/7
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                {t("home.stats.support")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

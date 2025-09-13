// components/Header.jsx
"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  LogIn,
  UserPlus,
  LogOut,
  Sparkles,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { selectWishlistCount } from "@/lib/redux/slices/wishlistSlice";
import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/use-translation";
import { useDispatch, useSelector } from "react-redux";
import {
  logoutUser,
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/lib/redux/slices/userSlice";

const Header = () => {
  const { setTheme, theme } = useTheme();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const wishlistCount = useSelector(selectWishlistCount);
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { t, changeLanguage, currentLanguage, isRTL } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const headerRef = useRef(null);
  const router = useRouter();

  const CATEGORIES = [
    {
      name: t("categories.pre_builds"),
      subcategories: [t("categories.new"), t("categories.used")],
      icon: "🖥️",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      name: t("categories.pc_parts"),
      subcategories: [t("categories.memory"), t("categories.storage")],
      icon: "🔧",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      name: t("categories.accessories"),
      subcategories: [
        t("categories.keyboards"),
        t("categories.mice"),
        t("categories.headphones"),
        t("categories.gaming_accessories"),
        t("categories.adapters"),
        t("categories.speakers"),
        t("categories.webcams"),
        t("categories.networking"),
        t("categories.accessories"),
        t("categories.power"),
        t("categories.cleaning"),
      ],
      icon: "🎮",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
        setSearchVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const toggleCategory = useCallback((index) => {
    setExpandedCategory((prev) => (prev === index ? null : index));
  }, []);

  const toggleLanguage = () => {
    const newLang = currentLanguage === "en" ? "ar" : "en";
    changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  const handleSignOut = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      setMobileMenuOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <>
      {/* Floating particles background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20" />
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse"
          />
        ))}
      </div>

      <header
        ref={headerRef}
        className={`sticky top-0 z-50 w-full transition-all duration-500 ease-out will-change-transform ${
          scrolled
            ? "bg-white/80 dark:bg-gray-900/85 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/10 dark:shadow-black/30"
            : "bg-white/70 dark:bg-gray-900/75 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/65"
        }`}
        dir={isRTL === "ar" ? "rtl" : "ltr"}
        style={{
          background: scrolled
            ? `radial-gradient(600px circle at ${mousePosition.x}px ${
                mousePosition.y
              }px, ${
                document.documentElement.classList.contains("dark")
                  ? "rgba(99, 102, 241, 0.03), transparent 50%), rgba(17, 24, 39, 0.85)"
                  : "rgba(99, 102, 241, 0.05), transparent 50%), rgba(255, 255, 255, 0.8)"
              }`
            : undefined,
        }}
      >
        {/* Animated top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60 animate-pulse" />

        <div className="container mx-auto flex h-16 md:h-18 items-center justify-between px-4">
          {/* Mobile menu button */}
          <div
            className={`flex md:hidden ${
              currentLanguage === "ar" ? "order-3" : ""
            }`}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="relative rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50 transition-all duration-300 group overflow-hidden"
              aria-expanded={mobileMenuOpen}
              aria-label={t("aria_labels.toggle_menu")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative transform transition-transform duration-300 group-hover:scale-110">
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </div>
            </Button>
          </div>

          {/* Enhanced Logo - Fixed for mobile */}
          <div
            className={`flex flex-1 ${
              currentLanguage === "ar"
                ? "justify-end md:justify-start"
                : "justify-start"
            }`}
          >
            <Link
              href="/"
              className="group flex items-center space-x-2 rtl:space-x-reverse transition-all duration-300 hover:scale-105"
              aria-label={t("aria_labels.home")}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 w-8 h-8 md:w-10 md:h-10 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white font-bold text-sm md:text-lg drop-shadow-sm">
                    S
                  </span>
                  <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-pink-700 transition-all duration-300">
                  {t("brand_name")}
                </span>
                <div className="h-px bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            </Link>
          </div>

          {/* Enhanced Desktop Navigation */}
          <NavigationMenu className="hidden md:block mx-4 flex-1">
            <NavigationMenuList
              className={`flex ${
                currentLanguage === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              {CATEGORIES.map((category, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuTrigger className="group bg-transparent px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 transition-all duration-300 border border-transparent hover:border-blue-200/50 dark:hover:border-blue-800/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center gap-2">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20" />
                    <div className="relative grid w-[450px] gap-2 p-6 md:w-[550px] md:grid-cols-2">
                      {category.subcategories.map((sub, subIndex) => (
                        <NavigationMenuLink
                          key={subIndex}
                          asChild
                          className="block rounded-xl p-4 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50 group backdrop-blur-sm hover:shadow-lg"
                        >
                          <Link
                            href={`/categories/${sub.toLowerCase()}`}
                            className="flex items-center space-x-3 rtl:space-x-reverse"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <div
                              className={`bg-gradient-to-r ${category.gradient} w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110`}
                            >
                              <div className="bg-white/30 w-7 h-7 rounded-lg flex items-center justify-center">
                                <div className="bg-white/60 w-4 h-4 rounded-full" />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                {sub}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Explore products
                              </span>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Enhanced Right Actions */}
          <div
            className={`flex items-center space-x-2 md:space-x-3 rtl:space-x-reverse ${
              currentLanguage === "ar" ? "order-first md:order-none" : ""
            }`}
          >
            {/* Enhanced Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-md group"
            >
              <span className="text-lg">🌐</span>
              <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {currentLanguage === "en" ? "العربية" : "English"}
              </span>
            </Button>

            {/* Enhanced Cart */}
            <Link href="/cart" aria-label={t("aria_labels.cart")}>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50 transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <ShoppingCart
                  size={20}
                  className="relative transform transition-transform duration-300 group-hover:scale-110"
                />
                {cart.length > 0 && (
                  <div className="absolute right-1 top-1 flex items-center justify-center">
                    <div className="absolute w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-ping opacity-30" />
                    <span className="relative flex size-4 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs font-bold text-white shadow-lg animate-bounce">
                      {cart.length}
                    </span>
                  </div>
                )}
              </Button>
            </Link>
            {/* Enhanced Wishlist */}
            <Link href="/wishlist" aria-label={t("aria_labels.wishlist")}>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 
               dark:hover:from-blue-950/50 dark:hover:to-purple-950/50 transition-all duration-300 group overflow-hidden"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-red-500/10 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300"
                />
                <Heart
                  size={20}
                  className="relative transform transition-transform duration-300 group-hover:scale-110 
                 text-pink-500 dark:text-pink-400"
                />
                {/* Optional: wishlist count badge */}
                {wishlistCount > 0 && (
                  <div className="absolute right-1 top-1 flex items-center justify-center">
                    <div className="absolute w-6 h-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-ping opacity-30" />
                    <span
                      className="relative flex size-4 items-center justify-center rounded-full 
                         bg-gradient-to-r from-pink-500 to-red-500 text-xs font-bold text-white shadow-lg animate-bounce"
                    >
                      {wishlistCount}
                    </span>
                  </div>
                )}
              </Button>
            </Link>

            {/* Enhanced Desktop Account Menu */}
            <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50 transition-all duration-300 group overflow-hidden"
                    aria-label={t("aria_labels.account")}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {isAuthenticated ? (
                      <div className="relative w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                        <span className="text-white">
                          {currentUser?.name
                            ? currentUser.name[0].toUpperCase()
                            : "U"}
                        </span>
                      </div>
                    ) : (
                      <User
                        size={20}
                        className="relative transform transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={currentLanguage === "ar" ? "start" : "end"}
                  className="rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-2 min-w-[200px] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20" />
                  {!isAuthenticated ? (
                    <div className="relative space-y-1">
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                          href="/signin"
                          className="flex items-center p-3 gap-3 rtl:gap-reverse rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300 group"
                        >
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors duration-300">
                            <LogIn
                              size={16}
                              className="text-blue-600 dark:text-blue-400"
                            />
                          </div>
                          <span className="font-medium">
                            {t("account.sign_in")}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                          href="/signup"
                          className="flex items-center p-3 gap-3 rtl:gap-reverse rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all duration-300 group"
                        >
                          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors duration-300">
                            <UserPlus
                              size={16}
                              className="text-purple-600 dark:text-purple-400"
                            />
                          </div>
                          <span className="font-medium">
                            {t("account.sign_up")}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    </div>
                  ) : (
                    <div className="relative space-y-1">
                      <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200/50 dark:border-gray-700/50 mb-2">
                        <div className="flex items-center gap-2">
                          <Sparkles size={14} className="text-blue-500" />
                          <span className="font-medium">
                            {currentUser?.name || currentUser?.email}
                          </span>
                        </div>
                      </div>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                          href="/account"
                          className="flex items-center p-3 gap-3 rtl:gap-reverse rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300 group"
                        >
                          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors duration-300">
                            <User
                              size={16}
                              className="text-blue-600 dark:text-blue-400"
                            />
                          </div>
                          <span className="font-medium">
                            {t("account.my_account")}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                          href="/orders"
                          className="flex items-center p-3 gap-3 rtl:gap-reverse rounded-xl hover:bg-green-50 dark:hover:bg-green-950/30 transition-all duration-300 group"
                        >
                          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50 group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors duration-300">
                            <ShoppingCart
                              size={16}
                              className="text-green-600 dark:text-green-400"
                            />
                          </div>
                          <span className="font-medium">
                            {t("account.orders")}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer p-0"
                        onClick={handleSignOut}
                      >
                        <button className="w-full flex items-center p-3 gap-3 rtl:gap-reverse text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all duration-300 group">
                          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50 group-hover:bg-red-200 dark:group-hover:bg-red-800/50 transition-colors duration-300">
                            <LogOut
                              size={16}
                              className="text-red-600 dark:text-red-400"
                            />
                          </div>
                          <span className="font-medium">
                            {t("account.sign_out")}
                          </span>
                        </button>
                      </DropdownMenuItem>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Enhanced Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50 transition-all duration-300 group overflow-hidden"
                    aria-label={t("aria_labels.toggle_theme")}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                      {mounted ? (
                        theme === "dark" ? (
                          <Moon
                            size={20}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        ) : (
                          <Sun size={20} className="text-yellow-600" />
                        )
                      ) : (
                        <Sun size={20} className="text-yellow-600" />
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={currentLanguage === "ar" ? "start" : "end"}
                  className="rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-2 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20" />
                  <div className="relative space-y-1">
                    <DropdownMenuItem
                      onClick={() => setTheme("light")}
                      className="cursor-pointer rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-950/30 transition-all duration-300 group"
                    >
                      <div className="flex items-center p-2 gap-3 rtl:gap-reverse">
                        <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800/50 transition-colors duration-300">
                          <Sun
                            size={16}
                            className="text-yellow-600 dark:text-yellow-400"
                          />
                        </div>
                        <span className="font-medium">{t("theme.light")}</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setTheme("dark")}
                      className="cursor-pointer rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300 group"
                    >
                      <div className="flex items-center p-2 gap-3 rtl:gap-reverse">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors duration-300">
                          <Moon
                            size={16}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        </div>
                        <span className="font-medium">{t("theme.dark")}</span>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 animate-in slide-in-from-top duration-500 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-950/10 dark:via-purple-950/5 dark:to-pink-950/10" />
            <div className="relative container mx-auto px-4 py-4">
              <div className="space-y-1">
                {CATEGORIES.map((category, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200/30 dark:border-gray-800/30 pb-3 mb-3 last:border-b-0"
                  >
                    <button
                      className="flex items-center justify-between w-full py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 transition-all duration-300 group"
                      onClick={() => toggleCategory(index)}
                      aria-expanded={expandedCategory === index}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                          {category.icon}
                        </span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {category.name}
                        </span>
                      </div>
                      <div className="transform transition-transform duration-300 group-hover:scale-110">
                        {expandedCategory === index ? (
                          <ChevronUp
                            size={20}
                            className="text-gray-500 dark:text-gray-400"
                          />
                        ) : (
                          <ChevronDown
                            size={20}
                            className="text-gray-500 dark:text-gray-400"
                          />
                        )}
                      </div>
                    </button>

                    {expandedCategory === index && (
                      <div className="grid grid-cols-1 gap-2 mt-2 ml-2 animate-in slide-in-from-top duration-300">
                        {category.subcategories.map((sub, subIndex) => (
                          <Link
                            key={subIndex}
                            href={`/category/${sub.toLowerCase()}`}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50 group backdrop-blur-sm hover:shadow-md"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <div
                              className={`bg-gradient-to-r ${category.gradient} size-10 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110`}
                            >
                              <div className="bg-white/30 size-6 rounded-lg flex items-center justify-center">
                                <div className="bg-white/60 size-3 rounded-full" />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                                {sub}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Browse collection
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Enhanced Mobile Account Links */}
              <div className="mt-6 space-y-2 pt-4 border-t border-gray-200/30 dark:border-gray-800/30">
                {!isAuthenticated ? (
                  <>
                    <Link
                      href="/signin"
                      className="flex items-center p-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 gap-4 transition-all duration-300 group border border-transparent hover:border-blue-200/50 dark:hover:border-blue-800/50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/50 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors duration-300">
                        <LogIn
                          size={20}
                          className="text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {t("account.sign_in")}
                      </span>
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center p-4 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/30 gap-4 transition-all duration-300 group border border-transparent hover:border-purple-200/50 dark:hover:border-purple-800/50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/50 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors duration-300">
                        <UserPlus
                          size={20}
                          className="text-purple-600 dark:text-purple-400"
                        />
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                        {t("account.sign_up")}
                      </span>
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200/30 dark:border-gray-800/30 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                          {currentUser?.name?.[0] ||
                            currentUser?.email?.[0] ||
                            "U"}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-gray-200">
                            {currentUser?.name || currentUser?.email}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Premium Member
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/account"
                      className="flex items-center p-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 gap-4 transition-all duration-300 group border border-transparent hover:border-blue-200/50 dark:hover:border-blue-800/50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/50 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors duration-300">
                        <User
                          size={20}
                          className="text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {t("account.my_account")}
                      </span>
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center p-4 rounded-xl hover:bg-green-50 dark:hover:bg-green-950/30 gap-4 transition-all duration-300 group border border-transparent hover:border-green-200/50 dark:hover:border-green-800/50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/50 group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors duration-300">
                        <ShoppingCart
                          size={20}
                          className="text-green-600 dark:text-green-400"
                        />
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                        {t("account.orders")}
                      </span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center p-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 gap-4 transition-all duration-300 group w-full text-red-600 dark:text-red-400 border border-transparent hover:border-red-200/50 dark:hover:border-red-800/50"
                    >
                      <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/50 group-hover:bg-red-200 dark:group-hover:bg-red-800/50 transition-colors duration-300">
                        <LogOut
                          size={20}
                          className="text-red-600 dark:text-red-400"
                        />
                      </div>
                      <span className="font-semibold">
                        {t("account.sign_out")}
                      </span>
                    </button>
                  </>
                )}
              </div>

              {/* Enhanced Mobile Settings */}
              <div className="mt-6 pt-4 border-t border-gray-200/30 dark:border-gray-800/30 space-y-4">
                {/* Language Toggle for Mobile */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌐</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {t("language")}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleLanguage}
                    className="rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-300 font-medium"
                  >
                    {currentLanguage === "en" ? "العربية" : "English"}
                  </Button>
                </div>

                {/* Theme Toggle for Mobile */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {mounted && theme === "dark" ? "🌙" : "☀️"}
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {t("theme.theme")}
                    </span>
                  </div>
                  <div className="flex space-x-1 bg-white/70 dark:bg-gray-800/70 rounded-xl p-1 border border-gray-200/50 dark:border-gray-700/50">
                    <Button
                      variant={
                        mounted && theme === "light" ? "default" : "ghost"
                      }
                      size="sm"
                      className={`rounded-lg transition-all duration-300 ${
                        mounted && theme === "light"
                          ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg"
                          : "hover:bg-yellow-50 dark:hover:bg-yellow-950/30"
                      }`}
                      onClick={() => setTheme("light")}
                    >
                      {t("theme.light")}
                    </Button>
                    <Button
                      variant={
                        mounted && theme === "dark" ? "default" : "ghost"
                      }
                      size="sm"
                      className={`rounded-lg transition-all duration-300 ${
                        mounted && theme === "dark"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "hover:bg-blue-50 dark:hover:bg-blue-950/30"
                      }`}
                      onClick={() => setTheme("dark")}
                    >
                      {t("theme.dark")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Indicator */}
        {scrolled && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse" />
          </div>
        )}
      </header>

      {/* Background blur overlay when mobile menu is open */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;

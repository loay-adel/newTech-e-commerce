"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter, Search, X, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/lib/use-translation";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchCategories,
  fetchProductsByCategory,
  clearProductsByCategory,
} from "@/lib/redux/slices/productSlice";
import { useParams, useRouter } from "next/navigation";

export default function CategoryProductsPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params?.id;

  const dispatch = useDispatch();
  const {
    items: allProducts = [],
    categories = [],
    productsByCategory = [],
    status,
    categoriesStatus,
    categoryProductsStatus,
  } = useSelector((state) => state.products);

  const { t } = useTranslation();

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState(categoryId || "all");
  const [sort, setSort] = useState("latest");

  // Fetch all products and categories on mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch products by category when category changes
  useEffect(() => {
    console.log("Category ID from params:", categoryId);
    if (categoryId && categoryId !== "all") {
      const cleanCategory = categoryId.replace(/^:/, "");
      setCategory(cleanCategory);
      dispatch(fetchProductsByCategory(cleanCategory));
    } else {
      dispatch(clearProductsByCategory());
    }
  }, [categoryId, dispatch]);

  // Update category when params change
  useEffect(() => {
    if (categoryId) {
      setCategory(categoryId);
    }
  }, [categoryId]);

  // Determine which products to display
  const displayProducts = category === "all" ? allProducts : productsByCategory;

  // Filter products based on search
  const filteredProducts = displayProducts
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "priceLowHigh") return a.price - b.price;
      if (sort === "priceHighLow") return b.price - a.price;
      return 0;
    });

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSort("latest");
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || sort !== "latest";

  // Loading states
  const isLoading =
    (category === "all" && status === "loading") ||
    (category !== "all" && categoryProductsStatus === "loading");

  const isLoadingCategories = categoriesStatus === "loading";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("products.back")}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 capitalize">
              {category === "all" ? t("products.all_products") : category}
            </h1>
            <p className="text-gray-600">
              {filteredProducts.length} {t("products.items_available")}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={category === "all" ? "default" : "outline"}
              onClick={() => {
                setCategory("all");
                router.push("/products");
              }}
              className="shrink-0"
            >
              {t("products.all_categories")}
            </Button>

            {/* Category Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="justify-between gap-2">
                  <span>{t("products.categories")}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isLoadingCategories ? (
                  <div className="p-2 text-center text-gray-500">
                    Loading categories...
                  </div>
                ) : (
                  categories.map((cat) => (
                    <div
                      key={cat}
                      className={`px-2 py-1.5 text-sm rounded-md cursor-pointer ${
                        category === cat
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setCategory(cat);
                        router.push(`/categories/${cat}`);
                      }}
                    >
                      {cat}
                    </div>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 p-4  bg-gray-800/60  dark:bg-gray-900  rounded-lg">
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-white hover:brightness-80 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              {t("products.clear_filters")}
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-white dark:text-gray-400" />
            <Input
              placeholder={t("products.search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full   "
            />
            {searchQuery && (
              <X
                className="absolute right-3 top-3 w-4 h-4  text-white dark:text-gray-400 cursor-pointer"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="justify-between gap-2 w-full sm:w-auto"
              >
                <span>
                  {sort === "latest" && t("products.latest")}
                  {sort === "priceLowHigh" && t("products.price_low_high")}
                  {sort === "priceHighLow" && t("products.price_high_low")}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                <DropdownMenuRadioItem value="latest">
                  {t("products.latest")}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="priceLowHigh">
                  {t("products.price_low_high")}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="priceHighLow">
                  {t("products.price_high_low")}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Filters Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <Filter className="w-4 h-4 mr-2" />
            {t("products.filters")}
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {(searchQuery || sort !== "latest") && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            {t("products.active_filters")}:
          </h3>
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {t("products.search")}: {searchQuery}
                <X
                  className="ml-1 w-3 h-3 cursor-pointer"
                  onClick={() => setSearchQuery("")}
                />
              </span>
            )}
            {sort !== "latest" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {sort === "priceLowHigh"
                  ? t("products.price_low_high")
                  : t("products.price_high_low")}
                <X
                  className="ml-1 w-3 h-3 cursor-pointer"
                  onClick={() => setSort("latest")}
                />
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div>
        {/* Products Grid */}
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-lg">
                  <div className="bg-white p-6 rounded-full mb-4 shadow-sm">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("products.no_results_title")}
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md">
                    {t("products.no_results_description")}
                  </p>
                  {hasActiveFilters && (
                    <Button onClick={clearFilters}>
                      {t("products.clear_filters")}
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-5 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg">{t("products.filters")}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Sort Options */}
            <div className="mb-6">
              <h4 className="font-medium mb-3 text-gray-700">
                {t("products.sort_by")}
              </h4>
              <div className="space-y-2">
                <div
                  className={`flex items-center p-3 rounded-md cursor-pointer ${
                    sort === "latest"
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSort("latest")}
                >
                  <div
                    className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                      sort === "latest"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {sort === "latest" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span>{t("products.latest")}</span>
                </div>
                <div
                  className={`flex items-center p-3 rounded-md cursor-pointer ${
                    sort === "priceLowHigh"
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSort("priceLowHigh")}
                >
                  <div
                    className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                      sort === "priceLowHigh"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {sort === "priceLowHigh" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span>{t("products.price_low_high")}</span>
                </div>
                <div
                  className={`flex items-center p-3 rounded-md cursor-pointer ${
                    sort === "priceHighLow"
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSort("priceHighLow")}
                >
                  <div
                    className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                      sort === "priceHighLow"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {sort === "priceHighLow" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span>{t("products.price_high_low")}</span>
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-4"
              onClick={() => setShowFilters(false)}
            >
              {t("products.apply_filters")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

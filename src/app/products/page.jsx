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
import { ChevronDown, Filter, Search } from "lucide-react";
import { useTranslation } from "@/lib/use-translation";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/lib/redux/slices/productSlice";

export default function AllProducts() {
  const dispatch = useDispatch();
  const { items: products = [], status } = useSelector(
    (state) => state.products
  );
  const { t } = useTranslation();

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((p) => category === "all" || p.category === category)
    .sort((a, b) => {
      if (sort === "priceLowHigh") return a.price - b.price;
      if (sort === "priceHighLow") return b.price - a.price;
      return 0;
    });

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Categories Bar */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-6 border-b border-gray-200">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={category === cat ? "default" : "outline"}
            onClick={() => setCategory(cat)}
            className="shrink-0"
          >
            {cat === "all" ? t("products.all_categories") : cat}
          </Button>
        ))}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        {/* Filters Sidebar (desktop) */}
        <aside className="hidden md:block border border-gray-200 rounded-lg p-4 space-y-4">
          <h3 className="font-semibold">{t("products.filters")}</h3>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder={t("products.search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {t("products.sort_by")} <ChevronDown className="ml-2 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
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
        </aside>

        {/* Mobile Filters Toggle */}
        <div className="md:hidden flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            {t("products.filters")}
          </Button>
        </div>

        {/* Filters Mobile Drawer */}
        {showFilters && (
          <div className="md:hidden border border-gray-200 rounded-lg p-4 mb-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t("products.search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {t("products.sort_by")}{" "}
                  <ChevronDown className="ml-2 w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
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
          </div>
        )}

        {/* Products Grid */}
        <main>
          {status === "loading" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="w-full h-64" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  {t("products.no_results")}
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

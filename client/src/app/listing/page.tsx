"use client";


// we are going to import 
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Slider } from "../../components/ui/slider";
import { useProductStore } from "../../store/useProductStore";
import { useCartStore } from "../../store/useCartStore";
import { categories, sizes } from "../../utils/config";
import ProductCard from "../../components/user/ProductCard";

const colors = [
  { name: "Obsidian", class: "bg-[#111111]" },
  { name: "Ivory", class: "bg-[#F5F5F0] border" },
  { name: "Gold", class: "bg-[#C5A059]" },
  { name: "Slate", class: "bg-[#4A4A4A]" },
];

function ProductListingPage() {
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "categories",
    "price",
    "size",
    "colors",
  ]);

  const router = useRouter();
  const {
    products,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchProductsForClient,
    isLoading,
    error,
  } = useProductStore();

  const { fetchCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const fetchAllProducts = () => {
    fetchProductsForClient({
      page: currentPage,
      limit: 12,
      categories: selectedCategories,
      sizes: selectedSizes,
      colors: selectedColors,
      brands: selectedBrands,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      sortBy,
      sortOrder,
    });
  };

  useEffect(() => {
    fetchAllProducts();
  }, [
    currentPage,
    selectedCategories,
    selectedSizes,
    selectedBrands,
    selectedColors,
    priceRange,
    sortBy,
    sortOrder,
  ]);

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-");
    setSortBy(newSortBy);
    setSortOrder(newSortOrder as "asc" | "desc");
  };

  const handleToggleFilter = (
    filterType: "categories" | "sizes" | "brands" | "colors",
    value: string
  ) => {
    const setterMap: any = {
      categories: setSelectedCategories,
      sizes: setSelectedSizes,
      colors: setSelectedColors,
      brands: setSelectedBrands,
    };

    setterMap[filterType]((prev: string[]) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((s) => s !== sectionId)
        : [...prev, sectionId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setPriceRange([0, 2000]);
  };

  const allSelectedFilters = [
    ...selectedCategories.map((v) => ({ type: "categories", value: v })),
    ...selectedSizes.map((v) => ({ type: "sizes", value: v })),
    ...selectedColors.map((v) => ({ type: "colors", value: v })),
    ...selectedBrands.map((v) => ({ type: "brands", value: v })),
  ];

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const FilterSection = () => {
    return (
      <div className="space-y-4">
        {/* Categories */}
        <div className="border-b border-border py-4">
          <button 
            onClick={() => toggleSection("categories")}
            className="flex items-center justify-between w-full group"
          >
            <h3 className="text-[10px] tracking-[0.4em] uppercase font-semibold text-primary">Categories</h3>
            {expandedSections.includes("categories") ? <ChevronUp size={14} className="opacity-20 group-hover:opacity-100" /> : <ChevronDown size={14} className="opacity-20 group-hover:opacity-100" />}
          </button>
          {expandedSections.includes("categories") && (
            <div className="space-y-4 pt-6 pb-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center group cursor-pointer">
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleToggleFilter("categories", category)}
                    id={category}
                    className="rounded-none border-foreground/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor={category} className="ml-3 text-[11px] tracking-widest uppercase text-foreground/60 transition-colors group-hover:text-foreground">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="border-b border-border py-4">
          <button 
            onClick={() => toggleSection("price")}
            className="flex items-center justify-between w-full group"
          >
            <h3 className="text-[10px] tracking-[0.4em] uppercase font-semibold text-primary">Price range</h3>
            {expandedSections.includes("price") ? <ChevronUp size={14} className="opacity-20 group-hover:opacity-100" /> : <ChevronDown size={14} className="opacity-20 group-hover:opacity-100" />}
          </button>
          {expandedSections.includes("price") && (
            <div className="space-y-6 px-2 pt-8 pb-4">
              <Slider
                defaultValue={[0, 2000]}
                max={2000}
                step={10}
                className="w-full"
                value={priceRange}
                onValueChange={(value) => setPriceRange(value)}
              />
              <div className="flex justify-between text-[10px] tracking-widest text-foreground/40 font-mono">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          )}
        </div>

        {/* Size */}
        <div className="border-b border-border py-4">
          <button 
            onClick={() => toggleSection("size")}
            className="flex items-center justify-between w-full group"
          >
            <h3 className="text-[10px] tracking-[0.4em] uppercase font-semibold text-primary">Size</h3>
            {expandedSections.includes("size") ? <ChevronUp size={14} className="opacity-20 group-hover:opacity-100" /> : <ChevronDown size={14} className="opacity-20 group-hover:opacity-100" />}
          </button>
          {expandedSections.includes("size") && (
            <div className="flex flex-wrap gap-2 pt-6 pb-2">
              {sizes.map((sizeItem) => (
                <button
                  key={sizeItem}
                  onClick={() => handleToggleFilter("sizes", sizeItem)}
                  className={`h-9 w-9 text-[10px] tracking-widest transition-all duration-300 border ${
                    selectedSizes.includes(sizeItem) 
                      ? "bg-foreground text-background border-foreground font-bold" 
                      : "border-foreground/5 text-foreground/40 hover:border-foreground"
                  }`}
                >
                  {sizeItem}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Colors */}
        <div className="py-4">
          <button 
            onClick={() => toggleSection("colors")}
            className="flex items-center justify-between w-full group"
          >
            <h3 className="text-[10px] tracking-[0.4em] uppercase font-semibold text-primary">Colors</h3>
            {expandedSections.includes("colors") ? <ChevronUp size={14} className="opacity-20 group-hover:opacity-100" /> : <ChevronDown size={14} className="opacity-20 group-hover:opacity-100" />}
          </button>
          {expandedSections.includes("colors") && (
            <div className="flex flex-wrap gap-4 pt-6 pb-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  className={`w-5 h-5 rounded-full transition-all duration-300 ${color.class} ${
                    selectedColors.includes(color.name)
                      ? "ring-2 ring-offset-4 ring-offset-background ring-primary scale-110 shadow-sm"
                      : "hover:scale-110 opacity-70 hover:opacity-100"
                  }`}
                  title={color.name}
                  onClick={() => handleToggleFilter("colors", color.name)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="relative h-[45vh] flex flex-col justify-center items-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 grayscale opacity-20">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"
            alt="Listing Header"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative text-center space-y-4">
          <span className="text-primary text-[10px] tracking-[0.6em] uppercase">VOREN</span>
          <h1 className="text-5xl md:text-7xl font-serif">THE ARCHIVE</h1>
          <p className="text-foreground/40 text-xs tracking-[0.4em] uppercase">Refinement in Every Stitch</p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <FilterSection />
          </aside>

          {/* Product Feed */}
          <main className="flex-1 space-y-12">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-border pb-6">
                <div className="flex items-center gap-4">
                   <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40">
                    {products.length} Results
                  </p>
                </div>
                <div className="flex items-center gap-8">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant={"outline"} className="lg:hidden h-10 rounded-none border-foreground/10 text-[10px] tracking-widest uppercase">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[90vw] bg-background border-border text-foreground">
                      <DialogHeader>
                        <DialogTitle className="font-serif">Filters</DialogTitle>
                      </DialogHeader>
                      <div className="py-10">
                        <FilterSection />
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Select
                    value={`${sortBy}-${sortOrder}`}
                    onValueChange={(value) => handleSortChange(value)}
                  >
                    <SelectTrigger className="h-10 rounded-none border-none bg-transparent hover:text-primary transition-colors text-[10px] tracking-widest uppercase focus:ring-0">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-border rounded-none">
                      <SelectItem value="createdAt-desc" className="text-xs uppercase tracking-widest">Newest First</SelectItem>
                      <SelectItem value="price-asc" className="text-xs uppercase tracking-widest">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc" className="text-xs uppercase tracking-widest">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Selected Filter Tags */}
              {allSelectedFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[9px] tracking-[0.2em] uppercase text-foreground/40 font-bold mr-2">Filters:</span>
                  {allSelectedFilters.map((filter) => (
                    <button
                      key={`${filter.type}-${filter.value}`}
                      onClick={() => handleToggleFilter(filter.type as any, filter.value)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 hover:border-primary transition-all group"
                    >
                      <span className="text-[9px] tracking-widest uppercase font-medium">{filter.value}</span>
                      <X size={10} className="text-foreground/30 group-hover:text-primary" />
                    </button>
                  ))}
                  <button 
                    onClick={clearFilters}
                    className="text-[9px] tracking-widest uppercase text-primary border-b border-primary/20 hover:border-primary ml-2 transition-all"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="text-[10px] tracking-[0.5em] animate-pulse uppercase">Searching the archives...</div>
              </div>
            ) : error ? (
              <div className="h-96 flex items-center justify-center text-destructive">{error}</div>
            ) : products.length === 0 ? (
               <div className="h-96 flex flex-col items-center justify-center space-y-6">
                 <p className="text-[10px] tracking-[0.5em] uppercase text-foreground/40">No pieces found matching your criteria</p>
                 <Button variant="link" onClick={clearFilters} className="text-primary tracking-widest text-[10px] uppercase">Reset Filters</Button>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
                {products.map((productItem) => (
                  <ProductCard key={productItem.id} product={productItem} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pt-20 border-t border-border flex justify-center items-center space-x-6">
                <Button
                  disabled={currentPage === 1}
                  variant={"ghost"}
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className="rounded-none text-[10px] tracking-widest uppercase hover:text-primary"
                >
                  Prev
                </Button>
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`text-[10px] tracking-widest w-8 h-8 flex items-center justify-center transition-all ${
                        currentPage === page ? "text-primary border border-primary/20" : "text-foreground/30 hover:text-foreground"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <Button
                  disabled={currentPage === totalPages}
                  variant={"ghost"}
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className="rounded-none text-[10px] tracking-widest uppercase hover:text-primary"
                >
                  Next
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default ProductListingPage;

"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { toast } from "@/components/Toast";
import { Product, ProductType } from "@/types/types";
import ProductSort, { SortOption } from "@/components/ProductSort";
import ProductFilter, { FilterState } from "@/components/ProductFilter";
import Pagination from "@/components/Pagination";

type ProductTypeFilter = ProductType | "all";

function DecorativeBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute left-1/2 top-32 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-gradient-to-br from-dc-sand/40 to-dc-cream/20 blur-3xl dark:from-dc-caramel/10 dark:to-transparent sm:h-[400px] sm:w-[400px] md:top-40"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute left-1/4 top-[60%] h-[200px] w-[200px] -translate-x-1/2 rounded-full border border-dc-caramel/10 dark:border-dc-caramel/5 sm:h-[280px] sm:w-[280px]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute right-1/3 top-[45%] h-2 w-2 rounded-full bg-dc-caramel/20 dark:bg-dc-caramel/10 sm:h-3 sm:w-3"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.2 }}
        className="absolute right-1/4 top-[70%] h-[250px] w-[250px] translate-x-1/2 rounded-full bg-gradient-to-tl from-dc-cream/30 to-transparent blur-3xl dark:from-dc-caramel/5 sm:h-[350px] sm:w-[350px]"
      />
    </div>
  );
}

const ITEMS_PER_PAGE = 9;

const PRODUCT_TYPE_TABS: { value: ProductTypeFilter; label: string; icon: string }[] = [
  { value: "all", label: "All", icon: "✨" },
  { value: "aromatic", label: "Aromatic", icon: "🌸" },
  { value: "decorative", label: "Decorative", icon: "🕯️" },
];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [filters, setFilters] = useState<FilterState>({
    collection: "",
    priceRange: null,
  });

  // Get initial type from URL params
  const typeFromUrl = searchParams.get("type") as ProductTypeFilter | null;
  const [selectedType, setSelectedType] = useState<ProductTypeFilter>(
    typeFromUrl && (typeFromUrl === "aromatic" || typeFromUrl === "decorative")
      ? typeFromUrl
      : "all"
  );

  // Update URL when type changes
  const handleTypeChange = (type: ProductTypeFilter) => {
    setSelectedType(type);
    setCurrentPage(1);

    // Update URL without full page reload
    const params = new URLSearchParams(searchParams.toString());
    if (type === "all") {
      params.delete("type");
    } else {
      params.set("type", type);
    }
    const newUrl = params.toString() ? `/shop?${params.toString()}` : "/shop";
    router.push(newUrl, { scroll: false });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch products");
        }

        setProducts(data.products as Product[]);
      } catch (err) {
        console.error(err);
        setError("Something went wrong loading the products.");
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Apply filters
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by product type (tabs)
    if (selectedType !== "all") {
      filtered = filtered.filter(
        (product) => product.product_type === selectedType
      );
    }

    // Filter by collection
    if (filters.collection) {
      filtered = filtered.filter(
        (product) => (product as Product & { collection_id?: string }).collection_id === filters.collection
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(
        (product) => product.price_cents >= min && product.price_cents <= max
      );
    }

    return filtered;
  }, [products, filters, selectedType]);

  // Calculate price range for filter
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 10000 };
    const prices = products.map((p) => p.price_cents);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [products]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case "featured":
        return sorted.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return 0;
        });
      case "price-low":
        return sorted.sort((a, b) => a.price_cents - b.price_cents);
      case "price-high":
        return sorted.sort((a, b) => b.price_cents - a.price_cents);
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, currentPage]);

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      priceCents: product.price_cents,
      currencyCode: product.currency_code,
      quantity: 1,
      imageUrl: product.image_url,
    });

    toast.cart(`${product.name} added to cart`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  return (
    <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:py-16 lg:px-8 mt-0 overflow-hidden">
      <DecorativeBackground />
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12 sm:mb-14 md:mb-16"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-dc-ink/8 bg-white/90 px-4 py-1.5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:gap-2.5 sm:px-5 sm:py-2"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
          />
          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
            Handcrafted · Small Batches
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 font-display text-4xl font-semibold leading-tight text-dc-ink dark:text-white sm:mt-5 sm:text-5xl md:mt-6 md:text-6xl lg:text-7xl"
        >
          Shop
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-3 max-w-2xl text-sm leading-relaxed text-dc-ink/60 dark:text-white/60 sm:mt-4 sm:text-base"
        >
          Awaken your space with handcrafted candles by Dani.
        </motion.p>

        {/* Product Type Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 flex flex-wrap gap-2 sm:gap-3"
        >
          {PRODUCT_TYPE_TABS.map((tab) => (
            <motion.button
              key={tab.value}
              onClick={() => handleTypeChange(tab.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-300 sm:px-6 sm:py-3 sm:text-sm ${
                selectedType === tab.value
                  ? "bg-dc-caramel text-white shadow-lg shadow-dc-caramel/25 dark:bg-dc-caramel-dark"
                  : "border border-dc-ink/10 bg-white/80 text-dc-ink/70 hover:border-dc-caramel/30 hover:bg-white hover:text-dc-ink dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:border-dc-caramel-dark/30 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              <span className="text-base sm:text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              {selectedType === tab.value && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full bg-dc-caramel dark:bg-dc-caramel-dark"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      </motion.section>

      {!loading && !error && products.length > 0 && (
        <div className="mb-8 space-y-4">
          {/* Filters */}
          <ProductFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            priceRange={priceRange}
          />

          {/* Sort and Count */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <ProductSort currentSort={sortBy} onSortChange={handleSortChange} />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs text-dc-ink/60 dark:text-white/60 sm:text-sm"
            >
              Showing {paginatedProducts.length} of {sortedProducts.length}{" "}
              {sortedProducts.length === 1 ? "product" : "products"}
              {filters.collection || filters.priceRange ? " (filtered)" : ""}
            </motion.div>
          </div>
        </div>
      )}

      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-dc-ink/8 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:gap-4 sm:rounded-2xl sm:px-6 sm:py-5"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2 w-2 rounded-full bg-dc-caramel sm:h-2.5 sm:w-2.5"
          />
          <p className="text-xs font-medium text-dc-ink/70 dark:text-white/70 sm:text-sm">
            Loading candles...
          </p>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-red-500/20 bg-red-50/50 px-4 py-4 text-xs font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400 sm:rounded-2xl sm:px-6 sm:py-5 sm:text-sm"
        >
          {error}
        </motion.div>
      )}

      {!loading && !error && products.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-dc-ink/8 bg-white/90 px-4 py-4 text-xs font-medium text-dc-ink/70 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70 sm:rounded-2xl sm:px-6 sm:py-5 sm:text-sm"
        >
          No products available yet.
        </motion.div>
      )}

      {!loading && !error && products.length > 0 && filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-dc-ink/8 bg-white/90 px-6 py-8 text-center backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:rounded-2xl sm:px-8 sm:py-12"
        >
          <span className="mb-4 block text-4xl">
            {selectedType === "aromatic" ? "🌸" : selectedType === "decorative" ? "🕯️" : "✨"}
          </span>
          <p className="text-sm font-medium text-dc-ink/70 dark:text-white/70 sm:text-base">
            No {selectedType === "aromatic" ? "aromatic" : selectedType === "decorative" ? "decorative" : ""} candles available with the selected filters.
          </p>
          <button
            onClick={() => {
              handleTypeChange("all");
              setFilters({ collection: "", priceRange: null });
            }}
            className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-dc-caramel hover:text-dc-clay dark:text-dc-caramel-dark dark:hover:text-dc-sand sm:text-sm"
          >
            View all candles
          </button>
        </motion.div>
      )}

      {!loading && !error && filteredProducts.length > 0 && paginatedProducts.length > 0 && (
        <>
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:gap-8"
          >
            {paginatedProducts.map((product) => (
              <motion.article
                key={product.id}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-dc-ink/8 bg-white/90 p-3 shadow-sm backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg dark:border-white/10 dark:bg-[#1a1a1a]/90 sm:rounded-2xl sm:p-4 md:rounded-3xl md:p-5"
              >
                <div className="relative mb-3 overflow-hidden rounded-lg border border-dc-ink/5 bg-dc-sand/20 dark:border-white/5 dark:bg-white/5 sm:mb-4 sm:rounded-xl md:mb-5 md:rounded-2xl">
                  <Link href={`/product/${product.slug}`}>
                    <div className="aspect-square">
                      {product.image_url ? (
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          transition={{
                            duration: 0.6,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[8px] font-semibold uppercase tracking-[0.25em] text-dc-ink/30 dark:text-white/30 sm:text-[10px] md:text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                  </Link>

                  {product.is_featured && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="absolute left-2 top-2 rounded-full border border-dc-caramel/30 bg-white/95 px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.2em] text-dc-clay shadow-sm backdrop-blur-sm sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-[8px] md:left-4 md:top-4 md:px-4 md:py-1.5 md:text-[9px]"
                    >
                      Featured
                    </motion.span>
                  )}
                </div>

                <h2 className="line-clamp-1 font-display text-sm font-semibold text-dc-ink dark:text-white sm:text-base md:text-xl lg:text-2xl">
                  <Link
                    href={`/product/${product.slug}`}
                    className="outline-none transition-colors hover:text-dc-caramel focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-dc-caramel/50"
                  >
                    {product.name}
                  </Link>
                </h2>

                {product.short_description && (
                  <p className="mt-1.5 hidden text-xs leading-relaxed text-dc-ink/60 dark:text-white/60 sm:line-clamp-2 sm:mt-2 md:mt-3 md:text-sm">
                    {product.short_description}
                  </p>
                )}

                <div className="mt-2.5 flex flex-col gap-2 border-t border-dc-ink/5 pt-2.5 dark:border-white/5 sm:mt-3 sm:flex-row sm:items-end sm:justify-between sm:pt-3 md:mt-4 md:pt-4 lg:mt-5 lg:pt-5">
                  <p className="text-sm font-bold text-dc-ink dark:text-white sm:text-base md:text-lg">
                    {(product.price_cents / 100).toFixed(2)}{" "}
                    <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40 dark:text-white/40 sm:text-[9px] md:text-[10px]">
                      {product.currency_code}
                    </span>
                  </p>

                  <Link
                    href={`/product/${product.slug}`}
                    className="hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-dc-ink/60 transition-colors hover:text-dc-caramel dark:text-white/60 dark:hover:text-dc-sand sm:inline-block sm:text-[10px]"
                  >
                    View Details →
                  </Link>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAddToCart(product)}
                  className="mt-3 inline-flex items-center justify-center rounded-full bg-dc-caramel px-4 py-2 text-[8px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 sm:mt-4 sm:px-5 sm:py-2.5 sm:text-[9px] md:mt-6 md:px-6 md:py-3 md:text-[10px]"
                >
                  Add to Cart
                </motion.button>
              </motion.article>
            ))}
          </motion.section>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}
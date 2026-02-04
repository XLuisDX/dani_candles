"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "@/components/SearchInput";
import { ProductGridSkeleton } from "@/components/ui";
import { EmptySearch } from "@/components/ui";
import { Button } from "@/components/ui";

interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  price_cents: number;
  image_url: string | null;
  collection: { name: string; slug: string }[] | null;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/products?search=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        if (!response.ok) throw new Error(data.error);
        setProducts(data.products || []);
      } catch (err) {
        console.error("Search error:", err);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  return (
    <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <h1 className="font-display text-3xl font-semibold text-dc-ink dark:text-white md:text-4xl">
          {query ? `Search results for "${query}"` : "Search"}
        </h1>
        {!isLoading && query && (
          <p className="mt-2 text-sm text-dc-ink/60 dark:text-white/60">
            {products.length} {products.length === 1 ? "product" : "products"}{" "}
            found
          </p>
        )}
      </motion.div>

      {/* Search input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative mb-10 max-w-xl"
      >
        <SearchInput placeholder="Search for candles..." />
      </motion.div>

      {/* Results */}
      {isLoading ? (
        <ProductGridSkeleton count={6} />
      ) : products.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                href={`/product/${product.slug}`}
                className="group block overflow-hidden rounded-2xl border border-dc-ink/8 bg-white/95 shadow-sm transition-all duration-300 hover:shadow-md hover:border-dc-ink/15 dark:border-white/10 dark:bg-[#1a1a1a]/95 dark:hover:border-white/20"
              >
                <div className="relative aspect-square overflow-hidden bg-dc-sand/20 dark:bg-white/5">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-dc-ink/20 dark:text-white/20">
                      <svg
                        className="h-16 w-16"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  {product.collection?.[0] && (
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-dc-caramel">
                      {product.collection[0].name}
                    </p>
                  )}
                  <h3 className="font-display text-lg font-semibold text-dc-ink group-hover:text-dc-caramel transition-colors dark:text-white dark:group-hover:text-dc-sand">
                    {product.name}
                  </h3>
                  {product.short_description && (
                    <p className="mt-1 text-sm text-dc-ink/60 dark:text-white/60 line-clamp-2">
                      {product.short_description}
                    </p>
                  )}
                  <p className="mt-3 text-base font-semibold text-dc-clay dark:text-dc-sand">
                    ${(product.price_cents / 100).toFixed(2)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : query ? (
        <EmptySearch
          query={query}
          action={
            <Button
              variant="secondary"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          }
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center py-12"
        >
          <p className="text-dc-ink/60 dark:text-white/60">
            Enter a search term to find candles
          </p>
        </motion.div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <ProductGridSkeleton count={6} />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}

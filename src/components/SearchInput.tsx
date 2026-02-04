"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks";
import Image from "next/image";
import Link from "next/link";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price_cents: number;
  image_url: string | null;
}

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  onClose?: () => void;
}

export function SearchInput({
  placeholder = "Search candles...",
  className = "",
  onClose,
}: SearchInputProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Search products
  useEffect(() => {
    const searchProducts = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/products?search=${encodeURIComponent(debouncedQuery)}&limit=5`
        );
        const data = await response.json();

        if (!response.ok) throw new Error(data.error);
        setResults(data.products || []);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchProducts();
  }, [debouncedQuery]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      onClose?.();
    }
  };

  // Handle result click
  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
    onClose?.();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-dc-ink/10 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-dc-ink placeholder-dc-ink/40 shadow-sm backdrop-blur-sm transition-all duration-200 focus:border-dc-caramel/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-dc-caramel/20"
            aria-label="Search products"
            aria-expanded={isOpen && results.length > 0}
            aria-controls="search-results"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <svg
              className="h-4 w-4 text-dc-ink/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {isLoading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
              <svg
                className="h-4 w-4 animate-spin text-dc-caramel"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
          )}
        </div>
      </form>

      <AnimatePresence>
        {isOpen && query.length >= 2 && (
          <motion.div
            id="search-results"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-dc-ink/10 bg-white shadow-lg"
          >
            {results.length > 0 ? (
              <ul className="divide-y divide-dc-ink/5 py-2">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-dc-sand/20"
                    >
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-dc-sand/20">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-dc-ink/30">
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-dc-ink">
                          {product.name}
                        </p>
                        <p className="text-xs text-dc-caramel">
                          ${(product.price_cents / 100).toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-dc-ink/60">
                  No products found for &quot;{query}&quot;
                </p>
              </div>
            )}

            {query.length >= 2 && (
              <div className="border-t border-dc-ink/5 px-4 py-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full rounded-lg bg-dc-sand/30 px-3 py-2 text-xs font-medium text-dc-clay transition-colors hover:bg-dc-sand/50"
                >
                  View all results for &quot;{query}&quot;
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

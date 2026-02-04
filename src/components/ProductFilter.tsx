"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface FilterState {
  collection: string;
  priceRange: [number, number] | null;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
}

interface ProductFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  priceRange: { min: number; max: number };
}

const PRICE_RANGES = [
  { label: "All Prices", value: null },
  { label: "Under $20", value: [0, 2000] as [number, number] },
  { label: "$20 - $35", value: [2000, 3500] as [number, number] },
  { label: "$35 - $50", value: [3500, 5000] as [number, number] },
  { label: "Over $50", value: [5000, 100000] as [number, number] },
];

export default function ProductFilter({
  filters,
  onFilterChange,
  priceRange,
}: ProductFilterProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch("/api/collections");
        const data = await response.json();

        if (response.ok && data.collections) {
          setCollections(data.collections);
        }
      } catch (err) {
        console.error("Error fetching collections:", err);
      }
      setLoading(false);
    };

    fetchCollections();
  }, []);

  const handleCollectionChange = (collectionId: string) => {
    onFilterChange({
      ...filters,
      collection: collectionId,
    });
  };

  const handlePriceChange = (range: [number, number] | null) => {
    onFilterChange({
      ...filters,
      priceRange: range,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      collection: "",
      priceRange: null,
    });
  };

  const hasActiveFilters = filters.collection || filters.priceRange;

  return (
    <div className="space-y-4">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between rounded-xl border border-dc-ink/8 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:hidden"
      >
        <span className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-dc-ink/60 dark:text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-wider text-dc-ink/70 dark:text-white/70">
            Filters
          </span>
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-dc-caramel text-[9px] font-bold text-white">
              {(filters.collection ? 1 : 0) + (filters.priceRange ? 1 : 0)}
            </span>
          )}
        </span>
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="h-4 w-4 text-dc-ink/40 dark:text-white/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>

      {/* Filter Content */}
      <AnimatePresence>
        {(isExpanded || typeof window !== "undefined" && window.innerWidth >= 640) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden sm:!h-auto sm:!opacity-100"
          >
            <div className="flex flex-col gap-4 rounded-xl border border-dc-ink/8 bg-white/90 p-4 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#1a1a1a]/90 sm:flex-row sm:items-center sm:rounded-2xl sm:px-5 sm:py-4">
              {/* Collection Filter */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
                  Collection
                </label>
                <div className="relative">
                  <select
                    value={filters.collection}
                    onChange={(e) => handleCollectionChange(e.target.value)}
                    disabled={loading}
                    className="w-full appearance-none rounded-lg border border-dc-ink/10 bg-white/80 px-3 py-2 pr-8 text-xs text-dc-ink shadow-sm outline-none transition-all hover:border-dc-caramel/30 focus:border-dc-caramel/50 focus:ring-2 focus:ring-dc-caramel/10 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white sm:min-w-[160px] sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
                  >
                    <option value="">All Collections</option>
                    {collections.map((collection) => (
                      <option key={collection.id} value={collection.id}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg
                      className="h-4 w-4 text-dc-ink/40 dark:text-white/40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden h-8 w-px bg-dc-ink/10 dark:bg-white/10 sm:block" />

              {/* Price Filter */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
                  Price
                </label>
                <div className="relative">
                  <select
                    value={
                      filters.priceRange
                        ? `${filters.priceRange[0]}-${filters.priceRange[1]}`
                        : ""
                    }
                    onChange={(e) => {
                      if (!e.target.value) {
                        handlePriceChange(null);
                      } else {
                        const [min, max] = e.target.value.split("-").map(Number);
                        handlePriceChange([min, max]);
                      }
                    }}
                    className="w-full appearance-none rounded-lg border border-dc-ink/10 bg-white/80 px-3 py-2 pr-8 text-xs text-dc-ink shadow-sm outline-none transition-all hover:border-dc-caramel/30 focus:border-dc-caramel/50 focus:ring-2 focus:ring-dc-caramel/10 dark:border-white/10 dark:bg-white/5 dark:text-white sm:min-w-[160px] sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
                  >
                    {PRICE_RANGES.map((range, index) => (
                      <option
                        key={index}
                        value={range.value ? `${range.value[0]}-${range.value[1]}` : ""}
                      >
                        {range.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg
                      className="h-4 w-4 text-dc-ink/40 dark:text-white/40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 rounded-lg border border-dc-ink/10 bg-dc-ink/5 px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-dc-ink/70 transition-colors hover:bg-dc-ink/10 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 sm:ml-auto sm:px-4 sm:py-2.5 sm:text-[10px]"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Clear Filters
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

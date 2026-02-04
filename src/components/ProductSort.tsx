"use client";

import { motion } from "framer-motion";

export type SortOption = 
  | "featured"
//   | "newest"
  | "price-low"
  | "price-high"
  | "name-asc"
  | "name-desc";

interface ProductSortProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
//   { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A-Z" },
  { value: "name-desc", label: "Name: Z-A" },
];

export default function ProductSort({ currentSort, onSortChange }: ProductSortProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-3 rounded-xl border border-dc-ink/8 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#1a1a1a]/90 sm:gap-4 sm:rounded-2xl sm:px-5 sm:py-4"
    >
      <label
        htmlFor="sort-select"
        className="text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]"
      >
        Sort By
      </label>

      <div className="relative flex-1 sm:flex-initial sm:min-w-[200px]">
        <select
          id="sort-select"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="w-full appearance-none rounded-lg border border-dc-ink/10 bg-white/80 px-3 py-2 pr-8 text-xs text-dc-ink shadow-sm outline-none transition-all hover:border-dc-caramel/30 focus:border-dc-caramel/50 focus:ring-2 focus:ring-dc-caramel/10 dark:border-white/10 dark:bg-white/5 dark:text-white sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom Arrow */}
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
    </motion.div>
  );
}
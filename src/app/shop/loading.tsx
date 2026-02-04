"use client";

import { motion } from "framer-motion";
import { ProductGridSkeleton } from "@/components/ui";

export default function ShopLoading() {
  return (
    <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <div className="h-10 w-48 animate-pulse rounded-lg bg-dc-ink/10" />
        <div className="mt-2 h-5 w-32 animate-pulse rounded bg-dc-ink/10" />
      </motion.div>

      {/* Sort/Filter skeleton */}
      <div className="mb-8 flex items-center justify-between">
        <div className="h-10 w-40 animate-pulse rounded-xl bg-dc-ink/10" />
        <div className="h-10 w-32 animate-pulse rounded-xl bg-dc-ink/10" />
      </div>

      {/* Products grid skeleton */}
      <ProductGridSkeleton count={9} />

      {/* Pagination skeleton */}
      <div className="mt-10 flex justify-center gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-10 w-10 animate-pulse rounded-lg bg-dc-ink/10"
          />
        ))}
      </div>
    </main>
  );
}

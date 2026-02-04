"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";

export function CartBadge() {
  // Subscribe to items directly so component re-renders when cart changes
  const items = useCartStore((state) => state.items);
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  // Calculate total from items
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // Hydration fix: only show count after mount
  useEffect(() => {
    setCount(totalItems);
  }, [totalItems]);

  // Trigger animation when count changes (and increases)
  useEffect(() => {
    if (count > 0 && count !== prevCount) {
      setIsAnimating(true);
      const timeout = setTimeout(() => setIsAnimating(false), 300);
      setPrevCount(count);
      return () => clearTimeout(timeout);
    }
  }, [count, prevCount]);

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        href="/cart"
        className="relative inline-flex rounded-full border border-dc-ink/8 bg-white/80 px-3 py-2 text-[9px] font-semibold tracking-[0.2em] text-dc-ink/70 shadow-sm transition-all duration-200 hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink hover:shadow sm:px-5 sm:py-2.5 sm:text-[10px]"
        aria-label={`Cart with ${count} items`}
      >
        CART
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: isAnimating ? 1.2 : 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-dc-caramel text-[8px] font-bold text-white sm:h-5 sm:w-5 sm:text-[9px]"
            >
              {count > 99 ? "99+" : count}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}

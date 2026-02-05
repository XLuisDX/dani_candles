"use client";

import { motion } from "framer-motion";
import { FRAGRANCES } from "@/types/utils";

interface FragranceSelectorProps {
  value: string;
  onChange: (fragrance: string) => void;
  error?: boolean;
}

export function FragranceSelector({
  value,
  onChange,
  error,
}: FragranceSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {FRAGRANCES.map((fragrance) => {
          const isSelected = value === fragrance.name;
          return (
            <motion.button
              key={fragrance.id}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(fragrance.name)}
              className={`inline-flex items-center rounded-full border px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] shadow-sm transition-all duration-200 sm:px-5 sm:py-2.5 sm:text-[10px] ${
                isSelected
                  ? "border-dc-caramel bg-dc-caramel text-white shadow"
                  : "border-dc-ink/10 bg-white/80 text-dc-ink/60 hover:border-dc-ink/20 hover:bg-white hover:text-dc-ink dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              {fragrance.name}
            </motion.button>
          );
        })}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[9px] font-semibold uppercase tracking-[0.15em] text-red-600 dark:text-red-400 sm:text-[10px]"
        >
          Please select a fragrance
        </motion.p>
      )}
    </div>
  );
}

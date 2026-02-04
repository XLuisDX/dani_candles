"use client";

import { motion } from "framer-motion";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  size = "md",
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value);
    }
  };

  const sizeClasses = {
    sm: {
      container: "gap-1",
      button: "h-7 w-7 text-xs",
      input: "h-7 w-10 text-xs",
    },
    md: {
      container: "gap-1.5",
      button: "h-9 w-9 text-sm",
      input: "h-9 w-12 text-sm",
    },
    lg: {
      container: "gap-2",
      button: "h-11 w-11 text-base",
      input: "h-11 w-14 text-base",
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className={`inline-flex items-center ${classes.container}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleDecrement}
        disabled={quantity <= min}
        className={`${classes.button} flex items-center justify-center rounded-lg border border-dc-ink/10 bg-white/80 font-semibold text-dc-ink/70 shadow-sm transition-all hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white dark:disabled:hover:bg-white/5`}
        aria-label="Decrease quantity"
      >
        −
      </motion.button>

      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        className={`${classes.input} rounded-lg border border-dc-ink/10 bg-white/80 text-center font-semibold text-dc-ink shadow-sm outline-none transition-all focus:border-dc-caramel/50 focus:ring-2 focus:ring-dc-caramel/20 dark:border-white/10 dark:bg-white/5 dark:text-white [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
        aria-label="Quantity"
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleIncrement}
        disabled={quantity >= max}
        className={`${classes.button} flex items-center justify-center rounded-lg border border-dc-ink/10 bg-white/80 font-semibold text-dc-ink/70 shadow-sm transition-all hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white dark:disabled:hover:bg-white/5`}
        aria-label="Increase quantity"
      >
        +
      </motion.button>
    </div>
  );
}

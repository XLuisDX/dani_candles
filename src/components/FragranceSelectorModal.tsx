"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FRAGRANCES } from "@/types/utils";
import { useCartStore } from "@/store/cartStore";
import { toast } from "@/components/Toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  price_cents: number;
  currency_code: string;
  image_url: string | null;
}

interface FragranceSelectorModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FragranceSelectorModal({
  product,
  isOpen,
  onClose,
}: FragranceSelectorModalProps) {
  const [selectedFragrance, setSelectedFragrance] = useState("");
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  // Reset state when modal opens with a new product
  useEffect(() => {
    if (isOpen) {
      setSelectedFragrance("");
      setQuantity(1);
    }
  }, [isOpen, product?.id]);

  const handleAddToCart = () => {
    if (!product || !selectedFragrance) return;

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      priceCents: product.price_cents,
      currencyCode: product.currency_code,
      quantity: quantity,
      imageUrl: product.image_url,
      fragrance: selectedFragrance,
    });

    toast.cart(`${quantity} × ${product.name} (${selectedFragrance}) added to cart`);
    onClose();
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-dc-ink/10 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 sm:p-8"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-dc-ink/40 transition-colors hover:bg-dc-ink/5 hover:text-dc-ink dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
            >
              <IoClose className="h-5 w-5" />
            </button>

            {/* Product info */}
            <div className="flex items-start gap-4">
              {product.image_url ? (
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-dc-ink/8 dark:border-white/10">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-dc-ink/8 bg-dc-sand/30 dark:border-white/10 dark:bg-white/5">
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-dc-ink/40 dark:text-white/40">
                    Candle
                  </span>
                </div>
              )}

              <div className="min-w-0 flex-1 pt-1">
                <h3 className="font-display text-lg font-semibold leading-tight text-dc-ink dark:text-white sm:text-xl">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm font-bold text-dc-caramel">
                  {(product.price_cents / 100).toFixed(2)}{" "}
                  <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-dc-ink/40 dark:text-white/40">
                    {product.currency_code}
                  </span>
                </p>
              </div>
            </div>

            {/* Fragrance selection */}
            <div className="mt-6">
              <label className="mb-3 block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/50 dark:text-white/50 sm:text-[10px]">
                Select fragrance
              </label>
              <div className="flex flex-wrap gap-2">
                {FRAGRANCES.map((fragrance) => {
                  const isSelected = selectedFragrance === fragrance.name;
                  return (
                    <motion.button
                      key={fragrance.id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedFragrance(fragrance.name)}
                      className={`inline-flex items-center rounded-full border px-3.5 py-2 text-[9px] font-bold uppercase tracking-[0.18em] shadow-sm transition-all duration-200 sm:px-4 sm:py-2.5 sm:text-[10px] ${
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
            </div>

            {/* Quantity selector */}
            <div className="mt-5">
              <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/50 dark:text-white/50 sm:text-[10px]">
                Quantity
              </label>
              <div className="inline-flex items-center rounded-full border border-dc-ink/10 bg-white/80 shadow-sm dark:border-white/10 dark:bg-white/5">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-sm font-bold text-dc-ink/60 transition-colors hover:text-dc-caramel dark:text-white/60 sm:px-5"
                >
                  −
                </motion.button>
                <span className="min-w-[2rem] text-center text-sm font-bold text-dc-ink dark:text-white">
                  {quantity}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="px-4 py-2 text-sm font-bold text-dc-ink/60 transition-colors hover:text-dc-caramel dark:text-white/60 sm:px-5"
                >
                  +
                </motion.button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-dc-ink/10 bg-white/80 text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/70 shadow-sm transition-all duration-200 hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white sm:h-12 sm:text-[10px]"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedFragrance}
                className="inline-flex h-11 flex-[2] items-center justify-center rounded-full bg-dc-caramel text-[9px] font-bold uppercase tracking-[0.2em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:text-[10px]"
              >
                Add to cart
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

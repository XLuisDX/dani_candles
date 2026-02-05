"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Collection, Product } from "@/types/types";
import { FragranceSelectorModal } from "@/components/FragranceSelectorModal";

interface ProductWithCollection extends Product {
  collection_id: string | null;
}

interface CollectionPageClientProps {
  collection: Collection;
  products: ProductWithCollection[];
}

export default function CollectionPageClient({
  collection,
  products,
}: CollectionPageClientProps) {
  const [modalProduct, setModalProduct] = useState<ProductWithCollection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = (product: ProductWithCollection) => {
    setModalProduct(product);
    setIsModalOpen(true);
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
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Soft gradient orb - center top */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute left-1/2 top-32 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-gradient-to-br from-dc-sand/40 to-dc-cream/20 blur-3xl dark:from-dc-caramel/10 dark:to-transparent sm:h-[400px] sm:w-[400px] md:top-40"
        />

        {/* Subtle ring - mid page */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute left-1/4 top-[60%] h-[200px] w-[200px] -translate-x-1/2 rounded-full border border-dc-caramel/10 dark:border-dc-caramel/5 sm:h-[280px] sm:w-[280px]"
        />

        {/* Small accent dot */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute right-1/3 top-[45%] h-2 w-2 rounded-full bg-dc-caramel/20 dark:bg-dc-caramel/10 sm:h-3 sm:w-3"
        />

        {/* Gradient wash - lower section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.2 }}
          className="absolute right-1/4 top-[70%] h-[250px] w-[250px] translate-x-1/2 rounded-full bg-gradient-to-tl from-dc-cream/30 to-transparent blur-3xl dark:from-dc-caramel/5 sm:h-[350px] sm:w-[350px]"
        />
      </div>

      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-12 md:mb-16"
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
            Collection
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 font-display text-4xl font-semibold leading-tight text-dc-ink dark:text-white sm:mt-5 sm:text-5xl md:mt-6 md:text-6xl lg:text-7xl"
        >
          {collection.name}
        </motion.h1>

        {collection.description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-3 max-w-2xl text-sm leading-relaxed text-dc-ink/60 dark:text-white/60 sm:mt-4 sm:text-base"
          >
            {collection.description}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-5 sm:mt-6"
        >
          <Link
            href="/collections"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-dc-sand px-6 text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink shadow-lg transition-all duration-200 hover:bg-dc-caramel hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:h-12 sm:px-8 sm:text-[10px]"
          >
            <span>←</span>
            <span>Back to all collections</span>
          </Link>
        </motion.div>
      </motion.section>

      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-dc-ink/8 bg-white/90 px-4 py-6 text-center backdrop-blur-sm dark:border-white/10 dark:bg-[#1a1a1a]/90 sm:rounded-2xl sm:px-6 sm:py-8"
        >
          <p className="text-xs font-medium text-dc-ink/70 dark:text-white/70 sm:text-sm">
            No products in this collection yet.
          </p>
          <Link
            href="/shop"
            className="mt-3 inline-flex items-center justify-center rounded-full bg-dc-caramel px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow sm:mt-4 sm:px-6 sm:py-3 sm:text-[10px]"
          >
            Browse all products
          </Link>
        </motion.div>
      ) : (
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:gap-8"
        >
          {products.map((product) => (
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
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
                    className="absolute left-2 top-2 rounded-full border border-dc-caramel/30 bg-white/95 px-2 py-0.5 text-[7px] font-bold uppercase tracking-[0.2em] text-dc-clay shadow-sm backdrop-blur-sm dark:bg-[#1a1a1a]/95 dark:text-dc-caramel sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-[8px] md:left-4 md:top-4 md:px-4 md:py-1.5 md:text-[9px]"
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
                  className="hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-dc-ink/60 transition-colors hover:text-dc-caramel dark:text-white/60 sm:inline-block sm:text-[10px]"
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
      )}

      <FragranceSelectorModal
        product={modalProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}

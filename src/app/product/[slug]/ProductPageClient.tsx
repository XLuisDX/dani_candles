"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { ProductWithCollection } from "@/types/types";
import { IoArrowBack } from "react-icons/io5";
import { QuantitySelector } from "@/components/QuantitySelector";
import { RelatedProducts } from "@/components/RelatedProducts";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { toast } from "@/components/Toast";

interface ProductPageClientProps {
  product: ProductWithCollection;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      priceCents: product.price_cents,
      currencyCode: product.currency_code,
      quantity: quantity,
      imageUrl: product.image_url,
    });
    toast.cart(`${quantity} × ${product.name} added to cart`);
    setQuantity(1);
  };

  return (
    <main className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 md:py-16 lg:px-8 lg:py-20 mt-0">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          ...(product?.collections
            ? [
                {
                  label: product.collections.name,
                  href: `/collections/${product.collections.slug}`,
                },
              ]
            : []),
          { label: product?.name || "Product" },
        ]}
      />

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.02, x: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push("/shop")}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-dc-ink/8 bg-dc-sand/30 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-dc-ink/60 shadow-sm backdrop-blur-sm transition-all hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white sm:mb-8 sm:gap-2.5 sm:px-5 sm:py-2.5 sm:text-[10px]"
      >
        <IoArrowBack className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        Back to Shop
      </motion.button>

      <div className="grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="group relative overflow-hidden rounded-2xl border border-dc-ink/10 bg-gradient-to-br from-white to-dc-cream/20 p-4 shadow-lg backdrop-blur-xl dark:border-white/10 dark:from-[#1a1a1a] dark:to-[#222] sm:rounded-3xl sm:p-6 md:p-8"
          >
            <div className="overflow-hidden rounded-xl bg-white shadow-sm sm:rounded-2xl">
              <div className="aspect-square">
                {product.image_url ? (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    whileHover={{ scale: 1.03 }}
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-dc-cream/50 to-dc-sand/30 p-8 sm:p-12">
                    <div className="text-center">
                      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/50 dark:text-white/50 sm:text-[10px]">
                        Product image
                      </p>
                      <p className="mt-2 text-xs font-medium text-dc-ink/60 dark:text-white/60 sm:mt-3 sm:text-sm">
                        Product image coming soon
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-dc-sand/30 blur-3xl" />
              <div className="absolute -bottom-20 -right-24 h-64 w-64 rounded-full bg-dc-caramel/20 blur-3xl" />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-dc-ink/8 bg-white/95 p-5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 sm:rounded-3xl sm:p-6 md:p-8"
        >
          {product.collections && (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                router.push(`/collections/${product.collections?.slug}`)
              }
              className="inline-flex items-center gap-2 rounded-full border border-dc-caramel/20 bg-dc-caramel/10 px-3 py-1.5 transition-colors hover:bg-dc-caramel/20 sm:px-4 sm:py-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-dc-caramel" />
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-dc-caramel sm:text-[9px]">
                {product.collections.name}
              </span>
            </motion.button>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-3 font-display text-2xl font-semibold leading-tight text-dc-ink dark:text-white sm:mt-4 sm:text-3xl md:text-4xl lg:text-5xl"
          >
            {product.name}
          </motion.h1>

          {product.short_description && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-3 text-sm leading-relaxed text-dc-ink/60 dark:text-white/60 sm:mt-4 sm:text-base"
            >
              {product.short_description}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4"
          >
            <p className="text-2xl font-bold text-dc-ink dark:text-white sm:text-3xl">
              {(product.price_cents / 100).toFixed(2)}{" "}
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40 dark:text-white/40 sm:text-[10px]">
                {product.currency_code}
              </span>
            </p>

            <span className="inline-flex w-fit items-center rounded-full border border-dc-ink/8 bg-dc-sand/30 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60 sm:px-4 sm:py-2 sm:text-[10px]">
              Handcrafted
            </span>
          </motion.div>

          {/* Quantity Selector */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="mt-6 sm:mt-8"
          >
            <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/50 dark:text-white/50 sm:text-[10px]">
              Quantity
            </label>
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              min={1}
              max={10}
              size="md"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-4 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="inline-flex w-full items-center justify-center rounded-full bg-dc-caramel px-6 py-3 text-[9px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 sm:w-auto sm:px-7 sm:py-4 sm:text-[10px]"
            >
              Add to cart {quantity > 1 ? `(${quantity})` : ""}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="inline-flex w-full items-center justify-center rounded-full border border-dc-ink/10 bg-white/80 px-6 py-3 text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/70 shadow-sm transition-all duration-200 hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/30 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:border-white/20 dark:hover:bg-white/10 dark:hover:text-white sm:w-auto sm:px-7 sm:py-4 sm:text-[10px]"
            >
              Save for later
            </motion.button>
          </motion.div>

          {product.description && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-8 sm:mt-10"
            >
              <h2 className="text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/50 dark:text-white/50 sm:text-[10px]">
                Description
              </h2>
              <div className="mt-3 rounded-xl border border-dc-ink/8 bg-white/80 px-4 py-4 dark:border-white/10 dark:bg-white/5 sm:mt-4 sm:rounded-2xl sm:px-6 sm:py-5">
                <p className="text-xs leading-relaxed text-dc-ink/70 dark:text-white/70 sm:text-sm">
                  {product.description}
                </p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-8 grid grid-cols-3 gap-3 sm:mt-10 sm:gap-4"
          >
            {[
              { label: "Wax", value: "Soy blend" },
              { label: "Mood", value: "Cozy" },
              { label: "Giftable", value: "Yes" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                whileHover={{ y: -2 }}
                className="rounded-xl border border-dc-ink/8 bg-dc-sand/20 px-3 py-3 dark:border-white/10 dark:bg-white/5 sm:rounded-2xl sm:px-5 sm:py-4"
              >
                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-dc-ink/50 dark:text-white/50 sm:text-[10px]">
                  {item.label}
                </p>
                <p className="mt-1.5 text-xs font-semibold text-dc-ink/70 dark:text-white/70 sm:mt-2 sm:text-sm">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        currentProductId={product.id}
        collectionId={product.collection_id}
        limit={4}
      />
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useCartStore } from "@/store/cartStore";
import { ProductDetail } from "@/types/types";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("products")
        .select(
          "id, name, slug, short_description, description, price_cents, currency_code, image_url"
        )
        .eq("slug", slug)
        .eq("active", true)
        .maybeSingle();

      if (error) {
        console.error(error);
        setError("Unable to load this candle.");
      } else {
        setProduct(data as ProductDetail | null);
      }

      setLoading(false);
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      priceCents: product.price_cents,
      currencyCode: product.currency_code,
      quantity: 1,
      imageUrl: product.image_url,
    });
  };

  if (loading) {
    return (
      <main className="relative mx-auto max-w-6xl px-6 py-16 md:py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 rounded-2xl border border-dc-ink/8 bg-white/90 px-6 py-5 shadow-sm backdrop-blur-sm"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2.5 w-2.5 rounded-full bg-dc-caramel"
          />
          <p className="text-sm font-medium text-dc-ink/70">
            Loading candle...
          </p>
        </motion.div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="relative mx-auto max-w-6xl px-6 py-16 md:py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-red-500/20 bg-red-50/50 px-6 py-5 text-sm font-medium text-red-700"
        >
          {error ?? "Candle not found."}
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative mx-auto max-w-6xl px-6 py-16 md:py-20 lg:px-8">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.35 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -top-16 right-16 h-56 w-56 rounded-full bg-dc-sand blur-3xl"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -bottom-16 left-12 h-64 w-64 rounded-full bg-dc-caramel blur-3xl"
      />

      <div className="grid gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="group relative overflow-hidden rounded-3xl border border-dc-ink/10 bg-gradient-to-br from-white to-dc-cream/20 p-8 shadow-lg backdrop-blur-xl"
          >
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
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
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-dc-cream/50 to-dc-sand/30 p-12">
                    <div className="text-center">
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/50">
                        Product image
                      </p>
                      <p className="mt-3 text-sm font-medium text-dc-ink/60">
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
          className="rounded-3xl border border-dc-ink/8 bg-white/95 p-2 shadow-lg backdrop-blur-xl md:p-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6 font-display text-4xl font-semibold leading-tight text-dc-ink md:text-5xl"
          >
            {product.name}
          </motion.h1>

          {product.short_description && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-4 text-base leading-relaxed text-dc-ink/60"
            >
              {product.short_description}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 flex items-end justify-between gap-4"
          >
            <p className="text-3xl font-bold text-dc-ink">
              {(product.price_cents / 100).toFixed(2)}{" "}
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
                {product.currency_code}
              </span>
            </p>

            <span className="rounded-full border border-dc-ink/8 bg-dc-sand/30 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/60">
              Handcrafted
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="inline-flex w-full items-center justify-center rounded-full bg-dc-caramel px-7 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 sm:w-auto"
            >
              Add to cart
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className="inline-flex w-full items-center justify-center rounded-full border border-dc-ink/10 bg-white/80 px-7 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/70 shadow-sm transition-all duration-200 hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/30 sm:w-auto"
            >
              Save for later
            </motion.button>
          </motion.div>

          {product.description && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-10"
            >
              <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/50">
                Description
              </h2>
              <div className="mt-4 rounded-2xl border border-dc-ink/8 bg-white/80 px-6 py-5">
                <p className="text-sm leading-relaxed text-dc-ink/70">
                  {product.description}
                </p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-10 grid gap-4 sm:grid-cols-3"
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
                className="rounded-2xl border border-dc-ink/8 bg-dc-sand/20 px-5 py-4"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/50">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-semibold text-dc-ink/70">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}

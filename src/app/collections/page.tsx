/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Collection } from "@/types/types";

export default function CollectionsPage() {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("collections")
        .select("id, name, slug, description, image_url, is_featured")
        .order("is_featured", { ascending: false })
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching collections:", error);
        setError("Unable to load collections.");
      } else {
        setCollections(data || []);
      }

      setLoading(false);
    };

    fetchCollections();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8 mt-0">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.35 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -top-16 right-8 h-40 w-40 rounded-full bg-dc-sand blur-3xl sm:right-12 sm:h-48 sm:w-48 md:right-16 md:h-56 md:w-56"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -bottom-16 left-8 h-48 w-48 rounded-full bg-dc-caramel blur-3xl sm:left-12 sm:h-56 sm:w-56 md:h-64 md:w-64"
      />

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
          className="inline-flex items-center gap-2 rounded-full border border-dc-ink/8 bg-white/90 px-4 py-1.5 shadow-sm backdrop-blur-sm sm:gap-2.5 sm:px-5 sm:py-2"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
          />
          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60 sm:text-[10px]">
            Curated · Handcrafted
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 font-display text-4xl font-semibold leading-tight text-dc-ink sm:mt-5 sm:text-5xl md:mt-6 md:text-6xl lg:text-7xl"
        >
          Collections
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-3 max-w-2xl text-sm leading-relaxed text-dc-ink/60 sm:mt-4 sm:text-base"
        >
          Explore our thoughtfully curated collections, each designed to evoke a
          distinct mood and celebrate life special moments.
        </motion.p>
      </motion.section>

      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-dc-ink/8 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-sm sm:gap-4 sm:rounded-2xl sm:px-6 sm:py-5"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2 w-2 rounded-full bg-dc-caramel sm:h-2.5 sm:w-2.5"
          />
          <p className="text-xs font-medium text-dc-ink/70 sm:text-sm">
            Loading collections...
          </p>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-red-500/20 bg-red-50/50 px-4 py-4 text-xs font-medium text-red-700 sm:rounded-2xl sm:px-6 sm:py-5 sm:text-sm"
        >
          {error}
        </motion.div>
      )}

      {!loading && !error && collections.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-dc-ink/8 bg-white/90 px-4 py-4 text-xs font-medium text-dc-ink/70 backdrop-blur-sm sm:rounded-2xl sm:px-6 sm:py-5 sm:text-sm"
        >
          No collections available yet.
        </motion.div>
      )}

      {!loading && !error && collections.length > 0 && (
        <>
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative grid gap-5 sm:gap-6 md:grid-cols-2 md:gap-8"
          >
            {collections.map((collection, index) => (
              <motion.article
                key={collection.id}
                onHoverStart={() => setHoveredId(collection.id)}
                onHoverEnd={() => setHoveredId(null)}
                className={`group relative overflow-hidden rounded-2xl border border-dc-ink/8 bg-white/95 shadow-sm backdrop-blur-xl transition-shadow duration-500 hover:shadow-xl sm:rounded-3xl ${
                  index === 0 ? "md:col-span-2" : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden ${
                    index === 0
                      ? "aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9]"
                      : "aspect-[4/3]"
                  }`}
                >
                  <motion.div
                    animate={{
                      scale: hoveredId === collection.id ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full w-full"
                  >
                    {collection.image_url ? (
                      <img
                        src={collection.image_url}
                        alt={collection.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-dc-cream/50 to-dc-sand/30">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-dc-ink/40 sm:text-sm">
                          No Image
                        </p>
                      </div>
                    )}
                  </motion.div>

                  <div className="absolute inset-0 bg-gradient-to-t from-dc-ink/95 via-dc-ink/60 to-transparent" />

                  {collection.is_featured && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="absolute right-4 top-4 rounded-full border border-white/30 bg-white/95 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.2em] text-dc-clay shadow-lg backdrop-blur-sm sm:right-6 sm:top-6 sm:px-4 sm:py-1.5 sm:text-[9px]"
                    >
                      Signature
                    </motion.span>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8">
                    <motion.h2
                      animate={{
                        y: hoveredId === collection.id ? -4 : 0,
                      }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="font-display text-2xl font-semibold text-white sm:text-3xl md:text-4xl lg:text-5xl"
                    >
                      {collection.name}
                    </motion.h2>

                    {collection.description && (
                      <motion.p
                        animate={{
                          opacity: hoveredId === collection.id ? 1 : 0.9,
                          y: hoveredId === collection.id ? -4 : 0,
                        }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-2 max-w-2xl text-xs leading-relaxed text-white/90 sm:mt-3 sm:text-sm md:text-base"
                      >
                        {collection.description}
                      </motion.p>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        router.push(`/collections/${collection.slug}`)
                      }
                      className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-white px-6 text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink shadow-lg transition-all duration-200 hover:bg-dc-cream hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:mt-6 sm:h-12 sm:px-8 sm:text-[10px]"
                    >
                      Explore Collection
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-16 rounded-2xl border border-dc-ink/8 bg-gradient-to-br from-dc-cream to-white p-8 shadow-lg backdrop-blur-xl sm:mt-20 sm:rounded-3xl sm:p-10 md:mt-24 md:p-12 lg:p-16"
          >
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-dc-ink/8 bg-white/90 px-4 py-1.5 shadow-sm backdrop-blur-sm sm:gap-2.5 sm:px-5 sm:py-2">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
                />
                <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60 sm:text-[10px]">
                  About Collections
                </span>
              </div>

              <h2 className="mt-6 font-display text-3xl font-semibold leading-tight text-dc-ink sm:mt-8 sm:text-4xl md:text-5xl">
                Crafted for every occasion
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-dc-ink/70 sm:mt-6 sm:text-base md:text-lg">
                Each collection is thoughtfully designed to complement specific
                moments in life. From everyday elegance to milestone
                celebrations, our candles are made to enhance your most
                meaningful experiences with artisanal quality and intentional
                fragrance.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/shop")}
                className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-dc-caramel px-8 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-lg transition-all duration-200 hover:bg-dc-clay hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 sm:mt-10 sm:h-14 sm:px-10 sm:text-[11px]"
              >
                Shop All Products
              </motion.button>
            </div>
          </motion.section>
        </>
      )}
    </main>
  );
}

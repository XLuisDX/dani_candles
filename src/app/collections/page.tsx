/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_featured: boolean;
}

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
    <main className="relative mx-auto max-w-7xl px-6 py-8 md:py-12 lg:px-8">
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

      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-16"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2.5 rounded-full border border-dc-ink/8 bg-white/90 px-5 py-2 shadow-sm backdrop-blur-sm"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
          />
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60">
            Curated · Handcrafted
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 font-display text-5xl font-semibold leading-tight text-dc-ink md:text-6xl lg:text-7xl"
        >
          Collections
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-4 max-w-2xl text-base leading-relaxed text-dc-ink/60"
        >
          Explore our thoughtfully curated collections, each designed to evoke a
          distinct mood and celebrate life special moments.
        </motion.p>
      </motion.section>

      {loading && (
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
            Loading collections...
          </p>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-red-500/20 bg-red-50/50 px-6 py-5 text-sm font-medium text-red-700"
        >
          {error}
        </motion.div>
      )}

      {!loading && !error && collections.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-dc-ink/8 bg-white/90 px-6 py-5 text-sm font-medium text-dc-ink/70 backdrop-blur-sm"
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
            className="relative grid gap-8 md:grid-cols-2"
          >
            {collections.map((collection, index) => (
              <motion.article
                key={collection.id}
                onHoverStart={() => setHoveredId(collection.id)}
                onHoverEnd={() => setHoveredId(null)}
                className={`group relative overflow-hidden rounded-3xl border border-dc-ink/8 bg-white/95 shadow-sm backdrop-blur-xl transition-shadow duration-500 hover:shadow-xl ${
                  index === 0 ? "md:col-span-2" : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden ${
                    index === 0 ? "aspect-[21/9]" : "aspect-[4/3]"
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
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
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
                      className="absolute left-6 top-6 rounded-full border border-white/30 bg-white/95 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-dc-clay shadow-lg backdrop-blur-sm"
                    >
                      Signature
                    </motion.span>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <motion.h2
                      animate={{
                        y: hoveredId === collection.id ? -4 : 0,
                      }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="font-display text-4xl font-semibold text-white md:text-5xl"
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
                        className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 md:text-base"
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
                      className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink shadow-lg transition-all duration-200 hover:bg-dc-cream hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
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
            className="relative mt-24 rounded-3xl border border-dc-ink/8 bg-gradient-to-br from-dc-cream to-white p-12 shadow-lg backdrop-blur-xl md:p-16"
          >
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-dc-ink/8 bg-white/90 px-5 py-2 shadow-sm backdrop-blur-sm">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
                />
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60">
                  About Collections
                </span>
              </div>

              <h2 className="mt-8 font-display text-4xl font-semibold leading-tight text-dc-ink md:text-5xl">
                Crafted for every occasion
              </h2>

              <p className="mt-6 text-base leading-relaxed text-dc-ink/70 md:text-lg">
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
                className="mt-10 inline-flex h-14 items-center justify-center rounded-full bg-dc-caramel px-10 text-[11px] font-bold uppercase tracking-[0.25em] text-white shadow-lg transition-all duration-200 hover:bg-dc-clay hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50"
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
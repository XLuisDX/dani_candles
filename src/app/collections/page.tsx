/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const COLLECTIONS = [
  {
    id: 1,
    name: "Dani Style",
    slug: "dani-style",
    description:
      "Our signature collection. Timeless fragrances that embody sophistication and warmth, crafted to transform any space into a sanctuary of elegance.",
    imageUrl: "/collection4.jpg",
    featured: true,
  },
  {
    id: 2,
    name: "Baby Shower",
    slug: "baby-shower",
    description:
      "Delicate, gentle scents designed to celebrate new beginnings. Soft, calming fragrances perfect for creating a nurturing atmosphere for life's sweetest moments.",
    imageUrl: "/collection3.webp",
    featured: false,
  },
  {
    id: 3,
    name: "Wedding",
    slug: "wedding",
    description:
      "Romantic and refined. These candles capture the essence of love and celebration, bringing an enchanting ambiance to your most cherished occasions.",
    imageUrl: "/collection2.webp",
    featured: false,
  },
  {
    id: 4,
    name: "Winter Season",
    slug: "season",
    description:
      "Limited edition seasonal fragrances. Cozy, warming scents that capture the spirit of winter, from spiced notes to fresh evergreen aromas.",
    imageUrl: "/collection5.webp",
    featured: false,
  },
  {
    id: 5,
    name: "Special Collection",
    slug: "special-collection",
    description:
      "Exclusive limited editions and bespoke creations. Rare, carefully curated scents for those seeking something truly extraordinary and unique.",
    imageUrl: "/collection1.jpg",
    featured: false,
  },
];

export default function CollectionsPage() {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

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

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative grid gap-8 md:grid-cols-2"
      >
        {COLLECTIONS.map((collection, index) => (
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
                <img
                  src={collection.imageUrl}
                  alt={collection.name}
                  className="h-full w-full object-cover"
                />
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-t from-dc-ink/90 via-dc-ink/50 to-transparent" />

              {collection.featured && (
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

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/collections/${collection.slug}`)}
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
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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
            moments in life. From everyday elegance to milestone celebrations,
            our candles are made to enhance your most meaningful experiences
            with artisanal quality and intentional fragrance.
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
    </main>
  );
}
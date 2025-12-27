/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";

const FRAGRANCES = [
  {
    id: 1,
    name: "Peppermint",
    description:
      "Crisp and invigorating, our peppermint fragrance awakens the senses with its refreshing coolness. A perfect blend of natural mint essence that brings clarity and energy to any space.",
    benefits: [
      "Promotes mental clarity and focus",
      "Reduces stress and tension",
      "Creates an energizing atmosphere",
      "Natural deodorizing properties",
    ],
    imageUrl: "/fragrance1.jpg",
    notes: "Top: Fresh Mint · Heart: Eucalyptus · Base: Cool Menthol",
  },
  {
    id: 2,
    name: "Vanilla",
    description:
      "Warm and comforting, our vanilla fragrance envelops you in a sweet embrace. Made from premium Madagascar vanilla beans, it creates an atmosphere of pure indulgence and relaxation.",
    benefits: [
      "Soothes anxiety and promotes calmness",
      "Creates a welcoming, cozy ambiance",
      "Enhances feelings of comfort",
      "Timeless and universally loved scent",
    ],
    imageUrl: "/fragrance2.jpg",
    notes: "Top: Sweet Cream · Heart: Vanilla Bean · Base: Warm Sugar",
  },
  {
    id: 3,
    name: "Christmas Tree",
    description:
      "The essence of the holidays captured in a candle. Fresh pine needles and crisp winter air combine to bring the magic of a snow-dusted forest into your home.",
    benefits: [
      "Evokes nostalgic holiday memories",
      "Purifies and freshens air naturally",
      "Creates a festive atmosphere",
      "Grounding and centering effect",
    ],
    imageUrl: "/fragrance3.jpg",
    notes: "Top: Pine Needles · Heart: Cedar · Base: Winter Moss",
  },
  {
    id: 4,
    name: "Coffee",
    description:
      "Rich and robust, our coffee fragrance captures the warmth of freshly roasted beans. An aromatic blend that energizes and comforts, perfect for creating a cozy café ambiance at home.",
    benefits: [
      "Boosts energy and alertness",
      "Neutralizes unwanted odors",
      "Creates a warm, inviting space",
      "Stimulates productivity and focus",
    ],
    imageUrl: "/fragrance4.jpg",
    notes: "Top: Espresso · Heart: Roasted Beans · Base: Caramel",
  },
  {
    id: 5,
    name: "Lavender",
    description:
      "Tranquil and serene, our lavender fragrance is nature's gift for relaxation. Harvested from French lavender fields, this timeless scent promotes deep calm and peaceful rest.",
    benefits: [
      "Promotes restful sleep",
      "Reduces stress and anxiety",
      "Balances mood naturally",
      "Creates a spa-like sanctuary",
    ],
    imageUrl: "/fragrance5.jpg",
    notes: "Top: Fresh Lavender · Heart: Chamomile · Base: Soft Musk",
  },
  {
    id: 6,
    name: "Sandalwood",
    description:
      "Luxurious and grounding, our sandalwood fragrance offers a warm, woody sophistication. This premium scent brings depth and elegance to any space with its rich, creamy undertones.",
    benefits: [
      "Enhances meditation and mindfulness",
      "Promotes emotional balance",
      "Creates sophisticated ambiance",
      "Long-lasting, lingering fragrance",
    ],
    imageUrl: "/fragrance6.jpg",
    notes: "Top: Bergamot · Heart: Creamy Sandalwood · Base: Amber",
  },
];

export default function FragrancesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
        className="relative mb-20"
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
            Premium · Natural
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 font-display text-5xl font-semibold leading-tight text-dc-ink md:text-6xl lg:text-7xl"
        >
          Fragrances
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-4 max-w-2xl text-base leading-relaxed text-dc-ink/60"
        >
          Discover the carefully curated scents that define our candles. Each
          fragrance is selected for its quality, therapeutic benefits, and
          ability to transform your space.
        </motion.p>
      </motion.section>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative space-y-24"
      >
        {FRAGRANCES.map((fragrance, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.article
              key={fragrance.id}
              className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                !isEven ? "lg:grid-flow-dense" : ""
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`relative overflow-hidden rounded-3xl border border-dc-ink/8 bg-white/95 p-2 shadow-lg backdrop-blur-xl ${
                  !isEven ? "lg:col-start-2" : ""
                }`}
              >
                <div className="aspect-square overflow-hidden rounded-2xl bg-dc-sand/20">
                  <img
                    src={fragrance.imageUrl}
                    alt={fragrance.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.div>

              <div className={!isEven ? "lg:col-start-1 lg:row-start-1" : ""}>
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-dc-caramel/20 bg-dc-caramel/10 px-4 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-dc-caramel" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-dc-caramel">
                      Fragrance Profile
                    </span>
                  </div>

                  <h2 className="mt-6 font-display text-4xl font-semibold text-dc-ink md:text-5xl">
                    {fragrance.name}
                  </h2>

                  <p className="mt-4 text-base leading-relaxed text-dc-ink/70">
                    {fragrance.description}
                  </p>

                  <div className="mt-8 rounded-2xl border border-dc-ink/8 bg-dc-cream/50 p-6 backdrop-blur-sm">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60">
                      Benefits
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {fragrance.benefits.map((benefit, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-sm text-dc-ink/70"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-dc-caramel" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 rounded-2xl border border-dc-ink/8 bg-white/90 px-6 py-4 backdrop-blur-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/50">
                      Scent Notes
                    </p>
                    <p className="mt-2 font-display text-sm text-dc-ink">
                      {fragrance.notes}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.article>
          );
        })}
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-32 rounded-3xl border border-dc-ink/8 bg-gradient-to-br from-dc-cream to-white p-12 shadow-lg backdrop-blur-xl md:p-16"
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-dc-ink/8 bg-white/90 px-5 py-2 shadow-sm backdrop-blur-sm">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60">
              Our Promise
            </span>
          </div>

          <h2 className="mt-8 font-display text-4xl font-semibold leading-tight text-dc-ink md:text-5xl">
            Only the finest ingredients
          </h2>

          <p className="mt-6 text-base leading-relaxed text-dc-ink/70 md:text-lg">
            Every fragrance in our collection is carefully sourced and tested
            to ensure the highest quality. We use only premium, phthalate-free
            fragrance oils blended with 100% natural soy wax for a clean,
            long-lasting burn that fills your space with intention.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { label: "Phthalate", value: "Free" },
              { label: "Premium", value: "Oils" },
              { label: "Natural", value: "Ingredients" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="rounded-2xl border border-dc-ink/8 bg-white/90 px-6 py-6 backdrop-blur-sm"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/50">
                  {item.label}
                </p>
                <p className="mt-2 font-display text-2xl font-semibold text-dc-ink">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </main>
  );
}
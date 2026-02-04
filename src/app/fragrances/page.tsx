/* eslint-disable @next/next/no-img-element */
"use client";

import { FRAGRANCES } from "@/types/utils";
import { motion } from "framer-motion";

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
    <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8 overflow-y-hidden">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-16 md:mb-20"
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
            Premium · Natural
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 font-display text-4xl font-semibold leading-tight text-dc-ink dark:text-white sm:mt-5 sm:text-5xl md:mt-6 md:text-6xl lg:text-7xl"
        >
          Fragrances
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-3 max-w-2xl text-sm leading-relaxed text-dc-ink/60 dark:text-white/60 sm:mt-4 sm:text-base"
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
        className="relative space-y-16 md:space-y-20 lg:space-y-24"
      >
        {FRAGRANCES.map((fragrance, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.article
              key={fragrance.id}
              className={`grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16 ${
                !isEven ? "lg:grid-flow-dense" : ""
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`relative overflow-hidden rounded-2xl border border-dc-ink/8 bg-white/95 p-2 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 sm:rounded-3xl ${
                  !isEven ? "lg:col-start-2" : ""
                }`}
              >
                <div className="aspect-square overflow-hidden rounded-xl bg-dc-sand/20 dark:bg-white/5 sm:rounded-2xl">
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
                  <div className="inline-flex items-center gap-2 rounded-full border border-dc-caramel/20 bg-dc-caramel/10 px-3 py-1.5 sm:px-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-dc-caramel" />
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-dc-caramel sm:text-[9px]">
                      Fragrance Profile
                    </span>
                  </div>

                  <h2 className="mt-4 font-display text-3xl font-semibold text-dc-ink dark:text-white sm:mt-5 sm:text-4xl md:mt-6 md:text-5xl">
                    {fragrance.name}
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-dc-ink/70 dark:text-white/70 sm:mt-4 sm:text-base">
                    {fragrance.description}
                  </p>

                  <div className="mt-6 rounded-xl border border-dc-ink/8 bg-dc-cream/50 p-5 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:mt-8 sm:rounded-2xl sm:p-6">
                    <h3 className="text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
                      Benefits
                    </h3>
                    <ul className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                      {fragrance.benefits.map((benefit, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs text-dc-ink/70 dark:text-white/70 sm:gap-3 sm:text-sm"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-dc-caramel" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 rounded-xl border border-dc-ink/8 bg-white/90 px-5 py-3.5 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:mt-6 sm:rounded-2xl sm:px-6 sm:py-4">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/50 dark:text-white/50 sm:text-[10px]">
                      Scent Notes
                    </p>
                    <p className="mt-1.5 font-display text-xs text-dc-ink dark:text-white sm:mt-2 sm:text-sm">
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
        className="relative mt-24 rounded-2xl border border-dc-ink/8 bg-gradient-to-br from-dc-cream to-white p-8 shadow-lg backdrop-blur-xl dark:border-white/10 dark:from-[#1a1a1a] dark:to-[#252525] sm:mt-28 sm:rounded-3xl sm:p-10 md:mt-32 md:p-12 lg:p-16"
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-dc-ink/8 bg-white/90 px-4 py-1.5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:gap-2.5 sm:px-5 sm:py-2">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
            />
            <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60 sm:text-[10px]">
              Our Promise
            </span>
          </div>

          <h2 className="mt-6 font-display text-3xl font-semibold leading-tight text-dc-ink dark:text-white sm:mt-8 sm:text-4xl md:text-5xl">
            Only the finest ingredients
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-dc-ink/70 dark:text-white/70 sm:mt-6 sm:text-base md:text-lg">
            Every fragrance in our collection is carefully sourced and tested to
            ensure the highest quality. We use only premium, phthalate-free
            fragrance oils blended with 100% natural soy wax for a clean,
            long-lasting burn that fills your space with intention.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-6 md:mt-10">
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
                className="rounded-xl border border-dc-ink/8 bg-white/90 px-5 py-5 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:rounded-2xl sm:px-6 sm:py-6"
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/50 dark:text-white/50 sm:text-[10px]">
                  {item.label}
                </p>
                <p className="mt-1.5 font-display text-xl font-semibold text-dc-ink dark:text-white sm:mt-2 sm:text-2xl">
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
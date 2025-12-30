"use client";

import { CARE_SECTIONS, QUICK_TIPS } from "@/types/utils";
import { motion } from "framer-motion";
import { useState } from "react";

export default function CarePage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

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
    <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8 mt-16">
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
        className="relative mb-16 md:mb-20"
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
            Expert Guidance
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 font-display text-4xl font-semibold leading-tight text-dc-ink sm:mt-5 sm:text-5xl md:mt-6 md:text-6xl lg:text-7xl"
        >
          Candle Care Guide
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-3 max-w-2xl text-sm leading-relaxed text-dc-ink/60 sm:mt-4 sm:text-base"
        >
          Master the art of candle care with our comprehensive guide. From
          selecting the perfect scent to ensuring a clean, safe burn, discover
          everything you need to know to elevate your candle experience.
        </motion.p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative mb-16 grid gap-4 sm:grid-cols-2 sm:gap-5 md:mb-20 lg:grid-cols-4 lg:gap-6"
      >
        {QUICK_TIPS.map((tip, index) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            whileHover={{ y: -4 }}
            className="rounded-xl border border-dc-ink/8 bg-white/95 p-5 text-center shadow-sm backdrop-blur-xl sm:rounded-2xl sm:p-6"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-dc-cream/80 text-xl sm:h-14 sm:w-14 sm:text-2xl">
              {tip.icon}
            </div>
            <h3 className="mt-3 font-display text-base font-semibold text-dc-ink sm:mt-4 sm:text-lg">
              {tip.title}
            </h3>
            <p className="mt-1.5 text-xs text-dc-ink/60 sm:mt-2 sm:text-sm">
              {tip.description}
            </p>
          </motion.div>
        ))}
      </motion.section>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative space-y-6 md:space-y-8"
      >
        {CARE_SECTIONS.map((section) => {
          const isExpanded = expandedId === section.id;

          return (
            <motion.article
              key={section.id}
              className="relative overflow-hidden rounded-2xl border border-dc-ink/8 bg-white/95 shadow-lg backdrop-blur-xl sm:rounded-3xl"
            >
              <div className="p-5 sm:p-6 md:p-8 lg:p-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5 md:gap-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-dc-caramel/20 to-dc-clay/10 text-2xl shadow-sm sm:h-14 sm:w-14 sm:rounded-2xl sm:text-3xl md:h-16 md:w-16"
                  >
                    {section.icon}
                  </motion.div>

                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 rounded-full border border-dc-caramel/20 bg-dc-caramel/10 px-3 py-1 sm:px-4 sm:py-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-dc-caramel" />
                      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-dc-caramel sm:text-[9px]">
                        {section.subtitle}
                      </span>
                    </div>

                    <h2 className="mt-3 font-display text-2xl font-semibold text-dc-ink sm:mt-4 sm:text-3xl md:text-4xl">
                      {section.title}
                    </h2>

                    <p className="mt-3 text-sm leading-relaxed text-dc-ink/70 sm:mt-4 sm:text-base">
                      {section.description}
                    </p>

                    <motion.div
                      initial={false}
                      animate={{
                        height: isExpanded ? "auto" : "0",
                        opacity: isExpanded ? 1 : 0,
                      }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 rounded-xl border border-dc-ink/8 bg-dc-cream/50 p-5 backdrop-blur-sm sm:mt-6 sm:rounded-2xl sm:p-6">
                        <h3 className="text-[9px] font-bold uppercase tracking-[0.25em] text-dc-ink/60 sm:text-[10px]">
                          Pro Tips
                        </h3>
                        <ul className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                          {section.tips.map((tip, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start gap-2.5 text-xs text-dc-ink/70 sm:gap-3 sm:text-sm"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-dc-caramel" />
                              <span>{tip}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setExpandedId(isExpanded ? null : section.id)
                      }
                      className="mt-5 inline-flex items-center gap-2 rounded-full border border-dc-ink/10 bg-white/90 px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink shadow-sm transition-all duration-200 hover:border-dc-caramel/30 hover:bg-dc-cream/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 sm:mt-6 sm:px-6 sm:py-3 sm:text-[10px]"
                    >
                      {isExpanded ? "Show Less" : "Read More"}
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        ↓
                      </motion.span>
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-dc-sand/20 to-dc-caramel/10 blur-2xl" />
              <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-gradient-to-br from-dc-caramel/10 to-dc-clay/5 blur-2xl" />
            </motion.article>
          );
        })}
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-24 rounded-2xl border border-dc-ink/8 bg-gradient-to-br from-dc-caramel to-dc-clay p-8 shadow-xl sm:mt-28 sm:rounded-3xl sm:p-10 md:mt-32 md:p-12 lg:p-16"
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-1.5 shadow-lg backdrop-blur-sm sm:gap-2.5 sm:px-5 sm:py-2">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-white"
            />
            <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/90 sm:text-[10px]">
              Commitment to Excellence
            </span>
          </div>

          <h2 className="mt-6 font-display text-3xl font-semibold leading-tight text-white sm:mt-8 sm:text-4xl md:text-5xl">
            Crafted with care, meant to be cherished
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-white/90 sm:mt-6 sm:text-base md:text-lg">
            Every Dani Candle is created with meticulous attention to detail,
            from the first pour to the final burn. By following these care
            guidelines, you honor the craftsmanship behind each candle and
            ensure that every moment spent with your candle is as magical as
            intended.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:mt-10 sm:gap-4">
            <div className="rounded-xl border border-white/30 bg-white/20 px-5 py-3.5 backdrop-blur-sm sm:rounded-2xl sm:px-6 sm:py-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/80 sm:text-[10px]">
                Burn Time
              </p>
              <p className="mt-1 font-display text-xl font-semibold text-white sm:text-2xl">
                40+ Hours
              </p>
            </div>
            <div className="rounded-xl border border-white/30 bg-white/20 px-5 py-3.5 backdrop-blur-sm sm:rounded-2xl sm:px-6 sm:py-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/80 sm:text-[10px]">
                Soy Wax
              </p>
              <p className="mt-1 font-display text-xl font-semibold text-white sm:text-2xl">
                100% Natural
              </p>
            </div>
            <div className="rounded-xl border border-white/30 bg-white/20 px-5 py-3.5 backdrop-blur-sm sm:rounded-2xl sm:px-6 sm:py-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/80 sm:text-[10px]">
                Hand-Poured
              </p>
              <p className="mt-1 font-display text-xl font-semibold text-white sm:text-2xl">
                Small Batch
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-12 rounded-2xl border border-dc-ink/8 bg-white/95 p-6 shadow-lg backdrop-blur-xl sm:mt-14 sm:rounded-3xl sm:p-8 md:mt-16 md:p-12"
      >
        <div className="text-center">
          <h2 className="font-display text-2xl font-semibold text-dc-ink sm:text-3xl md:text-4xl">
            Still have questions?
          </h2>
          <p className="mt-3 text-sm text-dc-ink/60 sm:mt-4 sm:text-base">
            We are here to help you get the most out of your Dani Candles
            experience.
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/contact"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-dc-caramel px-6 text-[9px] font-bold uppercase tracking-[0.25em] text-white shadow-lg transition-all duration-200 hover:bg-dc-clay hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 sm:mt-8 sm:h-12 sm:px-8 sm:text-[10px]"
          >
            Contact Us
          </motion.a>
        </div>
      </motion.section>
    </main>
  );
}

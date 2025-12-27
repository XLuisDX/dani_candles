/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const CARE_SECTIONS = [
  {
    id: 1,
    title: "Choosing Your Perfect Candle",
    subtitle: "Finding the right scent for every moment",
    description:
      "Selecting the perfect candle goes beyond fragrance—it's about creating an experience. Consider the size of your space, the mood you want to create, and the time of day. Larger rooms benefit from candles with stronger scent throws, while intimate spaces shine with subtle, delicate fragrances.",
    tips: [
      "Morning rituals pair beautifully with fresh, energizing scents like peppermint or coffee",
      "Evening relaxation calls for calming notes such as lavender or vanilla",
      "Consider the season—warm, spicy scents for winter, light florals for spring",
      "Layer complementary fragrances in different rooms for a cohesive home experience",
    ],
    imageUrl: "/care1.jpg",
    icon: "✨",
  },
  {
    id: 2,
    title: "The First Burn Ritual",
    subtitle: "Setting the foundation for a perfect burn",
    description:
      "The first burn is the most important. Allow your candle to burn until the entire top surface melts into a complete pool of wax—typically 2-4 hours. This prevents tunneling and ensures an even burn for the life of your candle. This initial burn creates a memory ring that the candle will follow for all future burns.",
    tips: [
      "Never burn a candle for less than one hour on the first light",
      "Ensure the wax pool reaches the edges of the container",
      "Place on a heat-resistant surface away from drafts",
      "Keep the wick centered as the wax melts",
    ],
    imageUrl: "/care2.jpg",
    icon: "🕯️",
  },
  {
    id: 3,
    title: "Wick Maintenance",
    subtitle: "The secret to a clean, even burn",
    description:
      "A properly trimmed wick is essential for optimal candle performance. Before each burn, trim the wick to 1/4 inch using wick trimmers or scissors. This simple practice prevents smoking, reduces soot buildup, and ensures a steady, beautiful flame that maximizes your candle's fragrance throw.",
    tips: [
      "Trim the wick before every burn when the wax is cool and solid",
      "Remove any wick debris or char buildup from the wax pool",
      "A mushrooming wick is a sign it needs trimming",
      "Keep wick trimmers nearby as part of your candle care routine",
    ],
    imageUrl: "/care3.jpg",
    icon: "✂️",
  },
  {
    id: 4,
    title: "Safe Burning Practices",
    subtitle: "Enjoying candles with peace of mind",
    description:
      "Safety is paramount when enjoying candles. Never leave a burning candle unattended, and always keep them away from children, pets, and flammable materials. Place candles on stable, heat-resistant surfaces, away from drafts, vents, and ceiling fans that can cause uneven burning or smoking.",
    tips: [
      "Never burn a candle for more than 4 hours at a time",
      "Keep candles at least 3 inches apart from each other",
      "Extinguish candles when leaving a room or before sleep",
      "Use a candle snuffer to avoid hot wax splatter",
      "Discontinue use when 1/2 inch of wax remains",
    ],
    imageUrl: "/care4.jpg",
    icon: "🛡️",
  },
  {
    id: 5,
    title: "Maximizing Scent Throw",
    subtitle: "Getting the most from your fragrance",
    description:
      "To fully experience your candle's fragrance, consider your environment. Smaller, enclosed spaces will naturally have a stronger scent throw. For larger rooms, try burning multiple candles or placing them in central locations. Avoid competing scents from air fresheners or strong cooking odors during your first burn.",
    tips: [
      "Close doors and windows for the first 30 minutes of burning",
      "Place candles at nose level for optimal scent diffusion",
      "Burn candles in rooms you spend the most time in",
      "Allow the candle to burn long enough for proper scent release",
    ],
    imageUrl: "/care5.jpg",
    icon: "🌸",
  },
  {
    id: 6,
    title: "Storage & Longevity",
    subtitle: "Preserving your candles between burns",
    description:
      "Proper storage extends the life and quality of your candles. Keep them in a cool, dry place away from direct sunlight, which can fade colors and alter fragrances. Always replace the lid between burns to preserve the scent and protect from dust. With proper care, your candles will maintain their integrity and fragrance.",
    tips: [
      "Store candles upright to prevent wax from settling unevenly",
      "Keep away from heat sources and direct sunlight",
      "Dust the wax surface gently with a soft cloth if needed",
      "Use candles within one year for optimal fragrance strength",
    ],
    imageUrl: "/care6.jpg",
    icon: "📦",
  },
];

const QUICK_TIPS = [
  {
    title: "Burn Time",
    description: "2-4 hours per session",
    icon: "⏱️",
  },
  {
    title: "Wick Length",
    description: "Trim to 1/4 inch",
    icon: "📏",
  },
  {
    title: "Wax Remaining",
    description: "Stop at 1/2 inch",
    icon: "🔥",
  },
  {
    title: "First Burn",
    description: "Full melt pool essential",
    icon: "💫",
  },
];

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
            Expert Guidance
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6 font-display text-5xl font-semibold leading-tight text-dc-ink md:text-6xl lg:text-7xl"
        >
          Candle Care Guide
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-4 max-w-2xl text-base leading-relaxed text-dc-ink/60"
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
        className="relative mb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {QUICK_TIPS.map((tip, index) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-dc-ink/8 bg-white/95 p-6 text-center shadow-sm backdrop-blur-xl"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-dc-cream/80 text-2xl">
              {tip.icon}
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-dc-ink">
              {tip.title}
            </h3>
            <p className="mt-2 text-sm text-dc-ink/60">{tip.description}</p>
          </motion.div>
        ))}
      </motion.section>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative space-y-16"
      >
        {CARE_SECTIONS.map((section, index) => {
          const isEven = index % 2 === 0;
          const isExpanded = expandedId === section.id;

          return (
            <motion.article
              key={section.id}
              className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${
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
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-dc-sand/20">
                  <img
                    src={section.imageUrl}
                    alt={section.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-dc-ink/20">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-4xl shadow-xl backdrop-blur-sm">
                      {section.icon}
                    </div>
                  </div>
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
                      {section.subtitle}
                    </span>
                  </div>

                  <h2 className="mt-6 font-display text-3xl font-semibold text-dc-ink md:text-4xl">
                    {section.title}
                  </h2>

                  <p className="mt-4 text-base leading-relaxed text-dc-ink/70">
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
                    <div className="mt-6 rounded-2xl border border-dc-ink/8 bg-dc-cream/50 p-6 backdrop-blur-sm">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink/60">
                        Pro Tips
                      </h3>
                      <ul className="mt-4 space-y-3">
                        {section.tips.map((tip, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-sm text-dc-ink/70"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-dc-caramel" />
                            <span>{tip}</span>
                          </li>
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
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-dc-ink/10 bg-white/90 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink shadow-sm transition-all duration-200 hover:border-dc-caramel/30 hover:bg-dc-cream/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50"
                  >
                    {isExpanded ? "Show Less" : "Read More"}
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      ↓
                    </motion.span>
                  </motion.button>
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
        className="relative mt-32 rounded-3xl border border-dc-ink/8 bg-gradient-to-br from-dc-caramel to-dc-clay p-12 shadow-xl md:p-16"
      >
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/20 px-5 py-2 shadow-lg backdrop-blur-sm">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-white"
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/90">
              Commitment to Excellence
            </span>
          </div>

          <h2 className="mt-8 font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
            Crafted with care, meant to be cherished
          </h2>

          <p className="mt-6 text-base leading-relaxed text-white/90 md:text-lg">
            Every Dani Candle is created with meticulous attention to detail,
            from the first pour to the final burn. By following these care
            guidelines, you honor the craftsmanship behind each candle and
            ensure that every moment spent with your candle is as magical as
            intended.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <div className="rounded-2xl border border-white/30 bg-white/20 px-6 py-4 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                Burn Time
              </p>
              <p className="mt-1 font-display text-2xl font-semibold text-white">
                40+ Hours
              </p>
            </div>
            <div className="rounded-2xl border border-white/30 bg-white/20 px-6 py-4 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                Soy Wax
              </p>
              <p className="mt-1 font-display text-2xl font-semibold text-white">
                100% Natural
              </p>
            </div>
            <div className="rounded-2xl border border-white/30 bg-white/20 px-6 py-4 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                Hand-Poured
              </p>
              <p className="mt-1 font-display text-2xl font-semibold text-white">
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
        className="relative mt-16 rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl md:p-12"
      >
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold text-dc-ink md:text-4xl">
            Still have questions?
          </h2>
          <p className="mt-4 text-base text-dc-ink/60">
            We are here to help you get the most out of your Dani Candles
            experience.
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/contact"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-dc-caramel px-8 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-lg transition-all duration-200 hover:bg-dc-clay hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50"
          >
            Contact Us
          </motion.a>
        </div>
      </motion.section>
    </main>
  );
}
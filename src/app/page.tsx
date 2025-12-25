/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const CANDLE_IMAGES = [
  "/img1.jpg",
  "/img2.jpg",
  "/img3.jpg",
  "/img4.jpg",
  "/img5.jpg",
];

export default function Home() {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % CANDLE_IMAGES.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {CANDLE_IMAGES.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: index === currentImageIndex ? 1 : 0,
            }}
          >
            <img
              src={image}
              alt={`Candle ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-dc-ink/80 via-dc-ink/70 to-dc-ink/80" />
      </div>

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 flex items-center justify-center"
        >
          <div className="relative grid h-24 w-24 place-items-center overflow-hidden rounded-full border-2 border-white/30 bg-gradient-to-br from-white/20 to-dc-sand/20 shadow-2xl backdrop-blur-sm">
            <span className="font-display text-4xl font-semibold tracking-wider text-white">
              D
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-6xl font-bold leading-tight text-white md:text-7xl lg:text-8xl"
        >
          DANI CANDLES
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 font-display text-2xl italic tracking-wide text-white/90 md:text-3xl"
        >
          Awaken to ambiance
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-white/80"
        >
          Handcrafted in small batches with premium soy wax and curated
          fragrances, each Dani Candle transforms your space into a sanctuary of
          warmth and tranquility.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 flex flex-col gap-4 sm:flex-row"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/shop")}
            className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-[11px] font-bold uppercase tracking-[0.25em] text-dc-ink shadow-2xl transition-all duration-200 hover:bg-dc-cream hover:shadow-xl"
          >
            Shop Now
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/contact")}
            className="inline-flex h-14 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-10 text-[11px] font-bold uppercase tracking-[0.25em] text-white shadow-2xl backdrop-blur-sm transition-all duration-200 hover:border-white/50 hover:bg-white/20 hover:shadow-xl"
          >
            Contact
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 flex gap-2"
        >
          {CANDLE_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              className="h-6 w-6 text-white/60"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

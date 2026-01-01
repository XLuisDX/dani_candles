"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Logo } from "@/components/Logo";
import { CANDLE_IMAGES, TESTIMONIALS } from "@/types/utils";

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
    <div className="overflow-x-hidden">
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
              <Image
                src={image}
                alt={`Candle ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-dc-ink/70 via-dc-ink/50 to-dc-ink/70" />
        </div>

        <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 flex items-center justify-center sm:mb-8"
          >
            <Logo
              variant="white"
              height={60}
              width={240}
              animated={true}
              className="drop-shadow-2xl sm:h-20 sm:w-80"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          >
            DANI CANDLES
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-4 font-display text-xl italic tracking-wide text-white/90 sm:mt-6 sm:text-2xl md:text-3xl"
          >
            Awaken to ambiance
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-6 max-w-2xl px-4 text-base leading-relaxed text-white/80 sm:mt-8 sm:text-lg"
          >
            Handcrafted in small batches with premium soy wax and curated
            fragrances, each Dani Candle transforms your space into a sanctuary
            of warmth and tranquility.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-8 flex w-full max-w-md flex-col gap-3 px-4 sm:mt-12 sm:flex-row sm:gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/shop")}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-8 text-[10px] font-bold uppercase tracking-[0.25em] text-dc-ink shadow-2xl transition-all duration-200 hover:bg-dc-cream hover:shadow-xl sm:h-14 sm:w-auto sm:px-10 sm:text-[11px]"
            >
              Shop Now
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/contact")}
              className="inline-flex h-12 w-full items-center justify-center rounded-full border-2 border-white/30 bg-white/10 px-8 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-2xl backdrop-blur-sm transition-all duration-200 hover:border-white/50 hover:bg-white/20 hover:shadow-xl sm:h-14 sm:w-auto sm:px-10 sm:text-[11px]"
            >
              Contact
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-12 flex gap-2 sm:mt-16"
          >
            {CANDLE_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 sm:h-2 ${
                  index === currentImageIndex
                    ? "w-6 bg-white sm:w-8"
                    : "w-1.5 bg-white/40 hover:bg-white/60 sm:w-2"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:bottom-8"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg
                className="h-5 w-5 text-white/60 sm:h-6 sm:w-6"
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

      <section className="relative overflow-hidden bg-dc-cream py-16 sm:py-20 md:py-24 lg:py-32">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.2 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute -top-16 left-8 h-48 w-48 rounded-full bg-dc-sand blur-3xl sm:left-16 sm:h-64 sm:w-64"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.15 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute -bottom-16 right-8 h-56 w-56 rounded-full bg-dc-caramel blur-3xl sm:right-16 sm:h-72 sm:w-72"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2.5 rounded-full border border-dc-ink/8 bg-white/90 px-4 py-1.5 shadow-sm backdrop-blur-sm sm:px-5 sm:py-2">
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
                  About Us
                </span>
              </div>

              <h2 className="mt-6 font-display text-3xl font-semibold leading-tight text-dc-ink sm:mt-8 sm:text-4xl md:text-5xl lg:text-6xl">
                Crafted with intention
              </h2>

              <p className="mt-4 text-base leading-relaxed text-dc-ink/70 sm:mt-6 sm:text-lg">
                Every Dani Candle is more than just a product—it is an
                experience. Hand-poured in small batches, each candle is crafted
                with care using 100% natural soy wax, premium cotton wicks, and
                carefully curated fragrance blends.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-dc-ink/60 sm:mt-4 sm:text-base">
                Our commitment to quality means we never rush the process. From
                sourcing sustainable materials to perfecting each scent profile,
                we believe in creating candles that elevate everyday moments
                into meaningful rituals.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              <div className="overflow-hidden rounded-2xl border border-dc-ink/10 bg-gradient-to-br from-white to-dc-sand/20 p-6 shadow-xl sm:rounded-3xl sm:p-8">
                <div className="aspect-square overflow-hidden rounded-xl bg-white shadow-lg sm:rounded-2xl">
                  <Image
                    src="/dani.jpeg"
                    alt="Dani Candles craftsmanship"
                    width={600}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-gradient-to-br from-dc-sand/30 to-dc-caramel/20 blur-2xl sm:-bottom-6 sm:-right-6 sm:rounded-3xl" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 grid gap-4 sm:grid-cols-3 sm:gap-6 md:mt-20 lg:mt-24 lg:gap-8"
          >
            {[
              { label: "100% Natural", value: "Soy Wax" },
              { label: "Hand-Poured", value: "Small Batches" },
              { label: "Burn Time", value: "40+ Hours" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="rounded-xl border border-dc-ink/8 bg-white/90 px-4 py-6 text-center shadow-sm backdrop-blur-sm sm:rounded-2xl sm:px-6 sm:py-8"
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-dc-ink/50 sm:text-[10px]">
                  {item.label}
                </p>
                <p className="mt-2 font-display text-xl font-semibold text-dc-ink sm:mt-3 sm:text-2xl">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-dc-ink to-dc-clay py-20 sm:py-24 md:py-32 lg:py-40">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-dc-sand blur-3xl"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute -bottom-32 left-0 h-96 w-96 rounded-full bg-dc-caramel blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto mb-8 h-px w-16 bg-gradient-to-r from-transparent via-dc-sand to-transparent sm:mb-10" />

            <h2 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Explore our collections
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:mt-8 sm:text-lg">
              Each collection tells a story, curated for life special moments
              and everyday rituals
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/collections")}
              className="group relative mt-10 inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-10 text-[11px] font-bold uppercase tracking-[0.25em] text-dc-ink shadow-2xl transition-all duration-200 hover:shadow-xl sm:mt-12 sm:h-16 sm:px-12"
            >
              <span className="relative z-10">Discover Collections</span>
              <motion.div
                className="absolute inset-0 -z-0 bg-gradient-to-r from-dc-sand to-dc-cream"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <div className="mx-auto mt-8 h-px w-16 bg-gradient-to-r from-transparent via-white/40 to-transparent sm:mt-10" />
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-24 lg:py-32">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.15 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute -top-16 right-8 h-48 w-48 rounded-full bg-dc-caramel blur-3xl sm:right-16 sm:h-64 sm:w-64"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.2 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute -bottom-16 left-8 h-56 w-56 rounded-full bg-dc-sand blur-3xl sm:left-16 sm:h-72 sm:w-72"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2.5 rounded-full border border-dc-ink/8 bg-dc-cream/90 px-4 py-1.5 shadow-sm backdrop-blur-sm sm:px-5 sm:py-2">
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
                Testimonials
              </span>
            </div>

            <h2 className="mt-6 font-display text-3xl font-semibold leading-tight text-dc-ink sm:mt-8 sm:text-4xl md:text-5xl lg:text-6xl">
              Loved by many
            </h2>

            <p className="mt-3 text-base text-dc-ink/60 sm:mt-4 sm:text-lg">
              See what our customers have to say about their experience
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4"
          >
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -8 }}
                className="flex flex-col rounded-2xl border border-dc-ink/8 bg-dc-cream/50 p-6 shadow-lg backdrop-blur-xl sm:rounded-3xl sm:p-8"
              >
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 text-dc-caramel sm:h-5 sm:w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-dc-ink/70 sm:mt-6">
                  &quot;{testimonial.content}&quot;
                </p>

                <div className="mt-4 border-t border-dc-ink/8 pt-4 sm:mt-6 sm:pt-6">
                  <p className="font-display text-sm font-semibold text-dc-ink sm:text-base">
                    {testimonial.name}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-dc-ink/40 sm:text-xs">
                    {testimonial.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
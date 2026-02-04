"use client";

import { motion } from "framer-motion";

export default function AdminLoading() {
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
          Loading admin dashboard...
        </p>
      </motion.div>
    </main>
  );
}

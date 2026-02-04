"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-dc-sand/40 dark:bg-white/10"
        >
          <span className="font-display text-4xl font-bold text-dc-caramel">
            404
          </span>
        </motion.div>

        <h1 className="font-display text-3xl font-semibold text-dc-ink dark:text-white">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-dc-ink/60 dark:text-white/60">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved or doesn&apos;t exist.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button variant="primary">Go Home</Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline">Browse Shop</Button>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

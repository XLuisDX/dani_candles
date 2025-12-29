"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { isAdminEmail } from "@/lib/isAdmin";
import { ProductForm } from "@/components/admin/ProductForm";
import { slugify } from "@/lib/slugify";
import { ProductFormValues } from "@/types/types";

export default function NewProductPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/auth/login");
        return;
      }
      const email = data.user.email ?? null;
      if (!isAdminEmail(email)) {
        router.push("/");
        return;
      }
    };
    checkAdmin();
  }, [router]);

  const handleSubmit = async (
    values: ProductFormValues,
    imageFile: File | null
  ) => {
    setSubmitting(true);
    setError(null);

    try {
      const priceNumber = parseFloat(values.price);
      if (isNaN(priceNumber) || priceNumber < 0) {
        setError("Price must be a valid positive number.");
        setSubmitting(false);
        return;
      }

      const priceCents = Math.round(priceNumber * 100);

      const { data, error } = await supabase
        .from("products")
        .insert({
          name: values.name,
          slug: slugify(values.name),
          price_cents: priceCents,
          currency_code: values.currencyCode,
          active: values.active,
          short_description:
            values.shortDescription.trim() === ""
              ? null
              : values.shortDescription.trim(),
          description:
            values.description.trim() === "" ? null : values.description.trim(),
          collection_id: values.collection_id,
        })
        .select("id")
        .single();

      if (error || !data) {
        console.error(error);
        setError("Could not create product.");
        return;
      }

      const productId = data.id as string;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("productId", productId);

        try {
          const res = await fetch("/api/admin/upload-product-image", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            console.error("Upload product image failed:", await res.text());
          }
        } catch (err) {
          console.error("Error calling upload-product-image:", err);
        }
      }

      router.push("/admin/products");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative mx-auto max-w-5xl px-6 py-16 md:py-20 lg:px-8">
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

      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ x: -4 }}
        type="button"
        onClick={() => router.push("/admin/products")}
        className="relative inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/55 transition-colors hover:text-dc-caramel"
      >
        <span aria-hidden>←</span> Back to products
      </motion.button>

      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative mt-8 rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl md:p-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="inline-flex items-center gap-2.5 rounded-full border border-dc-ink/8 bg-white/90 px-5 py-2 shadow-sm"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
          />
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60">
            Admin · Products
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6 font-display text-4xl font-semibold leading-tight text-dc-ink md:text-5xl"
        >
          New product
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-4 text-base leading-relaxed text-dc-ink/60"
        >
          Create a new product for the Dani Candles catalog.
        </motion.p>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 rounded-2xl border border-red-500/20 bg-red-50/50 px-6 py-4 text-sm font-medium text-red-700"
          >
            {error}
          </motion.div>
        )}
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="relative mt-8 rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl md:p-10"
      >
        <ProductForm
          mode="create"
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
        />
      </motion.section>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminProduct, ProductFormValues } from "@/types/types";
import { toast } from "@/components/Toast";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initPage = async () => {
      if (!productId) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/admin/products?id=${productId}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            router.push("/auth/login");
            return;
          }
          throw new Error(data.error || "Could not load product.");
        }

        setProduct(data.product as AdminProduct);
      } catch (err) {
        console.error("Error loading product:", err);
        setError("Could not load product.");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [productId, router]);

  const handleSubmit = async (
    values: ProductFormValues,
    imageFile: File | null
  ) => {
    if (!product) return;
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

      let categoryIdValue: string | null = null;
      const trimmedCategoryId = values.collection_id.trim();

      if (trimmedCategoryId !== "") {
        const uuidRegex =
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
        if (!uuidRegex.test(trimmedCategoryId)) {
          setError("Category ID must be a valid UUID or empty.");
          setSubmitting(false);
          return;
        }
        categoryIdValue = trimmedCategoryId;
      }

      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: product.id,
          name: values.name,
          price_cents: priceCents,
          currency_code: values.currencyCode,
          active: values.active,
          short_description:
            values.shortDescription.trim() === ""
              ? null
              : values.shortDescription.trim(),
          description:
            values.description.trim() === "" ? null : values.description.trim(),
          collection_id: categoryIdValue,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/auth/login");
          return;
        }
        setError(data.error || "Could not update product.");
        toast.error("Update failed", data.error || "Could not update product");
        return;
      }

      let updatedProduct = data.product as AdminProduct;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("productId", product.id);

        try {
          const res = await fetch("/api/admin/upload-product-image", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            console.error("Upload product image failed:", await res.text());
          } else {
            const json = await res.json().catch(() => null);
            if (json?.imageUrl) {
              updatedProduct = {
                ...updatedProduct,
                image_url: json.imageUrl as string,
              };
            }
          }
        } catch (err) {
          console.error("Error calling upload-product-image:", err);
        }
      }

      setProduct(updatedProduct);
      toast.success("Product updated successfully");
      router.push("/admin/products");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="relative mx-auto max-w-5xl px-6 py-16 md:py-20 lg:px-8 overflow-y-hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 rounded-2xl border border-dc-ink/8 bg-white/90 px-6 py-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#1a1a1a]/90"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2.5 w-2.5 rounded-full bg-dc-caramel"
          />
          <p className="text-sm font-medium text-dc-ink/70 dark:text-white/70">
            Loading product...
          </p>
        </motion.div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="relative mx-auto max-w-5xl px-6 py-16 md:py-20 lg:px-8 overflow-y-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-red-500/20 bg-red-50/50 px-6 py-5 text-sm font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400"
        >
          {error ?? "Product not found."}
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => router.push("/admin/products")}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full border border-dc-ink/10 bg-white/80 px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/70 shadow-sm transition-all duration-200 hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
        >
          Back to products
        </motion.button>
      </main>
    );
  }

  const initialValues: ProductFormValues = {
    name: product.name,
    price: (product.price_cents / 100).toFixed(2),
    currencyCode: product.currency_code,
    active: product.active,
    shortDescription: product.short_description ?? "",
    description: product.description ?? "",
    collection_id: product.collection_id ?? "",
  };

  return (
    <main className="relative mx-auto max-w-5xl px-6 py-8 md:py-12 lg:px-8">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ x: -4 }}
        type="button"
        onClick={() => router.push("/admin/products")}
        className="relative inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/55 transition-colors hover:text-dc-caramel dark:text-white/55"
      >
        <span aria-hidden>←</span> Back to products
      </motion.button>

      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative mt-8 rounded-3xl border border-dc-ink/8 bg-white/95 p-8 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95 md:p-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="inline-flex items-center gap-2.5 rounded-full border border-dc-ink/8 bg-white/90 px-5 py-2 shadow-sm dark:border-white/10 dark:bg-white/5"
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
          />
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60">
            Admin · Products
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6 font-display text-4xl font-semibold leading-tight text-dc-ink dark:text-white md:text-5xl"
        >
          Edit product
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-4 text-base leading-relaxed text-dc-ink/60 dark:text-white/60"
        >
          Update this product&apos;s information.
        </motion.p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="relative mt-8"
      >
        <ProductForm
          mode="edit"
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
          currentImageUrl={product.image_url}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="relative mt-6 text-[10px] font-semibold uppercase tracking-[0.15em] text-dc-ink/40 dark:text-white/40"
      >
        Tip: Keep descriptions short and sensory — scent notes, mood, and burn
        time.
      </motion.div>
    </main>
  );
}
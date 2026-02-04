"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AdminProduct } from "@/types/types";
import { toast } from "@/components/Toast";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            router.push("/auth/login");
            return;
          }
          throw new Error(data.error || "Failed to load products");
        }

        setProducts(data.products || []);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Could not load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [router]);

  const toggleActive = async (productId: string, current: boolean) => {
    setUpdatingId(productId);
    setError(null);

    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, active: !current }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update product");
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? (data.product as AdminProduct) : p))
      );
      toast.success(`Product ${!current ? "activated" : "hidden"}`);
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Could not update product status.");
      toast.error("Update failed", "Could not update product status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this product?"
    );
    if (!confirmed) return;

    setDeletingId(productId);
    setError(null);

    try {
      const res = await fetch(`/api/admin/products?id=${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast.success("Product deleted");
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Could not delete product.");
      toast.error("Delete failed", "Could not delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <main className="relative mx-auto max-w-7xl px-6 py-8 md:py-12 lg:px-8">
      <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-dc-ink/8 bg-white/90 px-5 py-2 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60 dark:text-white/60">
              Admin
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 font-display text-5xl font-semibold leading-tight text-dc-ink dark:text-white md:text-6xl"
          >
            Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-4 text-base leading-relaxed text-dc-ink/60 dark:text-white/60"
          >
            Manage visibility and pricing for Dani Candles products.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => router.push("/admin/products/new")}
            className="inline-flex h-11 items-center justify-center rounded-full bg-dc-caramel px-6 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-sm transition-all duration-200 hover:bg-dc-clay hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50"
          >
            + New product
          </motion.button>
        </motion.div>
      </div>

      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mt-12 flex items-center gap-4 rounded-2xl border border-dc-ink/8 bg-white/90 px-6 py-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#1a1a1a]/90"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2.5 w-2.5 rounded-full bg-dc-caramel"
          />
          <p className="text-sm font-medium text-dc-ink/70 dark:text-white/70">
            Loading products...
          </p>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mt-12 rounded-2xl border border-red-500/20 bg-red-50/50 px-6 py-5 text-sm font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400"
        >
          {error}
        </motion.div>
      )}

      {!loading && products.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative mt-12 rounded-3xl border border-dc-ink/8 bg-white/95 p-10 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95"
        >
          <p className="text-base text-dc-ink/60 dark:text-white/60">No products found.</p>
        </motion.div>
      )}

      {!loading && products.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative mt-12 overflow-hidden rounded-3xl border border-dc-ink/8 bg-white/95 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-[#1a1a1a]/95"
        >
          <div className="grid grid-cols-[2fr_1fr_1fr_1.2fr] gap-4 border-b border-dc-ink/8 bg-dc-sand/10 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/50 dark:border-white/10 dark:bg-white/5 dark:text-white/50">
            <span>Product</span>
            <span>Price</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {products.map((product) => {
              const price = (product.price_cents / 100).toFixed(2);
              const createdAtLabel = product.created_at
                ? new Date(product.created_at).toLocaleDateString()
                : "—";

              const isBusy =
                updatingId === product.id || deletingId === product.id;

              return (
                <motion.div
                  key={product.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1.2fr] gap-4 border-b border-dc-ink/5 px-6 py-6 dark:border-white/5"
                >
                  <div className="flex flex-col">
                    <span className="font-display text-xl font-semibold leading-tight text-dc-ink dark:text-white">
                      {product.name}
                    </span>
                    <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-dc-ink/40 dark:text-white/40">
                      Created: {createdAtLabel}
                    </span>
                    <span className="mt-1 text-[10px] font-medium text-dc-ink/40 dark:text-white/40">
                      ID: <span className="font-mono">{product.id}</span>
                    </span>
                  </div>

                  <div className="flex items-center text-base font-bold text-dc-ink dark:text-white">
                    {price}{" "}
                    <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40 dark:text-white/40">
                      {product.currency_code}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] ${
                        product.active
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "border-dc-ink/10 bg-dc-sand/30 text-dc-ink/60 dark:border-white/10 dark:bg-white/5 dark:text-white/60"
                      }`}
                    >
                      {product.active ? "Active" : "Hidden"}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      disabled={isBusy}
                      onClick={() => toggleActive(product.id, product.active)}
                      className="inline-flex items-center justify-center rounded-full border border-dc-ink/10 bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/80 shadow-sm transition-all duration-200 hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                      {product.active ? "Hide" : "Activate"}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      disabled={isBusy}
                      onClick={() =>
                        router.push(`/admin/products/${product.id}`)
                      }
                      className="inline-flex items-center justify-center rounded-full border border-dc-caramel/20 bg-dc-sand/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-clay shadow-sm transition-all duration-200 hover:border-dc-caramel/30 hover:bg-dc-sand/60 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dc-caramel/10 dark:text-dc-caramel"
                    >
                      Edit
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleDeleteProduct(product.id)}
                      className="inline-flex items-center justify-center rounded-full border border-red-500/25 bg-red-500/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-red-700 shadow-sm transition-all duration-200 hover:border-red-500/35 hover:bg-red-500/10 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}

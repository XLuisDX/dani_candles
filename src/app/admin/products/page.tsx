"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { isAdminEmail } from "@/lib/isAdmin";
import { AdminProduct } from "@/types/types";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("products")
        .select("id, name, price_cents, currency_code, active, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setError("Could not load products.");
      } else {
        setProducts(data as AdminProduct[]);
      }

      setLoading(false);
    };

    loadProducts();
  }, []);

  const toggleActive = async (productId: string, current: boolean) => {
    setUpdatingId(productId);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("products")
        .update({ active: !current })
        .eq("id", productId)
        .select("id, name, price_cents, currency_code, active, created_at")
        .single();

      if (error || !data) {
        console.error(error);
        setError("Could not update product status.");
      } else {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? (data as AdminProduct) : p))
        );
      }
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
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) {
        console.error(error);
        setError("Could not delete product.");
      } else {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
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
    <main className="relative mx-auto max-w-7xl px-6 py-8 md:py-12 lg:px-8 overflow-y-hidden">
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
            className="inline-flex items-center gap-2.5 rounded-full border border-dc-ink/8 bg-white/90 px-5 py-2 shadow-sm backdrop-blur-sm"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-dc-caramel"
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-dc-ink/60">
              Admin
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 font-display text-5xl font-semibold leading-tight text-dc-ink md:text-6xl"
          >
            Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-4 text-base leading-relaxed text-dc-ink/60"
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
          className="relative mt-12 flex items-center gap-4 rounded-2xl border border-dc-ink/8 bg-white/90 px-6 py-5 shadow-sm backdrop-blur-sm"
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2.5 w-2.5 rounded-full bg-dc-caramel"
          />
          <p className="text-sm font-medium text-dc-ink/70">
            Loading products...
          </p>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mt-12 rounded-2xl border border-red-500/20 bg-red-50/50 px-6 py-5 text-sm font-medium text-red-700"
        >
          {error}
        </motion.div>
      )}

      {!loading && products.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative mt-12 rounded-3xl border border-dc-ink/8 bg-white/95 p-10 shadow-sm backdrop-blur-xl"
        >
          <p className="text-base text-dc-ink/60">No products found.</p>
        </motion.div>
      )}

      {!loading && products.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative mt-12 overflow-hidden rounded-3xl border border-dc-ink/8 bg-white/95 shadow-lg backdrop-blur-xl"
        >
          <div className="grid grid-cols-[2fr_1fr_1fr_1.2fr] gap-4 border-b border-dc-ink/8 bg-dc-sand/10 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/50">
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
                  className="grid grid-cols-[2fr_1fr_1fr_1.2fr] gap-4 border-b border-dc-ink/5 px-6 py-6"
                >
                  <div className="flex flex-col">
                    <span className="font-display text-xl font-semibold leading-tight text-dc-ink">
                      {product.name}
                    </span>
                    <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-dc-ink/40">
                      Created: {createdAtLabel}
                    </span>
                    <span className="mt-1 text-[10px] font-medium text-dc-ink/40">
                      ID: <span className="font-mono">{product.id}</span>
                    </span>
                  </div>

                  <div className="flex items-center text-base font-bold text-dc-ink">
                    {price}{" "}
                    <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-dc-ink/40">
                      {product.currency_code}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] ${
                        product.active
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                          : "border-dc-ink/10 bg-dc-sand/30 text-dc-ink/60"
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
                      className="inline-flex items-center justify-center rounded-full border border-dc-ink/10 bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-ink/80 shadow-sm transition-all duration-200 hover:border-dc-ink/15 hover:bg-white hover:text-dc-ink hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 disabled:cursor-not-allowed disabled:opacity-50"
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
                      className="inline-flex items-center justify-center rounded-full border border-dc-caramel/20 bg-dc-sand/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-dc-clay shadow-sm transition-all duration-200 hover:border-dc-caramel/30 hover:bg-dc-sand/60 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dc-caramel/50 disabled:cursor-not-allowed disabled:opacity-50"
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

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { isAdminEmail } from "@/lib/isAdmin"

interface AdminProduct {
  id: string
  name: string
  price_cents: number
  currency_code: string
  active: boolean
  created_at: string | null
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
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

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Admin · Products
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage visibility and pricing for Dani Candles products.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => router.push("/admin/products/new")}
            className="rounded-full border border-amber-500/60 bg-amber-500/10 px-4 py-1.5 text-xs text-amber-200 hover:border-amber-400 hover:bg-amber-500/20"
          >
            + New product
          </button>
        </div>
      </div>

      {loading && (
        <p className="mt-6 text-sm text-zinc-400">Loading products...</p>
      )}

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      {!loading && products.length === 0 && !error && (
        <p className="mt-6 text-sm text-zinc-400">No products found.</p>
      )}

      {!loading && products.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/60">
          <div className="grid grid-cols-[2fr_1fr_1fr_1.2fr] gap-4 border-b border-zinc-900 px-4 py-3 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            <span>Product</span>
            <span>Price</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>
          <div>
            {products.map((product) => {
              const price = (product.price_cents / 100).toFixed(2);
              const createdAtLabel = product.created_at
                ? new Date(product.created_at).toLocaleDateString()
                : "—";

              const isBusy =
                updatingId === product.id || deletingId === product.id;

              return (
                <div
                  key={product.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1.2fr] gap-4 border-t border-zinc-900 px-4 py-3 text-sm text-zinc-200"
                >
                  <div className="flex flex-col">
                    <span className="text-sm text-zinc-100">
                      {product.name}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Created: {createdAtLabel}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      ID: <span className="font-mono">{product.id}</span>
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-zinc-100">
                    {price}{" "}
                    <span className="ml-1 text-xs text-zinc-500">
                      {product.currency_code}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${
                        product.active
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                          : "border-zinc-600/60 bg-zinc-800/60 text-zinc-300"
                      }`}
                    >
                      {product.active ? "Active" : "Hidden"}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 text-[11px]">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => toggleActive(product.id, product.active)}
                      className="rounded-full border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-200 hover:border-amber-400 hover:text-amber-300 disabled:opacity-50"
                    >
                      {product.active ? "Hide" : "Activate"}
                    </button>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() =>
                        router.push(`/admin/products/${product.id}`)
                      }
                      className="rounded-full border border-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 disabled:opacity-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleDeleteProduct(product.id)}
                      className="rounded-full border border-red-600/70 px-2.5 py-0.5 text-xs text-red-300 hover:border-red-500 hover:text-red-200 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}

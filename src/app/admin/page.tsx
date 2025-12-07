"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { isAdminEmail } from "@/lib/isAdmin";

interface CurrentUser {
  id: string;
  email: string | null;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/auth/login");
        return;
      }

      const email = data.user.email ?? null;
      const admin = isAdminEmail(email);

      if (!admin) {
        router.push("/");
        return;
      }

      setUser({ id: data.user.id, email });
      setIsAdmin(admin);
      setLoading(false);
    };

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-zinc-400">Checking admin access...</p>
      </main>
    );
  }

  if (!isAdmin || !user) {
    return null;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-white">
        Admin dashboard
      </h1>
      <p className="mt-1 text-sm text-zinc-400">
        Welcome, {user.email}. Manage Dani Candles from here.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <button
          type="button"
          onClick={() => router.push("/admin/orders")}
          className="rounded-2xl border border-zinc-900 bg-zinc-950/70 p-5 text-left hover:border-amber-400 hover:bg-zinc-900/70"
        >
          <h2 className="text-sm font-semibold text-zinc-100">Orders</h2>
          <p className="mt-1 text-xs text-zinc-400">
            Review and update customer orders.
          </p>
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-2xl border border-zinc-900 bg-zinc-950/70 p-5 text-left hover:border-amber-400 hover:bg-zinc-900/70"
        >
          <h2 className="text-sm font-semibold text-zinc-100">Products</h2>
          <p className="mt-1 text-xs text-zinc-400">
            Manage Dani Candles catalog: visibility and pricing.
          </p>
        </button>

        <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 p-5">
          <h2 className="text-sm font-semibold text-zinc-100">Coming soon</h2>
          <p className="mt-1 text-xs text-zinc-400">
            Collections, promos & more tools for Dani.
          </p>
        </div>
      </section>
    </main>
  );
}

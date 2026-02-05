import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isAdminEmail } from "@/lib/isAdmin";
import { supabaseServer } from "@/lib/supabaseServer";
import { slugify } from "@/lib/slugify";

async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const email = user.email ?? null;
  if (!isAdminEmail(email)) {
    return null;
  }

  return user;
}

export async function GET(request: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    // If ID provided, return single product with full details
    if (productId) {
      const { data, error } = await supabaseServer
        .from("products")
        .select(
          "id, name, price_cents, currency_code, active, short_description, description, collection_id, image_url, created_at, product_type"
        )
        .eq("id", productId)
        .maybeSingle();

      if (error) {
        console.error("[/api/admin/products] Error loading product:", error);
        return NextResponse.json(
          { error: "Could not load product" },
          { status: 500 }
        );
      }

      if (!data) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ product: data });
    }

    // Otherwise return all products (list view)
    const { data, error } = await supabaseServer
      .from("products")
      .select("id, name, price_cents, currency_code, active, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading products:", error);
      return NextResponse.json(
        { error: "Could not load products" },
        { status: 500 }
      );
    }

    return NextResponse.json({ products: data });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      price_cents,
      currency_code,
      active,
      short_description,
      description,
      collection_id,
      product_type,
    } = body;

    if (!name || price_cents === undefined) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from("products")
      .insert({
        name,
        slug: slugify(name),
        price_cents,
        currency_code: currency_code || "USD",
        active: active ?? true,
        short_description: short_description || null,
        description: description || null,
        collection_id: collection_id || null,
        product_type: product_type || "aromatic",
      })
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("[/api/admin/products] Error creating product:", error);
      return NextResponse.json(
        { error: "Could not create product", details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Product creation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ product: data });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};

    if (body.active !== undefined) updateData.active = body.active;
    if (body.name !== undefined) updateData.name = body.name;
    if (body.price_cents !== undefined) updateData.price_cents = body.price_cents;
    if (body.currency_code !== undefined) updateData.currency_code = body.currency_code;
    if (body.short_description !== undefined) updateData.short_description = body.short_description;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.collection_id !== undefined) updateData.collection_id = body.collection_id;
    if (body.product_type !== undefined) updateData.product_type = body.product_type;

    const { data, error } = await supabaseServer
      .from("products")
      .update(updateData)
      .eq("id", productId)
      .select(
        "id, name, price_cents, currency_code, active, short_description, description, collection_id, image_url, created_at, product_type"
      )
      .maybeSingle();

    if (error) {
      console.error("[/api/admin/products] Error updating product:", error);
      return NextResponse.json(
        { error: "Could not update product" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product: data });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json(
        { error: "Could not delete product" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

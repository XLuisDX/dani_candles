import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const collection = searchParams.get("collection");
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");
    const productType = searchParams.get("type");

    // Fetch single product by slug
    if (slug) {
      const { data, error } = await supabaseServer
        .from("products")
        .select(
          `
          id,
          name,
          slug,
          short_description,
          description,
          price_cents,
          currency_code,
          image_url,
          collection_id,
          product_type,
          collections!products_collection_id_fkey (
            id,
            name,
            slug
          )
        `
        )
        .eq("slug", slug)
        .eq("active", true)
        .maybeSingle();

      if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json(
          { error: "Failed to fetch product", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ product: data });
    }

    // Fetch multiple products
    let query = supabaseServer
      .from("products")
      .select(
        "id, name, slug, short_description, price_cents, currency_code, is_featured, image_url, created_at, collection_id, product_type"
      )
      .eq("active", true)
      .order("created_at", { ascending: false });

    if (collection) {
      query = query.eq("collection_id", collection);
    }

    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    if (productType && (productType === "aromatic" || productType === "decorative")) {
      query = query.eq("product_type", productType);
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,short_description.ilike.%${search}%`
      );
    }

    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch products", details: error.message },
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

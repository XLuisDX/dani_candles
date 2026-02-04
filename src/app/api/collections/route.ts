import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");

    // Handle single collection lookup by slug
    if (slug) {
      const { data, error } = await supabaseServer
        .from("collections")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        console.error("[/api/collections] Supabase error:", error);
        return NextResponse.json(
          { error: "Failed to fetch collection", details: error.message },
          { status: 500 }
        );
      }

      if (!data) {
        return NextResponse.json(
          { error: "Collection not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ collection: data });
    }

    // Handle list of collections
    let query = supabaseServer.from("collections").select("*");

    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch collections", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ collections: data });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

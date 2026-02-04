import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServer";
import { isAdminEmail } from "@/lib/isAdmin";

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

export async function POST(req: NextRequest) {
  // Verify admin authentication
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    const file = formData.get("file");
    const productId = formData.get("productId");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing or invalid file" },
        { status: 400 }
      );
    }

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid productId" },
        { status: 400 }
      );
    }

    const ext =
      file.name.split(".").pop() ||
      "jpg";
    const filePath = `products/${productId}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabaseServer.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("[upload-product-image] Upload error:", uploadError);
      return NextResponse.json(
        { error: "Upload failed" },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabaseServer.storage
      .from("product-images")
      .getPublicUrl(filePath);

    const { error: updateError } = await supabaseServer
      .from("products")
      .update({ image_url: publicUrl })
      .eq("id", productId);

    if (updateError) {
      console.error(
        "[upload-product-image] Error updating product image_url:",
        updateError
      );
      return NextResponse.json(
        { error: "Could not update product image_url" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, imageUrl: publicUrl });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error";
    console.error("[upload-product-image] Handler error:", message);
    return NextResponse.json(
      { error: "Handler error", message },
      { status: 500 }
    );
  }
}

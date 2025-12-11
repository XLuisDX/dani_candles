import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
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

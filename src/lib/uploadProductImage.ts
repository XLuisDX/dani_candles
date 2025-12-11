import { supabase } from "@/lib/supabaseClient"

export async function uploadProductImage(
  file: File,
  productId: string
): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg"
  const filePath = `products/${productId}-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

  if (uploadError) {
    console.error("Error uploading product image:", uploadError)
    throw new Error("Could not upload product image.")
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(filePath)

  return publicUrl
}

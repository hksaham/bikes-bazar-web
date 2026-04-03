import { supabase } from "@/integrations/supabase/client";
import imageCompression from "browser-image-compression";

const BUCKET = "bike-images";

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxWidthOrHeight: 1200,
    maxSizeMB: 1,
    useWebWorker: true,
  };
  return imageCompression(file, options);
}

export async function uploadBikeImage(
  bikeId: string,
  file: File
): Promise<string> {
  const compressed = await compressImage(file);
  const ext = compressed.name.split(".").pop() || "jpg";
  const path = `${bikeId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, compressed, { contentType: compressed.type, upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteBikeImage(url: string): Promise<void> {
  // Extract path from full URL
  const parts = url.split(`/storage/v1/object/public/${BUCKET}/`);
  if (parts.length < 2) return;
  const path = parts[1];

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}

export async function listBikeImages(bikeId: string): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(bikeId, { sortBy: { column: "created_at", order: "asc" } });

  if (error || !data) return [];

  return data
    .filter((f) => f.name !== ".emptyFolderPlaceholder")
    .map((f) => {
      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(`${bikeId}/${f.name}`);
      return urlData.publicUrl;
    });
}

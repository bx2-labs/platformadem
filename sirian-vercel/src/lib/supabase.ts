import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Book = {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  pdf_file: string;
  whatsapp_number: string;
  created_at: string;
};

export type Podcast = {
  id: string;
  episode_title: string;
  audio_file_url: string;
  cover_image: string;
  description: string;
  created_at: string;
};

export type Article = {
  id: string;
  article_title: string;
  full_content: string;
  featured_image: string;
  created_at: string;
};

export type SiteContent = {
  id: string;
  key: string;
  value: string;
  updated_at: string;
};

// Helper to get a map of key → value from site_content
export type ContentMap = Record<string, string>;

export async function getSiteContent(): Promise<ContentMap> {
  const { data } = await supabase.from("site_content").select("key, value");
  const map: ContentMap = {};
  if (data) data.forEach((row: { key: string; value: string }) => { map[row.key] = row.value; });
  return map;
}

export async function setSiteContent(key: string, value: string): Promise<void> {
  await supabase
    .from("site_content")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
}

// Upload a file to Supabase Storage, returns public URL
export async function uploadFile(bucket: string, path: string, file: File): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

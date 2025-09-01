// src/services/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipe user admin
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  last_login: string;
}

// Helper function ambil semua admin
export async function fetchAdmins(): Promise<AdminUser[]> {
  const { data, error } = await supabase.from("admin").select("*");

  if (error) {
    console.error("Gagal fetch admin:", error);
    return [];
  }

  return data as AdminUser[];
}

// Helper function ambil satu admin by ID
export async function fetchAdminById(id: string): Promise<AdminUser | null> {
  const { data, error } = await supabase
    .from("admin")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Gagal fetch admin by id:", error);
    return null;
  }

  return data as AdminUser;
}

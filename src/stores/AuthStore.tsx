import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../services/supabaseClient";

interface User {
  id: string;
  username: string;
  email: string;
  last_login: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      // LOGIN dengan Supabase RPC
      login: async (username: string, password: string) => {
        const { data, error } = await supabase.rpc("verify_admin_login", {
          p_username: username,
          p_password: password,
        });

        if (error || !data || data.length === 0) {
          console.error("Login failed:", error);
          return false;
        }

        // Simpan user di store
        set({ user: data[0], isLoggedIn: true });
        return true;
      },

      logout: () => {
        set({ user: null, isLoggedIn: false });
      },
    }),
    {
      name: "auth-storage", // localStorage key
    }
  )
);

export default useAuthStore;
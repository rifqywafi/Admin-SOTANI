import { create } from "zustand";
import { supabase } from "../services/supabaseClient";

export interface User {
  id: string;
  username: string;
  email: string;
  last_login: string;
}

interface UserState {
  users: User[];
  setUsers: (users: User[]) => void;
  fetchUsers: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),

  fetchUsers: async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      console.error("Gagal fetch users:", error);
      return;
    }
    set({ users: data as User[] });
  },
}));

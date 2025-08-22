import { create } from "zustand";

interface AuthState {
  username: string;
  password: string;
  isLoggedIn: boolean;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  login: () => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  username: "",
  password: "",
  isLoggedIn: false,

  setUsername: (username) => set({ username }),
  setPassword: (password) => set({ password }),
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false, username: "", password: "" }),
}));

export default useAuthStore;
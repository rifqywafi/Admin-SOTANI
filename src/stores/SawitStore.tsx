import { create } from "zustand";

// ================== Types ==================
export type StatusSawit = "Matang" | "Belum Matang" | "Terlalu Matang" | "Berjamur";

export interface SawitData {
  id: number;
  tanggal: string; // YYYY-MM-DD
  berat: number;
  status: StatusSawit;
}

// Bulan Indonesia (untuk konversi angka -> nama)
export const BULAN_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

// Opsi dropdown (mulai dengan "Semua")
export const BULAN_ID_OPTIONS = ["Semua", ...BULAN_ID];

function getMonthNameFromTanggal(tanggal: string): string {
  const [, mm] = tanggal.split("-");
  const idx = Math.max(0, parseInt(mm, 10) - 1);
  return BULAN_ID[idx] ?? "";
}

function getYearFromTanggal(tanggal: string): number {
  const [yyyy] = tanggal.split("-");
  return parseInt(yyyy, 10);
}

// ================== Store ==================
interface SawitStore {
  data: SawitData[];
  filteredData: SawitData[];
  selectedMonth: string; // "Semua" | "Januari" | ...
  selectedYear: number;  // contoh: 2025

  setData: (data: SawitData[]) => void;
  setSelectedMonth: (month: string) => void;
  setSelectedYear: (year: number) => void;
  applyFilter: () => void;
}

export const useSawitStore = create<SawitStore>((set, get) => ({
  data: [],
  filteredData: [],
  selectedMonth: "Semua",
  selectedYear: new Date().getFullYear(),

  setData: (data) => {
    set({ data });
    get().applyFilter();
  },

  setSelectedMonth: (month) => {
    set({ selectedMonth: month });
    get().applyFilter();
  },

  setSelectedYear: (year) => {
    set({ selectedYear: year });
    get().applyFilter();
  },

  applyFilter: () => {
    const { data, selectedMonth, selectedYear } = get();

    const filtered = data.filter((item) => {
      const monthName = getMonthNameFromTanggal(item.tanggal);
      const year = getYearFromTanggal(item.tanggal);

      const matchMonth = selectedMonth === "Semua" || monthName === selectedMonth;
      const matchYear = year === selectedYear;

      return matchMonth && matchYear;
    });

    set({ filteredData: filtered });
  },
}));

import { useSawitStore, BULAN_ID_OPTIONS} from "../stores/SawitStore";
import type { SawitData } from "../stores/SawitStore";

export default function FilterControls() {
  const {
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    data,
  } = useSawitStore();

  // Tahun dari data (descending). Fallback: 5 tahun terakhir.
  const yearsFromData = Array.from(
    new Set<number>(
      data.map((d: SawitData) => parseInt(d.tanggal.split("-")[0], 10))
    )
  ).sort((a, b) => b - a);

  const currentYear = new Date().getFullYear();
  const fallbackYears = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const years = yearsFromData.length ? yearsFromData : fallbackYears;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      {/* Bulan */}
      <select
        className="select select-bordered"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        {BULAN_ID_OPTIONS.map((bln) => (
          <option key={bln} value={bln}>
            {bln}
          </option>
        ))}
      </select>

      {/* Tahun */}
      <select
        className="select select-bordered"
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}

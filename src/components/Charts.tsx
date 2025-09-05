import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { SawitData, StatusSawit } from "../stores/SawitStore";
import { useSawitStore, BULAN_ID } from "../stores/SawitStore";

// ================== Utils ==================
// Ambil tahun dari tanggal format YYYY-MM-DD
function getYearFromTanggal(tanggal: string): number {
  const [yyyy] = tanggal.split("-");
  return parseInt(yyyy, 10);
}
const COLORS = ["#4CAF50", "#FFC107", "#F44336", "#9C27B0"];

type DistribusiPerBulan = {
  bulan: string;
  tahun: string;
} & Record<StatusSawit, number>;

type DistribusiPerBulanChart = DistribusiPerBulan & {
  label: string;
  bulanIndex: number;
};

type TrenBerat = {
  label: string; // "Januari 2025", dst.
  rataRataBerat: number;
  bulanIndex: number; // untuk sorting
  tahun: number;
};

function parseYM(tanggal: string) {
  const [yyyy, mm] = tanggal.split("-");
  const tahun = parseInt(yyyy, 10);
  const bulanIndex = parseInt(mm, 10) - 1; // 0..11
  const bulan = BULAN_ID[bulanIndex] ?? "";
  const label = `${bulan} ${tahun}`;
  return { tahun, bulanIndex, bulan, label };
}

// ================== Charts ==================
// Histogram distribusi berat sawit
import {
  BarChart as ReBarChart,
  Bar as ReBar,
  ResponsiveContainer as ReResponsiveContainer,
  XAxis as ReXAxis,
  YAxis as ReYAxis,
  Tooltip as ReTooltip,
  CartesianGrid as ReCartesianGrid,
} from "recharts";

export function HistogramBeratSawit() {
  const { filteredData } = useSawitStore();
  // Bins: 0-5, 5-10, dst.
  const bins = Array.from({ length: 6 }, (_, i) => ({
    range: `${i * 5}-${(i + 1) * 5} kg`,
    count: 0,
  }));
  filteredData.forEach((d) => {
    const idx = Math.min(Math.floor(d.berat / 5), bins.length - 1);
    bins[idx].count += 1;
  });
  return (
  <div className="p-6 bg-base-100 shadow-2xl rounded-xl w-full overflow-hidden flex flex-col justify-center items-center min-h-[340px]">
      <h2 className="text-xl font-bold text-center text-primary mb-4">
        Distribusi Berat Sawit
      </h2>
  <ReResponsiveContainer width="100%" height={240}>
        <ReBarChart
          data={bins}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
          <ReCartesianGrid strokeDasharray="3 3" />
          <ReXAxis dataKey="range" />
          <ReYAxis allowDecimals={false} />
          <ReTooltip />
          <ReBar dataKey="count" fill="#6366F1" radius={[8, 8, 0, 0]} />
        </ReBarChart>
      </ReResponsiveContainer>
    </div>
  );
}

// Bar rata-rata berat per status
export function RataRataBeratPerStatus() {
  const { filteredData } = useSawitStore();
  const statusList = ["Matang", "Belum Matang", "Terlalu Matang", "Berjamur"];
  const data = statusList.map((status) => {
    const arr = filteredData.filter((d) => d.status === status);
    const avg = arr.length
      ? arr.reduce((a, b) => a + b.berat, 0) / arr.length
      : 0;
    return { status, rata: Number(avg.toFixed(2)) };
  });
  return (
  <div className="p-6 bg-base-100 shadow-2xl rounded-xl w-full overflow-hidden min-h-[340px]">
      <h2 className="text-xl font-bold text-center text-primary mb-4">
        Rata-rata Berat per Status
      </h2>
  <ReResponsiveContainer width="100%" height={240}>
        <ReBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
          <ReCartesianGrid strokeDasharray="3 3" />
          <ReXAxis dataKey="status" />
          <ReYAxis />
          <ReTooltip />
          <ReBar dataKey="rata" fill="#10B981" radius={[8, 8, 0, 0]} />
        </ReBarChart>
      </ReResponsiveContainer>
    </div>
  );
}

// Donut persentase status sawit
import { PieChart as RePieChart, Pie as RePie, Cell as ReCell } from "recharts";
export function PersentaseStatusSawit() {
  const { filteredData } = useSawitStore();
  const statusList = ["Matang", "Belum Matang", "Terlalu Matang", "Berjamur"];
  const total = filteredData.length;
  const data = statusList.map((status) => ({
    name: status,
    value: filteredData.filter((d) => d.status === status).length,
  }));
  const COLORS_DONUT = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];
  return (
  <div className="p-6 bg-base-100 shadow-2xl rounded-xl w-full overflow-hidden min-h-[340px]">
      <h2 className="text-xl font-bold text-center text-primary mb-4">
        Persentase Status Sawit
      </h2>
  <ReResponsiveContainer width="100%" height={270}>
        <RePieChart>
          <RePie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
            }
            isAnimationActive={true}
          >
            {data.map((_, index) => (
              <ReCell
                key={`cell-${index}`}
                fill={COLORS_DONUT[index % COLORS_DONUT.length]}
              />
            ))}
          </RePie>
        </RePieChart>
      </ReResponsiveContainer>
      <div className="mt-2 text-center text-xs text-gray-500">
        Total: {total} data
      </div>
    </div>
  );
}
export function DistribusiSawitPerBulan() {
  const { filteredData, setData } = useSawitStore();
  const [chartData, setChartData] = useState<DistribusiPerBulanChart[]>([]);
  const [tahun, setTahun] = useState<number | null>(null);
  const [kategori, setKategori] = useState<string>("Semua");

  // Fetch data sekali saat komponen mount
  useEffect(() => {
    fetch("/json/dummysawit.json")
      .then((res) => res.json())
      .then((data: SawitData[]) => setData(data))
      .catch((err) => console.error("Gagal load JSON:", err));
  }, []);

  // Ambil daftar tahun unik dari data
  const tahunOptions = Array.from(
    new Set(filteredData.map((d) => getYearFromTanggal(d.tanggal)))
  ).sort((a, b) => a - b);
  // Ambil daftar kategori unik dari data
  const kategoriOptions = [
    "Semua",
    "Matang",
    "Belum Matang",
    "Terlalu Matang",
    "Berjamur",
  ];

  // Set default tahun saat data tersedia
  useEffect(() => {
    if (tahunOptions.length > 0 && tahun === null) {
      setTahun(tahunOptions[tahunOptions.length - 1]); // default ke tahun terbaru
    }
  }, [tahunOptions, tahun]);

  // Proses grouping berdasarkan filteredData, tahun, dan kategori
  useEffect(() => {
    const grouped: Record<string, DistribusiPerBulanChart> = {};
    filteredData.forEach((d) => {
      const { tahun: thn, bulanIndex, bulan, label } = parseYM(d.tanggal);
      if (tahun !== null && thn !== tahun) return;
      if (kategori !== "Semua" && d.status !== kategori) return;
      const key = `${thn}-${String(bulanIndex + 1).padStart(2, "0")}`;
      if (!grouped[key]) {
        grouped[key] = {
          bulan,
          tahun: String(thn),
          bulanIndex,
          label,
          Matang: 0,
          "Belum Matang": 0,
          "Terlalu Matang": 0,
          Berjamur: 0,
        };
      }
      grouped[key][d.status] += 1;
    });
    const result = Object.keys(grouped)
      .sort()
      .map((k) => grouped[k]);
    setChartData(result);
  }, [filteredData, tahun, kategori]);

  return (
  <div className="p-6 bg-base-100 shadow-2xl rounded-xl w-full overflow-hidden flex flex-col justify-between min-h-[420px]">
      <h2 className="text-2xl font-bold text-center text-primary mb-4">
        Distribusi Sawit per Bulan
      </h2>
      <div className="flex gap-4 mb-4 justify-end">
        <select
          className="select"
          value={tahun ?? ""}
          onChange={(e) => setTahun(Number(e.target.value))}
        >
          {tahunOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          className="select"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
        >
          {kategoriOptions.map((kat) => (
            <option key={kat} value={kat}>
              {kat}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 flex items-center justify-center">
  <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Matang" stackId="a" fill={COLORS[0]} />
            <Bar dataKey="Belum Matang" stackId="a" fill={COLORS[1]} />
            <Bar dataKey="Terlalu Matang" stackId="a" fill={COLORS[2]} />
            <Bar dataKey="Berjamur" stackId="a" fill={COLORS[3]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TrenBeratSawit() {
  const { filteredData } = useSawitStore();
  const [chartData, setChartData] = useState<TrenBerat[]>([]);
  const [tahun, setTahun] = useState<number | null>(null);

  // Ambil daftar tahun unik dari data
  const tahunOptions = Array.from(
    new Set(filteredData.map((d) => getYearFromTanggal(d.tanggal)))
  ).sort((a, b) => a - b);

  // Set default tahun saat data tersedia
  useEffect(() => {
    if (tahunOptions.length > 0 && tahun === null) {
      setTahun(tahunOptions[tahunOptions.length - 1]); // default ke tahun terbaru
    }
  }, [tahunOptions, tahun]);

  useEffect(() => {
    const grouped: Record<
      string,
      {
        total: number;
        count: number;
        label: string;
        bulanIndex: number;
        tahun: number;
      }
    > = {};
    filteredData.forEach((d) => {
      const { tahun: thn, bulanIndex, label } = parseYM(d.tanggal);
      if (tahun !== null && thn !== tahun) return;
      const key = `${thn}-${String(bulanIndex + 1).padStart(2, "0")}`;
      if (!grouped[key]) {
        grouped[key] = { total: 0, count: 0, label, bulanIndex, tahun: thn };
      }
      grouped[key].total += d.berat;
      grouped[key].count += 1;
    });
    const result: TrenBerat[] = Object.keys(grouped)
      .sort()
      .map((k) => {
        const g = grouped[k];
        return {
          label: g.label,
          bulanIndex: g.bulanIndex,
          tahun: g.tahun,
          rataRataBerat: Number((g.total / g.count).toFixed(2)),
        };
      });
    setChartData(result);
  }, [filteredData, tahun]);

  return (
  <div className="p-6 bg-base-100 shadow-2xl rounded-xl w-full overflow-hidden flex flex-col justify-between min-h-[340px]">
      <h2 className="text-2xl font-bold text-center text-primary mb-4">
        Tren Rata-Rata Berat Sawit
      </h2>
      <div className="flex gap-4 mb-4 justify-end">
        <select
          className="select"
          value={tahun ?? ""}
          onChange={(e) => setTahun(Number(e.target.value))}
        >
          {tahunOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 flex items-center justify-center">
  <ResponsiveContainer width="100%" height={240}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              name="Rata Rata Berat"
              type="monotone"
              dataKey="rataRataBerat"
              stroke="#2196F3"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function SawitTerberatTeringan() {
  const { filteredData } = useSawitStore();
  const [maxData, setMaxData] = useState<SawitData | null>(null);
  const [minData, setMinData] = useState<SawitData | null>(null);

  useEffect(() => {
    if (filteredData.length > 0) {
      const max = filteredData.reduce((a, b) => (a.berat > b.berat ? a : b));
      const min = filteredData.reduce((a, b) => (a.berat < b.berat ? a : b));
      setMaxData(max);
      setMinData(min);
    } else {
      setMaxData(null);
      setMinData(null);
    }
  }, [filteredData]);

  return (
  <div className="p-6 bg-base-100 shadow-2xl rounded-xl w-full overflow-hidden min-h-[340px]">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">
        Sawit Terberat & Teringan
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full justify-center items-center">
        {maxData && (
          <div className="flex flex-col items-center bg-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <ArrowUp className="text-green-600 w-10 h-10 mb-2" />
            <p className="font-extrabold text-4xl md:text-2xl text-green-700">
              {maxData.berat.toFixed(2)} gram
            </p>
            <p className="mt-1 text-gray-700 font-medium">Terberat</p>
            <p className="text-xs italic text-gray-500 mt-1">
              {maxData.tanggal}
            </p>
          </div>
        )}
        {minData && (
          <div className="flex flex-col items-center bg-red-100 p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <ArrowDown className="text-red-600 w-10 h-10 mb-2" />
            <p className="font-extrabold text-4xl md:text-2xl text-red-700">
              {minData.berat.toFixed(2)} gram
            </p>
            <p className="mt-1 text-gray-700 font-medium">Teringan</p>
            <p className="text-xs italic text-gray-500 mt-1">
              {minData.tanggal}
            </p>
          </div>
        )}
        {!maxData && !minData && (
          <div className="col-span-2 text-center text-gray-500">
            Tidak ada data pada filter ini
          </div>
        )}
      </div>
    </div>
  );
}

export function StatusSawitKeseluruhan() {
  const { filteredData } = useSawitStore();
  const [chartData, setChartData] = useState<
    { name: StatusSawit; value: number }[]
  >([]);

  useEffect(() => {
    const grouped: Record<StatusSawit, number> = {
      Matang: 0,
      "Belum Matang": 0,
      "Terlalu Matang": 0,
      Berjamur: 0,
    };

    filteredData.forEach((d) => {
      grouped[d.status] += 1;
    });

    const result = (Object.keys(grouped) as StatusSawit[]).map((key) => ({
      name: key,
      value: grouped[key],
    }));

    setChartData(result);
  }, [filteredData]);

  return (
  <div className="p-6 bg-base-100 shadow-2xl rounded-xl w-full overflow-hidden min-h-[340px]">
      <h2 className="text-2xl font-bold text-center text-primary">
        Status Sawit Keseluruhan
      </h2>
  <ResponsiveContainer width="100%" height={370}>
    <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        outerRadius={90}
        label
      >
        {chartData.map((_, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>
      <Tooltip />
      <Legend wrapperStyle={{ marginTop: 32 }} />
    </PieChart>
  </ResponsiveContainer>
    </div>
  );
}

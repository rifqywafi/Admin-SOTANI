import React, { useEffect, useState } from "react";
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
const COLORS = ["#4CAF50", "#FFC107", "#F44336", "#9C27B0"];

type DistribusiPerBulan = {
  bulan: string;
  tahun: string;
} & Record<StatusSawit, number>;

type DistribusiPerBulanChart = DistribusiPerBulan & { label: string; bulanIndex: number };

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
export function DistribusiSawitPerBulan() {
  const { filteredData, setData } = useSawitStore();
  const [chartData, setChartData] = useState<DistribusiPerBulanChart[]>([]);

  // Fetch data sekali saat komponen mount
useEffect(() => {
  fetch("/json/dummysawit.json")
    .then((res) => res.json())
    .then((data: SawitData[]) => setData(data))
    .catch((err) => console.error("Gagal load JSON:", err));
}, []); // dependency kosong -> hanya jalan sekali

// Proses grouping berdasarkan filteredData
useEffect(() => {
  const grouped: Record<string, DistribusiPerBulanChart> = {};

  filteredData.forEach((d) => {
    const { tahun, bulanIndex, bulan, label } = parseYM(d.tanggal);
    const key = `${tahun}-${String(bulanIndex + 1).padStart(2, "0")}`;

    if (!grouped[key]) {
      grouped[key] = {
        bulan,
        tahun: String(tahun),
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
    .sort() // sort berdasar YYYY-MM
    .map((k) => grouped[k]);

  setChartData(result);
}, [filteredData]);

  return (
    <div className="p-6 bg-base-100 shadow-lg rounded-2xl w-full h-[420px]">
      <h2 className="text-2xl font-bold text-center text-primary mb-4">
        Distribusi Sawit per Bulan
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 85 }}>
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
  );
}

export function TrenBeratSawit() {
  const { filteredData } = useSawitStore();
  const [chartData, setChartData] = useState<TrenBerat[]>([]);

  useEffect(() => {
    const grouped: Record<string, { total: number; count: number; label: string; bulanIndex: number; tahun: number }> = {};

    filteredData.forEach((d) => {
      const { tahun, bulanIndex, label } = parseYM(d.tanggal);
      const key = `${tahun}-${String(bulanIndex + 1).padStart(2, "0")}`;

      if (!grouped[key]) {
        grouped[key] = { total: 0, count: 0, label, bulanIndex, tahun };
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
  }, [filteredData]);

  return (
    <div className="p-6 bg-base-100 shadow-lg rounded-2xl w-full h-[420px]">
      <h2 className="text-2xl font-bold text-center text-primary mb-4">
        Tren Rata-Rata Berat Sawit
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 85 }}>
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
    <div className="p-6 bg-base-100 shadow-lg rounded-2xl w-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">
        Sawit Terberat & Teringan
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {maxData && (
          <div className="flex flex-col items-center bg-green-100 p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <ArrowUp className="text-green-600 w-10 h-10 mb-2" />
            <p className="font-extrabold text-4xl text-green-700">
              {maxData.berat.toFixed(2)} kg
            </p>
            <p className="mt-1 text-gray-700 font-medium">Terberat</p>
            <p className="text-xs italic text-gray-500 mt-1">{maxData.tanggal}</p>
          </div>
        )}
        {minData && (
          <div className="flex flex-col items-center bg-red-100 p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <ArrowDown className="text-red-600 w-10 h-10 mb-2" />
            <p className="font-extrabold text-4xl text-red-700">
              {minData.berat.toFixed(2)} kg
            </p>
            <p className="mt-1 text-gray-700 font-medium">Teringan</p>
            <p className="text-xs italic text-gray-500 mt-1">{minData.tanggal}</p>
          </div>
        )}
        {!maxData && !minData && (
          <div className="col-span-2 text-center text-gray-500">Tidak ada data pada filter ini</div>
        )}
      </div>
    </div>
  );
}

export function StatusSawitKeseluruhan() {
  const { filteredData } = useSawitStore();
  const [chartData, setChartData] = useState<{ name: StatusSawit; value: number }[]>([]);

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
    <div className="p-6 bg-base-100 shadow-lg rounded-2xl h-[420px] w-full">
      <h2 className="text-2xl font-bold text-center text-primary">
        Status Sawit Keseluruhan
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 85 }}>
          <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={120} label>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

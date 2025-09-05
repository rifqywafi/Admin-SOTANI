import {
  DistribusiSawitPerBulan,
  TrenBeratSawit,
  SawitTerberatTeringan,
  StatusSawitKeseluruhan,
  HistogramBeratSawit,
  RataRataBeratPerStatus,
  PersentaseStatusSawit,
} from "../components/Charts";

export default function Dashboard (){
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-green-50 py-6 px-2 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 auto-rows-[420px]">
        {/* Row 1: Distribusi Sawit Per Bulan (span 2 col), Status Sawit Keseluruhan */}
  <div className="md:col-span-2 md:row-span-1 col-span-1 row-span-1 h-full min-h-[340px]">
          <DistribusiSawitPerBulan />
        </div>
  <div className="h-full flex flex-col justify-between min-h-[340px]">
          <StatusSawitKeseluruhan />
        </div>

        {/* Row 2: Tren Berat Sawit & Persentase Status Sawit */}
  <div className="md:col-span-2 col-span-1 min-h-[340px]">
          <TrenBeratSawit />
        </div>
  <div className="md:col-span-1 col-span-1 min-h-[340px]">
          <PersentaseStatusSawit />
        </div>

        {/* Baris berikutnya: Chart berat & rata-rata */}
        <div className="md:col-span-1 col-span-1 min-h-[340px]">
          <SawitTerberatTeringan />
        </div>
        <div className="md:col-span-1 col-span-1 min-h-[340px]">
          <HistogramBeratSawit />
        </div>
        <div className="md:col-span-1 col-span-1 min-h-[340px]">
          <RataRataBeratPerStatus />
        </div>
      </div>
    </div>
  );
};
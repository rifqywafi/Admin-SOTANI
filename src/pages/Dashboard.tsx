import {
  DistribusiSawitPerBulan,
  TrenBeratSawit,
  SawitTerberatTeringan,
  StatusSawitKeseluruhan,
} from "../components/Charts";

export default function Dashboard() {
  return (
    <div className="space-y-10 p-6">
      <DistribusiSawitPerBulan />
      <TrenBeratSawit />
      <SawitTerberatTeringan />
      <StatusSawitKeseluruhan />
    </div>
  );
}

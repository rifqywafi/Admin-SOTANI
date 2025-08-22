import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar tetap tampil */}
      <Sidebar />

      {/* Halaman dinamis sesuai child route */}
      <main className="flex-1 p-6 bg-base-200">
        <Outlet />
      </main>
    </div>
  );
}
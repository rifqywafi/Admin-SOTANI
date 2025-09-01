// src/pages/SawitPage.tsx
import { useEffect, useState } from "react";
import TableWrapper from "../components/TableWrapper";
import Pagination from "../components/Pagination";
import { useSawitStore } from "../stores/SawitStore";
import type { SawitData } from "../stores/SawitStore";

export default function SawitPage() {
  const { filteredData, setData } = useSawitStore();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // jumlah data per halaman

  // Ambil data dari public/json/summysawit.json
  useEffect(() => {
    fetch("/json/dummysawit.json")
      .then((res) => res.json())
      .then((data: SawitData[]) => setData(data))
      .catch((err) => console.error("Gagal load JSON:", err));
  }, [setData]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Data Sawit</h1>

      <TableWrapper
        headers={["ID", "Tanggal", "Status", "Berat (kg)"]}
        emptyMessage="Belum ada data sawit"
      >
        {paginatedData.map((item) => (
          <tr key={item.id} className="hover">
            <td className="px-3 py-2">{item.id}</td>
            <td className="px-3 py-2">
              {new Date(item.tanggal).toLocaleDateString("id-ID")}
            </td>
            <td className="px-3 py-2">{item.status}</td>
            <td className="px-3 py-2 text-right">{item.berat.toFixed(2)}</td>
          </tr>
        ))}
      </TableWrapper>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

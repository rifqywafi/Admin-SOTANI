// filepath: d:\admin-sawit\src\pages\Sawit.tsx
import { useEffect, useState } from "react";
import TableWrapper from "../components/TableWrapper";
import Pagination from "../components/Pagination";
import { useSawitStore } from "../stores/SawitStore";
import type { SawitData } from "../stores/SawitStore";
import { generatePDF } from "../utils/pdfUtils";
import { ArrowDownToLine, Printer, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";

export default function SawitPage() {
  const { filteredData, setData } = useSawitStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Ambil data dari public/json/dummysawit.json
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

  const handlePrintAll = () => {
    generatePDF(filteredData);
  };

  const handleExportExcel = () => {
    // Data yang akan diexport (seluruh filteredData)
    const dataToExport = filteredData.map((item) => ({
      ID: item.id,
      Tanggal: new Date(item.tanggal).toLocaleDateString("id-ID"),
      Status: item.status,
      "Berat (gram)": item.berat,
      Kontainer: item.kontainer,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Sawit");

    XLSX.writeFile(workbook, "data-sawit.xlsx");
  };

  const handlePrintTable = () => {
    const tableHtml = `
      <html>
        <head>
          <title>Print Data Sawit</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #B38F6F; padding: 8px; text-align: left; }
            th { background: #f3f3f3; }
          </style>
        </head>
        <body>
          <h2>Data Sawit</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Berat (gram)</th>
                <th>Kontainer</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData
                .map(
                  (item) => `
                <tr>
                  <td>${item.id}</td>
                  <td>${new Date(item.tanggal).toLocaleDateString("id-ID")}</td>
                  <td>${item.status}</td>
                  <td style="text-align:right;">${item.berat.toFixed(2)}</td>
                  <td>${item.kontainer}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(tableHtml);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl text-primary font-semibold mb-4">Data Sawit</h1>
      <div className="justify-between flex flex-row items-center">
        <div className="">
          <label htmlFor="pageSize" className="font-medium">
            Tampilkan
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border select-xs rounded px-2 mx-2 py-1"
          >
            {[5, 10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          data
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrintTable}
            className="mb-4 p-2 bg-blue-400 hover:cursor-pointer text-white rounded"
          >
            <div className="flex font-semibold gap-1 px-1">
              <Printer className="w-5 h-5" />{" "}
              <p className=" font-semibold">Cetak</p>
            </div>
          </button>
          <button
            onClick={handlePrintAll}
            className="mb-4 px-2 bg-primary hover:cursor-pointer text-white rounded"
          >
            <div className="flex font-semibold gap-1 px-1">
              <ArrowDownToLine className="w-5 h-5" />{" "}
              <p className=" font-semibold">PDF</p>
            </div>
          </button>
          <button
            onClick={handleExportExcel}
            className="mb-4 px-2 bg-green-500 hover:cursor-pointer text-white rounded"
          >
            <div className="flex font-semibold gap-1 px-1">
              <FileSpreadsheet className="w-5 h-5" />{" "}
              <p className=" font-semibold">Sheet</p>
            </div>
          </button>
        </div>
      </div>
      <div>
        <TableWrapper
          headers={["ID", "Tanggal", "Status", "Berat (gram)", "Kontainer"]}
          emptyMessage="Belum ada data sawit"
        >
          {paginatedData.map((item) => (
            <tr key={item.id} className="hover">
              <td className="px-3 py-2">{item.id}</td>
              <td className="px-3 py-2">
                {new Date(item.tanggal).toLocaleDateString("id-ID")}
              </td>
              <td className="px-3 py-2">{item.status}</td>
              <td className="px-3 py-2">{item.berat.toFixed(2)}</td>
              <td className="px-3 py-2">{item.kontainer}</td>
            </tr>
          ))}
        </TableWrapper>
      </div>

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

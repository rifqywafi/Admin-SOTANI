import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { SawitData } from "../stores/SawitStore";

export const generatePDF = (data: SawitData[]) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Data Sawit", 14, 22);

  const tableColumn = ["ID", "Tanggal", "Status", "Berat (gram)", "Kontainer"];
  const tableRows = data.map(item => [
    item.id,
    new Date(item.tanggal).toLocaleDateString("id-ID"),
    item.status,
    item.berat.toFixed(2),
    item.kontainer
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
  });

  doc.save("data_sawit.pdf");
};
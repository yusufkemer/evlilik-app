import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Expense } from "./store";

export function generatePdfReport(expenses: Expense[]) {
  const doc = new jsPDF();

  const totalDebt = expenses.reduce((sum, item) => sum + item.total, 0);

  const totalPaid = expenses.reduce((sum, item) => sum + item.paid, 0);

  const totalRemaining = totalDebt - totalPaid;

  doc.setFontSize(20);
  doc.text("Evlilik Finans Raporu", 14, 20);

  doc.setFontSize(12);
  doc.text(`Toplam Borç: ${totalDebt.toLocaleString("tr-TR")} TL`, 14, 35);
  doc.text(`Toplam Ödenen: ${totalPaid.toLocaleString("tr-TR")} TL`, 14, 43);
  doc.text(`Kalan Borç: ${totalRemaining.toLocaleString("tr-TR")} TL`, 14, 51);

  autoTable(doc, {
    startY: 65,
    head: [["Masraf", "Kategori", "Toplam", "Ödenen", "Kalan"]],
    body: expenses.map((item) => [
      item.title,
      item.category,
      `${item.total.toLocaleString("tr-TR")} TL`,
      `${item.paid.toLocaleString("tr-TR")} TL`,
      `${item.remaining.toLocaleString("tr-TR")} TL`,
    ]),
  });

  doc.save("evlilik-finans-raporu.pdf");
}
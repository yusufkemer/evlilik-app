import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Expense } from "./store";

function cleanText(text: string) {
  return text
    .replaceAll("ğ", "g")
    .replaceAll("Ğ", "G")
    .replaceAll("ü", "u")
    .replaceAll("Ü", "U")
    .replaceAll("ş", "s")
    .replaceAll("Ş", "S")
    .replaceAll("ı", "i")
    .replaceAll("İ", "I")
    .replaceAll("ö", "o")
    .replaceAll("Ö", "O")
    .replaceAll("ç", "c")
    .replaceAll("Ç", "C");
}

export function generatePdfReport(expenses: Expense[]) {
  const doc = new jsPDF();

  const totalDebt = expenses.reduce((sum, item) => sum + item.total, 0);
  const totalPaid = expenses.reduce((sum, item) => sum + item.paid, 0);
  const totalRemaining = totalDebt - totalPaid;

  doc.setFontSize(20);
  doc.text(cleanText("Evlilik Finans Raporu"), 14, 20);

  doc.setFontSize(12);
  doc.text(cleanText(`Toplam Borç: ${totalDebt.toLocaleString("tr-TR")} TL`), 14, 35);
  doc.text(cleanText(`Toplam Ödenen: ${totalPaid.toLocaleString("tr-TR")} TL`), 14, 43);
  doc.text(cleanText(`Kalan Borç: ${totalRemaining.toLocaleString("tr-TR")} TL`), 14, 51);

  autoTable(doc, {
    startY: 65,
    head: [[
      cleanText("Masraf"),
      cleanText("Kategori"),
      cleanText("Toplam"),
      cleanText("Ödenen"),
      cleanText("Kalan"),
    ]],
    body: expenses.map((item) => [
      cleanText(item.title),
      cleanText(item.category),
      cleanText(`${item.total.toLocaleString("tr-TR")} TL`),
      cleanText(`${item.paid.toLocaleString("tr-TR")} TL`),
      cleanText(`${item.remaining.toLocaleString("tr-TR")} TL`),
    ]),
  });

  doc.save("evlilik-finans-raporu.pdf");
}
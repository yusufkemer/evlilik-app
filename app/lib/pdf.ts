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

  const completedExpenses = expenses.filter(
    (item) => item.remaining <= 0
  ).length;

  const biggestExpense = [...expenses].sort(
    (a, b) => b.total - a.total
  )[0];

  const categoryTotals: Record<string, number> = {};

  expenses.forEach((item) => {
    categoryTotals[item.category] =
      (categoryTotals[item.category] || 0) + item.total;
  });

  doc.setFontSize(20);
  doc.text(cleanText("EVLILIK FINANS RAPORU"), 14, 20);

  doc.setFontSize(11);
  doc.text(cleanText(`Rapor Tarihi: ${new Date().toLocaleDateString("tr-TR")}`), 14, 28);

  doc.setFontSize(14);
  doc.text(cleanText(`TOPLAM BORC: ${totalDebt.toLocaleString("tr-TR")} TL`), 14, 43);
  doc.text(cleanText(`TOPLAM ODENEN: ${totalPaid.toLocaleString("tr-TR")} TL`), 14, 53);
  doc.text(cleanText(`KALAN BORC: ${totalRemaining.toLocaleString("tr-TR")} TL`), 14, 63);
  doc.text(cleanText(`TOPLAM MASRAF SAYISI: ${expenses.length}`), 14, 73);
  doc.text(cleanText(`TAMAMLANAN MASRAF: ${completedExpenses}`), 14, 83);

  if (biggestExpense) {
    doc.text(
      cleanText(
        `EN BUYUK MASRAF: ${biggestExpense.title} - ${biggestExpense.total.toLocaleString("tr-TR")} TL`
      ),
      14,
      93
    );
  }

  doc.setDrawColor(0);
  doc.line(14, 102, 195, 102);

  autoTable(doc, {
    startY: 110,
    head: [[
      cleanText("Masraf"),
      cleanText("Kategori"),
      cleanText("Toplam"),
      cleanText("Odenen"),
      cleanText("Kalan"),
      cleanText("Son Odeme"),
    ]],
    body: expenses.map((item) => [
      cleanText(item.title),
      cleanText(item.category),
      cleanText(`${item.total.toLocaleString("tr-TR")} TL`),
      cleanText(`${item.paid.toLocaleString("tr-TR")} TL`),
      cleanText(`${item.remaining.toLocaleString("tr-TR")} TL`),
      cleanText(item.dueDate || "-"),
    ]),
  });

  let finalY = (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(16);
  doc.text(cleanText("KATEGORI TOPLAMLARI"), 14, finalY);

  autoTable(doc, {
    startY: finalY + 8,
    head: [[cleanText("Kategori"), cleanText("Toplam")]],
    body: Object.entries(categoryTotals).map(([category, total]) => [
      cleanText(category),
      cleanText(`${total.toLocaleString("tr-TR")} TL`),
    ]),
  });

  finalY = (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(16);
  doc.text(cleanText("ODEME GECMISI"), 14, finalY);

  const paymentRows: string[][] = [];

  expenses.forEach((expense) => {
    expense.paymentHistory?.forEach((payment) => {
      paymentRows.push([
        cleanText(expense.title),
        cleanText(payment.date),
        cleanText(`${payment.amount.toLocaleString("tr-TR")} TL`),
      ]);
    });
  });

  autoTable(doc, {
    startY: finalY + 8,
    head: [[cleanText("Masraf"), cleanText("Tarih"), cleanText("Odeme")]],
    body:
      paymentRows.length > 0
        ? paymentRows
        : [[cleanText("Kayit yok"), "-", "-"]],
  });

  doc.save("evlilik-finans-raporu.pdf");
}
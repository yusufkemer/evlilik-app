import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Expense } from "./store";

export function exportExpensesToExcel(expenses: Expense[]) {
  const totalDebt = expenses.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const totalPaid = expenses.reduce(
    (sum, item) => sum + item.paid,
    0
  );

  const totalRemaining = totalDebt - totalPaid;

  const summarySheet = XLSX.utils.json_to_sheet([
    {
      ToplamBorc: totalDebt,
      ToplamOdenen: totalPaid,
      KalanBorc: totalRemaining,
      ToplamMasraf: expenses.length,
    },
  ]);

  const expenseSheet = XLSX.utils.json_to_sheet(
    expenses.map((item) => ({
      Masraf: item.title,
      Kategori: item.category,
      Toplam: item.total,
      Odenen: item.paid,
      Kalan: item.remaining,
      SonOdeme: item.dueDate || "",
    }))
  );

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    summarySheet,
    "Ozet"
  );

  XLSX.utils.book_append_sheet(
    workbook,
    expenseSheet,
    "Masraflar"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const fileData = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  saveAs(
    fileData,
    `evlilik-raporu-${new Date()
      .toLocaleDateString("tr-TR")
      .replaceAll(".", "-")}.xlsx`
  );
}
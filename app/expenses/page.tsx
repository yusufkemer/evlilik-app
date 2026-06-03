"use client";

import { useEffect, useState } from "react";
import AuthGuard from "../components/AuthGuard";
import Sidebar from "../components/Sidebar";
import {
  Expense,
  getExpenses,
  addExpenseToDB,
  deleteExpenseFromDB,
  updateExpenseInDB
} from "../lib/store";

export default function ExpensesPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Mobilya");
  const [total, setTotal] = useState("");
  const [paid, setPaid] = useState("");
  const [installment, setInstallment] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");

  async function loadExpenses() {
    const data = await getExpenses();
    setExpenses(data);
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  async function addExpense() {
    if (!title || !total || !paid) {
      alert("Masraf adı, toplam tutar ve ödenen tutar zorunlu.");
      return;
    }

    const totalValue = Number(total);
    const paidValue = Number(paid);
    const installmentValue = Number(installment || 1);

    if (paidValue > totalValue) {
      alert("Ödenen tutar toplam tutardan büyük olamaz.");
      return;
    }

    await addExpenseToDB({
      title,
      category,
      total: totalValue,
      paid: paidValue,
      remaining: totalValue - paidValue,
      installment: installmentValue,
      monthlyPayment: totalValue / installmentValue,
      dueDate,
      note,
      paymentHistory: [
        {
          amount: paidValue,
          date: new Date().toLocaleDateString("tr-TR")
        }
      ]
    });

    await loadExpenses();

    setTitle("");
    setCategory("Mobilya");
    setTotal("");
    setPaid("");
    setInstallment("");
    setDueDate("");
    setNote("");
  }

  async function addPayment(item: Expense) {
    const payment = prompt("Ödeme miktarını gir");
    if (!payment) return;

    const paymentValue = Number(payment);
    const finalPaid = Math.min(item.paid + paymentValue, item.total);

    await updateExpenseInDB({
      ...item,
      paid: finalPaid,
      remaining: item.total - finalPaid,
      paymentHistory: [
        ...(item.paymentHistory || []),
        {
          amount: paymentValue,
          date: new Date().toLocaleDateString("tr-TR")
        }
      ]
    });

    await loadExpenses();
  }

  async function deleteExpense(id?: string) {
    if (!id) return;
    if (!confirm("Bu masrafı silmek istiyor musun?")) return;

    await deleteExpenseFromDB(id);
    await loadExpenses();
  }

  async function saveEdit() {
    if (!editingExpense) return;

    if (editingExpense.paid > editingExpense.total) {
      alert("Ödenen tutar toplam tutardan büyük olamaz.");
      return;
    }

    await updateExpenseInDB({
      ...editingExpense,
      remaining: editingExpense.total - editingExpense.paid,
      monthlyPayment:
        editingExpense.total / Number(editingExpense.installment || 1)
    });

    await loadExpenses();
    setEditingExpense(null);
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#020817] text-white overflow-x-hidden">
        <div className="flex min-h-screen">
          <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

          <section className="page-shell">
            <div className="page-inner">
              <div className="mb-8">
                <h1 className="text-4xl font-black">Masraflar</h1>

                <p className="text-slate-400 text-lg mt-2">
                  Evlilik harcamalarını yönet
                </p>
              </div>

              <div className="bg-[#08172b] border border-slate-700 rounded-2xl p-6 mb-6">
                <h3 className="text-2xl font-black mb-6">
                  Yeni Masraf Ekle
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Field label="Masraf adı">
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Masraf adı"
                      className="input-style"
                    />
                  </Field>

                  <Field label="Kategori">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="input-style"
                    >
                      <option>Mobilya</option>
                      <option>Beyaz Eşya</option>
                      <option>Elektronik</option>
                      <option>Düğün</option>
                      <option>Takı</option>
                      <option>Ev Tekstili</option>
                    </select>
                  </Field>

                  <Field label="Toplam tutar">
                    <input
                      type="number"
                      value={total}
                      onChange={(e) => setTotal(e.target.value)}
                      placeholder="Toplam tutar"
                      className="input-style"
                    />
                  </Field>

                  <Field label="Ödenen tutar">
                    <input
                      type="number"
                      value={paid}
                      onChange={(e) => setPaid(e.target.value)}
                      placeholder="Ödenen tutar"
                      className="input-style"
                    />
                  </Field>

                  <Field label="Taksit sayısı">
                    <input
                      type="number"
                      value={installment}
                      onChange={(e) => setInstallment(e.target.value)}
                      placeholder="Taksit sayısı"
                      className="input-style"
                    />
                  </Field>

                  <Field label="Son ödeme tarihi">
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="input-style"
                    />
                  </Field>
                </div>

                <div className="mt-6">
                  <label className="text-white font-semibold block mb-2">
                    Not
                  </label>

                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Not"
                    className="input-style min-h-[95px] resize-none"
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={addExpense}
                    className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-black"
                  >
                    Masrafı Kaydet
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {expenses.map((item) => {
                  const percent =
                    item.total > 0
                      ? Math.round((item.paid / item.total) * 100)
                      : 0;

                  return (
                    <div
                      key={item.id}
                      className="bg-[#08172b] border border-slate-700 rounded-2xl p-6"
                    >
                      <div className="flex flex-col xl:flex-row justify-between gap-6 mb-7">
                        <div className="flex items-start gap-5">
                          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-3xl shrink-0">
                            🧾
                          </div>

                          <div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="text-3xl font-black">
                                {item.title}
                              </h3>

                              <span className="bg-blue-600 px-3 py-1 rounded-lg font-bold">
                                {item.category}
                              </span>
                            </div>

                            <p className="text-slate-400 text-lg mt-2">
                              Son ödeme: {item.dueDate || "Belirtilmedi"}
                            </p>

                            <p className="text-yellow-400 text-lg font-bold mt-2">
                              Aylık ödeme:{" "}
                              {item.monthlyPayment.toLocaleString("tr-TR")} ₺
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 flex-wrap xl:justify-end">
                          <button
                            onClick={() => setEditingExpense(item)}
                            className="bg-yellow-500 hover:bg-yellow-600 px-5 py-3 rounded-xl font-bold"
                          >
                            Düzenle
                          </button>

                          <button
                            onClick={() => addPayment(item)}
                            className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl font-bold"
                          >
                            Ödeme Ekle
                          </button>

                          <button
                            onClick={() => deleteExpense(item.id)}
                            className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-bold"
                          >
                            Sil
                          </button>
                        </div>
                      </div>

                      <div className="mb-7">
                        <div className="flex justify-between mb-3">
                          <span className="text-slate-400 text-lg">
                            Ödeme Durumu
                          </span>

                          <span className="font-black text-lg">%{percent}</span>
                        </div>

                        <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden">
                          <div
                            className="bg-green-500 h-4 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 border border-slate-700 rounded-xl overflow-hidden bg-[#061122]">
                        <AmountCard
                          title="Toplam"
                          value={item.total}
                          color="text-white"
                        />

                        <AmountCard
                          title="Ödenen"
                          value={item.paid}
                          color="text-green-400"
                        />

                        <AmountCard
                          title="Kalan"
                          value={item.remaining}
                          color="text-red-400"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {editingExpense && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-5">
                  <div className="w-full max-w-3xl bg-[#08172b] border border-slate-700 rounded-2xl p-6">
                    <h3 className="text-3xl font-black mb-7">
                      Masraf Düzenle
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <input
                        value={editingExpense.title}
                        onChange={(e) =>
                          setEditingExpense({
                            ...editingExpense,
                            title: e.target.value
                          })
                        }
                        className="input-style"
                      />

                      <input
                        type="number"
                        value={editingExpense.total}
                        onChange={(e) =>
                          setEditingExpense({
                            ...editingExpense,
                            total: Number(e.target.value)
                          })
                        }
                        className="input-style"
                      />

                      <input
                        type="number"
                        value={editingExpense.paid}
                        onChange={(e) =>
                          setEditingExpense({
                            ...editingExpense,
                            paid: Number(e.target.value)
                          })
                        }
                        className="input-style"
                      />

                      <input
                        type="number"
                        value={editingExpense.installment}
                        onChange={(e) =>
                          setEditingExpense({
                            ...editingExpense,
                            installment: Number(e.target.value || 1)
                          })
                        }
                        className="input-style"
                      />
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={saveEdit}
                        className="bg-green-600 px-8 py-4 rounded-xl font-black"
                      >
                        Kaydet
                      </button>

                      <button
                        onClick={() => setEditingExpense(null)}
                        className="bg-red-600 px-8 py-4 rounded-xl font-black"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-white font-semibold block mb-2">
        {label}
      </label>

      {children}
    </div>
  );
}

function AmountCard({
  title,
  value,
  color
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className="p-5 border-b md:border-b-0 md:border-r last:border-r-0 border-slate-700">
      <p className="text-slate-400 text-lg">{title}</p>

      <h4 className={`text-3xl font-black mt-3 ${color}`}>
        {value.toLocaleString("tr-TR")} ₺
      </h4>
    </div>
  );
}

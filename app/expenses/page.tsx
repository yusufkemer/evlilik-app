"use client";

import { useEffect, useState } from "react";
import AuthGuard from "../components/AuthGuard";
import Sidebar from "../components/Sidebar";
import {
  Expense,
  getExpenses,
  addExpenseToDB,
  deleteExpenseFromDB,
  updateExpenseInDB,
} from "../lib/store";

type PaidBy = "Yusuf" | "Büşra";

export default function ExpensesPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [paymentExpense, setPaymentExpense] = useState<Expense | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentBy, setPaymentBy] = useState<PaidBy>("Yusuf");

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
      paymentHistory:
        paidValue > 0
          ? [
              {
                amount: paidValue,
                date: new Date().toLocaleDateString("tr-TR"),
                paidBy: "Yusuf",
              },
            ]
          : [],
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

  async function savePayment() {
    if (!paymentExpense || !paymentAmount) return;

    const paymentValue = Number(paymentAmount);

    if (paymentValue <= 0) {
      alert("Geçerli bir ödeme tutarı gir.");
      return;
    }

    const finalPaid = Math.min(
      paymentExpense.paid + paymentValue,
      paymentExpense.total
    );

    await updateExpenseInDB({
      ...paymentExpense,
      paid: finalPaid,
      remaining: paymentExpense.total - finalPaid,
      paymentHistory: [
        ...(paymentExpense.paymentHistory || []),
        {
          amount: paymentValue,
          date: new Date().toLocaleDateString("tr-TR"),
          paidBy: paymentBy,
        },
      ],
    });

    await loadExpenses();

    setPaymentExpense(null);
    setPaymentAmount("");
    setPaymentBy("Yusuf");
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
        editingExpense.total / Number(editingExpense.installment || 1),
    });

    await loadExpenses();
    setEditingExpense(null);
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#020817] text-white overflow-x-hidden">
        <div className="flex min-h-screen">
          <Sidebar
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />

          <section className="page-shell">
            <div className="page-inner">
              <div className="mb-8">
                <h1 className="text-4xl font-black">
                  Masraflar
                </h1>

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

                  <Field label="Toplam Tutar">
                    <input
                      type="number"
                      value={total}
                      onChange={(e) => setTotal(e.target.value)}
                      className="input-style"
                    />
                  </Field>

                  <Field label="Ödenen Tutar">
                    <input
                      type="number"
                      value={paid}
                      onChange={(e) => setPaid(e.target.value)}
                      className="input-style"
                    />
                  </Field>

                  <Field label="Taksit Sayısı">
                    <input
                      type="number"
                      value={installment}
                      onChange={(e) => setInstallment(e.target.value)}
                      className="input-style"
                    />
                  </Field>

                  <Field label="Son Ödeme Tarihi">
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="input-style"
                    />
                  </Field>
                </div>

                <div className="mt-6">
                  <label className="font-semibold block mb-2">
                    Not
                  </label>

                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="input-style min-h-[100px]"
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
                      ? Math.round(
                          (item.paid / item.total) * 100
                        )
                      : 0;

                  return (
                    <div
                      key={item.id}
                      className="bg-[#08172b] border border-slate-700 rounded-2xl p-6"
                    >
                      <div className="flex flex-col lg:flex-row justify-between gap-6">
                        <div>
                          <h3 className="text-3xl font-black">
                            {item.title}
                          </h3>

                          <p className="text-slate-400 mt-2">
                            {item.category}
                          </p>

                          <p className="text-slate-400 mt-1">
                            Son ödeme: {item.dueDate}
                          </p>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                          <button
                            onClick={() =>
                              setEditingExpense(item)
                            }
                            className="bg-yellow-500 px-5 py-3 rounded-xl font-bold"
                          >
                            Düzenle
                          </button>

                          <button
                            onClick={() =>
                              setPaymentExpense(item)
                            }
                            className="bg-green-600 px-5 py-3 rounded-xl font-bold"
                          >
                            Ödeme Ekle
                          </button>

                          <button
                            onClick={() =>
                              deleteExpense(item.id)
                            }
                            className="bg-red-600 px-5 py-3 rounded-xl font-bold"
                          >
                            Sil
                          </button>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="flex justify-between mb-2">
                          <span>Ödeme Durumu</span>
                          <span>%{percent}</span>
                        </div>

                        <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden">
                          <div
                            className="bg-green-500 h-4"
                            style={{
                              width: `${percent}%`,
                            }}
                          />
                        </div>
                      </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 border border-slate-700 rounded-xl overflow-hidden bg-[#061122] mt-6">
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

                      {item.paymentHistory &&
                        item.paymentHistory.length > 0 && (
                          <div className="mt-6 bg-[#061122] border border-slate-700 rounded-xl p-5">
                            <h4 className="text-xl font-black mb-4">
                              Ödeme Geçmişi
                            </h4>

                            <div className="space-y-3">
                              {item.paymentHistory.map(
                                (payment, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between gap-4 border-b border-slate-800 pb-3 last:border-b-0 last:pb-0"
                                  >
                                    <div>
                                      <p className="text-white font-bold">
                                        {payment.paidBy || "Yusuf"}
                                      </p>

                                      <p className="text-slate-400 text-sm">
                                        {payment.date}
                                      </p>
                                    </div>

                                    <span className="text-green-400 font-bold">
                                      +{" "}
                                      {payment.amount.toLocaleString(
                                        "tr-TR"
                                      )}{" "}
                                      ₺
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>

              {paymentExpense && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-5">
                  <div className="w-full max-w-md bg-[#08172b] border border-slate-700 rounded-2xl p-6">
                    <h3 className="text-3xl font-black mb-3">
                      Ödeme Ekle
                    </h3>

                    <p className="text-slate-400 mb-6">
                      {paymentExpense.title}
                    </p>

                    <label className="text-white font-semibold block mb-2">
                      Ödeme yapan
                    </label>

                    <select
                      value={paymentBy}
                      onChange={(e) =>
                        setPaymentBy(e.target.value as PaidBy)
                      }
                      className="input-style mb-4"
                    >
                      <option value="Yusuf">Yusuf</option>
                      <option value="Büşra">Büşra</option>
                    </select>

                    <label className="text-white font-semibold block mb-2">
                      Ödeme tutarı
                    </label>

                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) =>
                        setPaymentAmount(e.target.value)
                      }
                      placeholder="Ödeme tutarı"
                      className="input-style"
                    />

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={savePayment}
                        className="bg-green-600 px-8 py-4 rounded-xl font-black"
                      >
                        Kaydet
                      </button>

                      <button
                        onClick={() => {
                          setPaymentExpense(null);
                          setPaymentAmount("");
                          setPaymentBy("Yusuf");
                        }}
                        className="bg-red-600 px-8 py-4 rounded-xl font-black"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
                            title: e.target.value,
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
                            total: Number(e.target.value),
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
                            paid: Number(e.target.value),
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
                            installment: Number(e.target.value || 1),
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
  children,
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
  color,
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
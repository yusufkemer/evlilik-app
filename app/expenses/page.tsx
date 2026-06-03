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
          date: new Date().toLocaleDateString("tr-TR"),
        },
      ],
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
          date: new Date().toLocaleDateString("tr-TR"),
        },
      ],
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
        editingExpense.total / Number(editingExpense.installment || 1),
    });

    await loadExpenses();
    setEditingExpense(null);
  }

  return (
    <AuthGuard>
      <main className="app-main">
        <div className="app-layout">
          <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

          <section className="page-area">
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
              ☰
            </button>

            <div className="page-container">
              <div className="page-header">
                <div>
                  <h1 className="page-title">Masraflar</h1>
                  <p className="page-subtitle">Evlilik harcamalarını yönet</p>
                </div>
              </div>

              <div className="panel" style={{ marginBottom: 28 }}>
                <h3 className="panel-title">Yeni Masraf Ekle</h3>

                <div className="form-grid">
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

                <div style={{ marginTop: 24 }}>
                  <label className="field-label">Not</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Not"
                    className="textarea-style"
                  />
                </div>

                <div className="action-row">
                  <button onClick={addExpense} className="primary-btn">
                    Masrafı Kaydet
                  </button>
                </div>
              </div>

              <div className="list-space">
                {expenses.map((item) => {
                  const percent =
                    item.total > 0
                      ? Math.round((item.paid / item.total) * 100)
                      : 0;

                  return (
                    <div key={item.id} className="panel">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 24,
                          flexWrap: "wrap",
                          marginBottom: 24,
                        }}
                      >
                        <div className="item-left">
                          <div className="item-icon">🧾</div>

                          <div>
                            <div className="item-title-row">
                              <h3 className="item-title">{item.title}</h3>
                              <span className="badge">{item.category}</span>
                            </div>

                            <p className="item-meta">
                              Son ödeme: {item.dueDate || "Belirtilmedi"}
                            </p>

                            <p className="text-yellow" style={{ fontWeight: 900, marginTop: 8 }}>
                              Aylık ödeme: {item.monthlyPayment.toLocaleString("tr-TR")} ₺
                            </p>
                          </div>
                        </div>

                        <div className="button-group">
                          <button
                            onClick={() => setEditingExpense(item)}
                            className="warning-btn"
                          >
                            Düzenle
                          </button>

                          <button
                            onClick={() => addPayment(item)}
                            className="success-btn"
                          >
                            Ödeme Ekle
                          </button>

                          <button
                            onClick={() => deleteExpense(item.id)}
                            className="danger-btn"
                          >
                            Sil
                          </button>
                        </div>
                      </div>

                      <div style={{ marginBottom: 24 }}>
                        <div className="progress-head">
                          <span className="muted">Ödeme Durumu</span>
                          <strong>%{percent}</strong>
                        </div>

                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="amount-grid">
                        <AmountCard title="Toplam" value={item.total} color="" />
                        <AmountCard title="Ödenen" value={item.paid} color="text-green" />
                        <AmountCard title="Kalan" value={item.remaining} color="text-red" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {editingExpense && (
                <div className="modal-backdrop">
                  <div className="modal-card">
                    <h3 className="panel-title">Masraf Düzenle</h3>

                    <div className="form-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
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

                    <div className="button-group" style={{ marginTop: 24 }}>
                      <button onClick={saveEdit} className="success-btn">
                        Kaydet
                      </button>

                      <button
                        onClick={() => setEditingExpense(null)}
                        className="danger-btn"
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
      <label className="field-label">{label}</label>
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
    <div className="amount-cell">
      <p className="muted">{title}</p>

      <h4 className={`money-lg ${color}`} style={{ marginTop: 8 }}>
        {value.toLocaleString("tr-TR")} ₺
      </h4>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import AuthGuard from "../components/AuthGuard";
import Sidebar from "../components/Sidebar";
import { Expense, getExpenses } from "../lib/store";

export default function PaymentsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await getExpenses();
      setExpenses(data);
    }

    loadData();
  }, []);

  const payments = useMemo(() => {
    const allPayments: {
      title: string;
      amount: number;
      date: string;
      category: string;
    }[] = [];

    expenses.forEach((expense) => {
      expense.paymentHistory?.forEach((payment) => {
        allPayments.push({
          title: expense.title,
          amount: payment.amount,
          date: payment.date,
          category: expense.category,
        });
      });
    });

    return allPayments.reverse();
  }, [expenses]);

  const totalPayments = payments.reduce((sum, item) => sum + item.amount, 0);

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
                  <h1 className="page-title">Ödemeler</h1>
                  <p className="page-subtitle">Yapılan tüm ödeme geçmişi</p>
                </div>
              </div>

              <div className="panel" style={{ marginBottom: 28, display: "flex", gap: 24, alignItems: "center" }}>
                <div className="stat-icon" style={{ background: "rgba(34,197,94,0.18)" }}>
                  💸
                </div>

                <div>
                  <p className="stat-name">Toplam Yapılan Ödeme</p>
                  <h2 className="stat-value text-green">
                    {totalPayments.toLocaleString("tr-TR")} ₺
                  </h2>
                </div>
              </div>

              <div className="list-space">
                {payments.map((payment, index) => (
                  <div key={index} className="item-row">
                    <div className="item-left">
                      <div className="item-icon" style={{ background: "rgba(34,197,94,0.25)" }}>
                        💰
                      </div>

                      <div>
                        <div className="item-title-row">
                          <h3 className="item-title">{payment.title}</h3>
                          <span className="badge">{payment.category}</span>
                        </div>

                        <p className="item-meta">
                          İşlem tarihi: {payment.date}
                        </p>
                      </div>
                    </div>

                    <div className="item-right">
                      <p className="money-lg text-green">
                        + {payment.amount.toLocaleString("tr-TR")} ₺
                      </p>

                      <p className="muted" style={{ marginTop: 8 }}>
                        ödeme kaydı
                      </p>
                    </div>
                  </div>
                ))}

                {payments.length === 0 && (
                  <div className="panel">
                    <p className="muted">Henüz ödeme geçmişi bulunmuyor.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}

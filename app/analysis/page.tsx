"use client";

import { useEffect, useMemo, useState } from "react";
import AuthGuard from "../components/AuthGuard";
import Sidebar from "../components/Sidebar";
import { Expense, getExpenses } from "../lib/store";

export default function AnalysisPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await getExpenses();
      setExpenses(data);
    }

    loadData();
  }, []);

  const totalDebt = useMemo(
    () => expenses.reduce((sum, item) => sum + item.total, 0),
    [expenses]
  );

  const totalPaid = useMemo(
    () => expenses.reduce((sum, item) => sum + item.paid, 0),
    [expenses]
  );

  const totalRemaining = totalDebt - totalPaid;
  const percent = totalDebt > 0 ? Math.round((totalPaid / totalDebt) * 100) : 0;

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    expenses.forEach((item) => {
      totals[item.category] = (totals[item.category] || 0) + item.total;
    });

    return totals;
  }, [expenses]);

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
                  <h1 className="page-title">Analiz</h1>
                  <p className="page-subtitle">Finansal analiz ve kategori dağılımı</p>
                </div>
              </div>

              <div className="grid-3">
                <StatCard title="Toplam Borç" value={`${totalDebt.toLocaleString("tr-TR")} ₺`} color="" icon="💰" />
                <StatCard title="Toplam Ödenen" value={`${totalPaid.toLocaleString("tr-TR")} ₺`} color="text-green" icon="✅" />
                <StatCard title="Kalan Borç" value={`${totalRemaining.toLocaleString("tr-TR")} ₺`} color="text-red" icon="⏳" />
              </div>

              <div className="panel" style={{ marginBottom: 28 }}>
                <div className="progress-head">
                  <h3 className="panel-title" style={{ marginBottom: 0 }}>
                    Genel Ödeme Durumu
                  </h3>

                  <strong className="money-md">%{percent}</strong>
                </div>

                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${percent}%` }} />
                </div>

                <p className="muted" style={{ marginTop: 22 }}>
                  Toplam harcamanın %{percent} kadarı ödenmiş durumda.
                </p>
              </div>

              <div className="panel">
                <h3 className="panel-title">Kategori Analizi</h3>

                <div className="list-space">
                  {Object.entries(categoryTotals).map(([category, total]) => {
                    const categoryPercent =
                      totalDebt > 0 ? Math.round((total / totalDebt) * 100) : 0;

                    return (
                      <div key={category} className="item-row" style={{ display: "block" }}>
                        <div className="progress-head">
                          <div>
                            <h4 className="item-title">{category}</h4>
                            <p className="muted" style={{ marginTop: 8 }}>
                              Toplam kategori harcaması
                            </p>
                          </div>

                          <div className="item-right">
                            <p className="money-lg text-blue">
                              {total.toLocaleString("tr-TR")} ₺
                            </p>

                            <p className="muted" style={{ marginTop: 5 }}>
                              %{categoryPercent}
                            </p>
                          </div>
                        </div>

                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${categoryPercent}%`, background: "#3b82f6" }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {expenses.length === 0 && (
                    <p className="muted">Henüz analiz edilecek veri yok.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}

function StatCard({
  title,
  value,
  color,
  icon,
}: {
  title: string;
  value: string;
  color: string;
  icon: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <p className="stat-name">{title}</p>
        <h2 className={`stat-value ${color}`}>{value}</h2>
      </div>
    </div>
  );
}

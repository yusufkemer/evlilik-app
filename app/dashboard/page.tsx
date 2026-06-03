"use client";

import { useEffect, useMemo, useState } from "react";
import AuthGuard from "../components/AuthGuard";
import Sidebar from "../components/Sidebar";
import { Expense, getExpenses } from "../lib/store";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

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
                  <h1 className="page-title">Dashboard</h1>
                  <p className="page-subtitle">Genel finans görünümü</p>
                </div>

                <TodayBox />
              </div>

              <div className="grid-3">
                <StatCard icon="💰" title="Toplam Borç" value={totalDebt} color="" />
                <StatCard icon="✅" title="Toplam Ödenen" value={totalPaid} color="text-green" />
                <StatCard icon="⏳" title="Kalan Borç" value={totalRemaining} color="text-red" />
              </div>

              <div className="grid-2">
                <div className="panel">
                  <h3 className="panel-title">Genel Ödeme İlerlemesi</h3>

                  <div className="progress-head">
                    <span className="muted">Tamamlanma</span>
                    <strong>%{percent}</strong>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <p className="muted" style={{ marginTop: 22 }}>
                    Toplam borcun %{percent} kadarı ödenmiş durumda.
                  </p>
                </div>

                <div className="panel" style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                  <div className="stat-icon" style={{ background: "rgba(168,85,247,0.25)" }}>
                    📅
                  </div>

                  <div>
                    <h3 className="panel-title">Yaklaşan Ödemeler</h3>
                    <p className="muted">Önümüzdeki 7 gün içinde ödeme görünmüyor.</p>
                  </div>
                </div>
              </div>

              <div className="panel recent-box">
                <h3 className="panel-title">Son Eklenen Masraflar</h3>

                <div className="list-space">
                  {expenses.length === 0 && (
                    <p className="muted">Henüz masraf kaydı yok.</p>
                  )}

                  {expenses.slice(0, 5).map((item) => (
                    <div key={item.id} className="item-row">
                      <div className="item-left">
                        <div className="item-icon">🧾</div>

                        <div>
                          <div className="item-title-row">
                            <h4 className="item-title">{item.title}</h4>
                            <span className="badge">{item.category}</span>
                          </div>

                          <p className="item-meta">
                            Son ödeme: {item.dueDate || "Belirtilmedi"}
                          </p>
                        </div>
                      </div>

                      <div className="item-right">
                        <p className="money-lg">
                          {item.total.toLocaleString("tr-TR")} ₺
                        </p>

                        <p className="text-green" style={{ fontWeight: 900, marginTop: 8 }}>
                          Ödenen: {item.paid.toLocaleString("tr-TR")} ₺
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}

function TodayBox() {
  return (
    <div className="today-box">
      <div className="today-icon">📅</div>
      <div>
        <p className="today-label">Bugün</p>
        <p className="today-date">{new Date().toLocaleDateString("tr-TR")}</p>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  color,
}: {
  icon: string;
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <p className="stat-name">{title}</p>
        <h2 className={`stat-value ${color}`}>
          {value.toLocaleString("tr-TR")} ₺
        </h2>
      </div>
    </div>
  );
}

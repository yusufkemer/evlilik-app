"use client";

import { useEffect, useMemo, useState } from "react";
import AuthGuard from "../components/AuthGuard";
import Sidebar from "../components/Sidebar";
import { Expense, getExpenses } from "../lib/store";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

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

  const totalDebt = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.total, 0);
  }, [expenses]);

  const totalPaid = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.paid, 0);
  }, [expenses]);

  const totalRemaining = totalDebt - totalPaid;

  const percent =
    totalDebt > 0 ? Math.round((totalPaid / totalDebt) * 100) : 0;

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    expenses.forEach((item) => {
      totals[item.category] =
        (totals[item.category] || 0) + item.total;
    });

    return totals;
  }, [expenses]);

  const pieData = {
    labels: Object.keys(categoryTotals),

    datasets: [
      {
        label: "Kategori Dağılımı",

        data: Object.values(categoryTotals),

        backgroundColor: [
          "#2563eb",
          "#06b6d4",
          "#9333ea",
          "#ec4899",
          "#f59e0b",
          "#ea580c",
        ],

        borderWidth: 0,
      },
    ],
  };

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
                  Analiz
                </h1>

                <p className="text-slate-400 text-lg mt-2">
                  Finansal analiz ve kategori dağılımı
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard
                  title="Toplam Borç"
                  value={`${totalDebt.toLocaleString("tr-TR")} ₺`}
                  color="text-white"
                  icon="💰"
                />

                <StatCard
                  title="Toplam Ödenen"
                  value={`${totalPaid.toLocaleString("tr-TR")} ₺`}
                  color="text-green-400"
                  icon="✅"
                />

                <StatCard
                  title="Kalan Borç"
                  value={`${totalRemaining.toLocaleString("tr-TR")} ₺`}
                  color="text-red-400"
                  icon="⏳"
                />
              </div>

              <div className="bg-[#08172b] border border-slate-700 rounded-2xl p-6 mb-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-2xl font-black">
                    Genel Ödeme Durumu
                  </h3>

                  <span className="text-2xl font-black">
                    %{percent}
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{
                      width: `${percent}%`,
                    }}
                  />
                </div>

                <p className="text-slate-400 mt-5">
                  Toplam harcamanın %{percent} kadarı ödenmiş durumda.
                </p>
              </div>

              <div className="bg-[#08172b] border border-slate-700 rounded-2xl p-6 mb-6">
                <h3 className="text-2xl font-black mb-6">
                  Kategori Dağılımı Grafiği
                </h3>

                {Object.keys(categoryTotals).length === 0 ? (
                  <p className="text-slate-400">
                    Henüz grafik oluşturacak veri yok.
                  </p>
                ) : (
                  <div className="max-w-xl mx-auto">
                    <Pie
                      data={pieData}
                      options={{
                        responsive: true,

                        plugins: {
                          legend: {
                            position: "bottom",

                            labels: {
                              color: "#ffffff",
                              padding: 20,

                              font: {
                                size: 14,
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="bg-[#08172b] border border-slate-700 rounded-2xl p-6">
                <h3 className="text-2xl font-black mb-6">
                  Kategori Analizi
                </h3>

                <div className="space-y-5">
                  {Object.entries(categoryTotals).map(
                    ([category, total]) => {
                      const categoryPercent =
                        totalDebt > 0
                          ? Math.round((total / totalDebt) * 100)
                          : 0;

                      return (
                        <div
                          key={category}
                          className="bg-[#061122] border border-slate-700 rounded-2xl p-5"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                              <h4 className="text-2xl font-black">
                                {category}
                              </h4>

                              <p className="text-slate-400 mt-2">
                                Toplam kategori harcaması
                              </p>
                            </div>

                            <div className="text-left md:text-right">
                              <p className="text-3xl font-black text-blue-400">
                                {total.toLocaleString("tr-TR")} ₺
                              </p>

                              <p className="text-slate-400 mt-1">
                                %{categoryPercent}
                              </p>
                            </div>
                          </div>

                          <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden">
                            <div
                              className="bg-blue-500 h-4 rounded-full"
                              style={{
                                width: `${categoryPercent}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}

                  {expenses.length === 0 && (
                    <p className="text-slate-400">
                      Henüz analiz edilecek veri yok.
                    </p>
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
    <div className="bg-[#08172b] border border-slate-700 rounded-2xl p-6 flex items-center gap-5">
      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-3xl shrink-0">
        {icon}
      </div>

      <div>
        <p className="text-slate-400 font-bold">
          {title}
        </p>

        <h2 className={`text-3xl font-black mt-2 ${color}`}>
          {value}
        </h2>
      </div>
    </div>
  );
}
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

  const percent =
    totalDebt > 0 ? Math.round((totalPaid / totalDebt) * 100) : 0;

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#020817] text-white overflow-x-hidden">
        <div className="flex min-h-screen">
          <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

          <section className="page-shell">
            <div className="page-inner">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h1 className="text-4xl font-black">Dashboard</h1>
                  <p className="text-slate-400 text-lg mt-2">
                    Genel finans görünümü
                  </p>
                </div>

                <div className="hidden md:flex items-center gap-4 bg-[#08172b] border border-slate-700 rounded-2xl px-5 py-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
                    📅
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">Bugün</p>
                    <p className="text-lg font-black">
                      {new Date().toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card icon="💰" title="Toplam Borç" value={totalDebt} color="text-white" />
                <Card icon="✅" title="Toplam Ödenen" value={totalPaid} color="text-green-400" />
                <Card icon="⏳" title="Kalan Borç" value={totalRemaining} color="text-red-400" />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#08172b] border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-2xl font-black mb-5">
                    Genel Ödeme İlerlemesi
                  </h3>

                  <div className="flex justify-between mb-3">
                    <p className="text-slate-400">Tamamlanma</p>
                    <p className="font-black">%{percent}</p>
                  </div>

                  <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <p className="text-slate-400 mt-5">
                    Toplam borcun %{percent} kadarı ödenmiş durumda.
                  </p>
                </div>

                <div className="bg-[#08172b] border border-slate-700 rounded-2xl p-6 flex gap-5 items-start">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-3xl shrink-0">
                    📅
                  </div>

                  <div>
                    <h3 className="text-2xl font-black mb-4">
                      Yaklaşan Ödemeler
                    </h3>

 {expenses.filter((item) => {
  if (!item.dueDate || item.remaining <= 0) return false;

  const today = new Date();
  const dueDate = new Date(item.dueDate);

  const diffDays = Math.ceil(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return diffDays >= 0 && diffDays <= 7;
}).length === 0 ? (
  <p className="text-slate-400">
    Önümüzdeki 7 gün içinde ödeme görünmüyor.
  </p>
) : (
  <div className="space-y-3">
    {expenses
      .filter((item) => {
        if (!item.dueDate || item.remaining <= 0) return false;

        const today = new Date();
        const dueDate = new Date(item.dueDate);

        const diffDays = Math.ceil(
          (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        return diffDays >= 0 && diffDays <= 7;
      })
      .map((item) => (
        <div
          key={item.id}
          className="bg-[#061122] border border-slate-700 rounded-xl p-4"
        >
          <p className="text-white font-bold">
            {item.title}
          </p>

          <p className="text-red-400 font-bold mt-1">
            Kalan: {item.remaining.toLocaleString("tr-TR")} ₺
          </p>

          <p className="text-slate-400 text-sm mt-1">
            Son ödeme: {item.dueDate}
          </p>
        </div>
      ))}
  </div>
)}
                  </div>
                </div>
              </div>

              <div className="bg-[#08172b] border border-slate-700 rounded-2xl p-6 min-h-[260px]">
                <h3 className="text-2xl font-black mb-6">
                  Son Eklenen Masraflar
                </h3>

                <div className="space-y-4">
                  {expenses.length === 0 && (
                    <p className="text-slate-400">Henüz masraf kaydı yok.</p>
                  )}

                  {expenses.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#061122] border border-slate-700 rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-2xl shrink-0">
                          🧾
                        </div>

                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h4 className="text-xl font-black">
                              {item.title}
                            </h4>

                            <span className="bg-blue-600 px-3 py-1 rounded-lg text-sm font-bold">
                              {item.category}
                            </span>
                          </div>

                          <p className="text-slate-400 mt-2">
                            Son ödeme: {item.dueDate || "Belirtilmedi"}
                          </p>
                        </div>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-2xl font-black">
                          {item.total.toLocaleString("tr-TR")} ₺
                        </p>

                        <p className="text-green-400 font-bold mt-2">
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

function Card({
  icon,
  title,
  value,
  color
}: {
  icon: string;
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-[#08172b] border border-slate-700 rounded-2xl p-6 flex items-center gap-5">
      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-3xl shrink-0">
        {icon}
      </div>

      <div>
        <p className="text-slate-400 font-bold">{title}</p>

        <h2 className={`text-3xl font-black mt-2 ${color}`}>
          {value.toLocaleString("tr-TR")} ₺
        </h2>
      </div>
    </div>
  );
}

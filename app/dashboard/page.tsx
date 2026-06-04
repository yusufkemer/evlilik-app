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

  const currentMonthPayment = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return expenses
      .filter((item) => {
        if (!item.dueDate || item.remaining <= 0) return false;

        const dueDate = new Date(item.dueDate);

        return (
          dueDate.getMonth() === currentMonth &&
          dueDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, item) => sum + item.remaining, 0);
  }, [expenses]);

  const completedExpenses = expenses.filter(
    (item) => item.remaining <= 0
  ).length;

  const totalExpenseCount = expenses.length;

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    expenses.forEach((item) => {
      totals[item.category] =
        (totals[item.category] || 0) + item.total;
    });

    return totals;
  }, [expenses]);

  const upcomingPayments = expenses.filter((item) => {
    if (!item.dueDate || item.remaining <= 0) return false;

    const today = new Date();
    const dueDate = new Date(item.dueDate);

    const diffDays = Math.ceil(
      (dueDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return diffDays >= 0 && diffDays <= 7;
  });

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
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h1 className="text-4xl font-black">
                    Dashboard
                  </h1>

                  <p className="text-slate-400 text-lg mt-2">
                    Genel finans görünümü
                  </p>
                </div>

                <div className="hidden md:flex items-center gap-4 bg-[#08172b] border border-slate-700 rounded-2xl px-5 py-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-2xl">
                    📅
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm">
                      Bugün
                    </p>

                    <p className="text-lg font-black">
                      {new Date().toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card
                  icon="💰"
                  title="Toplam Borç"
                  value={`${totalDebt.toLocaleString("tr-TR")} ₺`}
                  color="text-white"
                />

                <Card
                  icon="✅"
                  title="Toplam Ödenen"
                  value={`${totalPaid.toLocaleString("tr-TR")} ₺`}
                  color="text-green-400"
                />

                <Card
                  icon="⏳"
                  title="Kalan Borç"
                  value={`${totalRemaining.toLocaleString("tr-TR")} ₺`}
                  color="text-red-400"
                />

                <Card
                  icon="📆"
                  title="Bu Ay Ödenecek"
                  value={`${currentMonthPayment.toLocaleString("tr-TR")} ₺`}
                  color="text-yellow-400"
                />

                <Card
                  icon="🏁"
                  title="Tamamlanan Masraflar"
                  value={`${completedExpenses} adet`}
                  color="text-blue-400"
                />

                <Card
                  icon="🧾"
                  title="Toplam Masraf Sayısı"
                  value={`${totalExpenseCount} adet`}
                  color="text-purple-400"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#08172b] border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-2xl font-black mb-5">
                    Genel Ödeme İlerlemesi
                  </h3>

                  <div className="flex justify-between mb-3">
                    <p className="text-slate-400">
                      Tamamlanma
                    </p>

                    <p className="font-black">
                      %{percent}
                    </p>
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
                    Toplam borcun %{percent} kadarı ödenmiş durumda.
                  </p>
                </div>

                <div className="bg-[#08172b] border border-slate-700 rounded-2xl p-6 flex gap-5 items-start">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-3xl shrink-0">
                    📅
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-black mb-4">
                      Yaklaşan Ödemeler
                    </h3>

                    {upcomingPayments.length === 0 ? (
                      <p className="text-slate-400">
                        Önümüzdeki 7 gün içinde ödeme görünmüyor.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {upcomingPayments.map((item) => {
                          const today = new Date();
                          const dueDate = new Date(item.dueDate);

                          const diffDays = Math.ceil(
                            (dueDate.getTime() -
                              today.getTime()) /
                              (1000 * 60 * 60 * 24)
                          );

                          return (
                            <div
                              key={item.id}
                              className="bg-[#061122] border border-slate-700 rounded-xl p-4"
                            >
                              <div className="flex justify-between gap-4">
                                <div>
                                  <p className="text-white font-bold">
                                    {item.title}
                                  </p>

                                  <p className="text-red-400 font-bold mt-1">
                                    Kalan:{" "}
                                    {item.remaining.toLocaleString(
                                      "tr-TR"
                                    )}{" "}
                                    ₺
                                  </p>

                                  <p className="text-slate-400 text-sm mt-1">
                                    Son ödeme: {item.dueDate}
                                  </p>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                                    {diffDays === 0
                                      ? "Bugün"
                                      : `${diffDays} gün`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
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
                    <p className="text-slate-400">
                      Henüz masraf kaydı yok.
                    </p>
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
                            Son ödeme:{" "}
                            {item.dueDate || "Belirtilmedi"}
                          </p>
                        </div>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-2xl font-black">
                          {item.total.toLocaleString("tr-TR")} ₺
                        </p>

                        <p className="text-green-400 font-bold mt-2">
                          Ödenen:{" "}
                          {item.paid.toLocaleString("tr-TR")} ₺
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#08172b] border border-slate-700 rounded-2xl p-6 mt-6">
                <h3 className="text-2xl font-black mb-6">
                  Kategori Dağılımı
                </h3>

                <div className="space-y-4">
                  {Object.entries(categoryTotals).length === 0 && (
                    <p className="text-slate-400">
                      Henüz kategori verisi yok.
                    </p>
                  )}

                  {Object.entries(categoryTotals).map(([name, total]) => (
                    <div
                      key={name}
                      className="bg-[#061122] border border-slate-700 rounded-xl p-4 flex justify-between items-center gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {getCategoryIcon(name)}
                        </span>

                        <span className="font-bold text-lg">
                          {name}
                        </span>
                      </div>

                      <span className="text-blue-400 font-black text-xl">
                        {total.toLocaleString("tr-TR")} ₺
                      </span>
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
  color,
}: {
  icon: string;
  title: string;
  value: string;
  color: string;
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

function getCategoryIcon(category: string) {
  switch (category) {
    case "Mobilya":
      return "🛋️";

    case "Beyaz Eşya":
      return "🧊";

    case "Elektronik":
      return "💻";

    case "Düğün":
      return "💍";

    case "Takı":
      return "💎";

    case "Ev Tekstili":
      return "🛏️";

    default:
      return "📦";
  }
}
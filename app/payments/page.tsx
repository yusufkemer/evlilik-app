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
          category: expense.category
        });
      });
    });

    return allPayments.reverse();
  }, [expenses]);

  const totalPayments = payments.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#020817] text-white overflow-x-hidden">
        <div className="flex min-h-screen">
          <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

          <section className="page-shell">
            <div className="page-inner">
              <div className="mb-8">
                <h1 className="text-4xl font-black">Ödemeler</h1>

                <p className="text-slate-400 text-lg mt-2">
                  Yapılan tüm ödeme geçmişi
                </p>
              </div>

              <div className="bg-[#08172b] border border-slate-700 rounded-2xl p-6 mb-6 flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-3xl shrink-0">
                  💸
                </div>

                <div>
                  <p className="text-slate-400 font-bold">
                    Toplam Yapılan Ödeme
                  </p>

                  <h2 className="text-3xl font-black text-green-400 mt-2">
                    {totalPayments.toLocaleString("tr-TR")} ₺
                  </h2>
                </div>
              </div>

              <div className="space-y-5">
                {payments.map((payment, index) => (
                  <div
                    key={index}
                    className="bg-[#08172b] border border-slate-700 rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-6"
                  >
                    <div className="flex items-start gap-5">
                      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-3xl shrink-0">
                        💰
                      </div>

                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-2xl font-black">
                            {payment.title}
                          </h3>

                          <span className="bg-blue-600 px-3 py-1 rounded-lg font-bold">
                            {payment.category}
                          </span>
                        </div>

                        <p className="text-slate-400 mt-3">
                          İşlem tarihi: {payment.date}
                        </p>
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-3xl font-black text-green-400">
                        + {payment.amount.toLocaleString("tr-TR")} ₺
                      </p>

                      <p className="text-slate-400 mt-2">
                        ödeme kaydı
                      </p>
                    </div>
                  </div>
                ))}

                {payments.length === 0 && (
                  <div className="bg-[#08172b] border border-slate-700 rounded-2xl p-6">
                    <p className="text-slate-400">
                      Henüz ödeme geçmişi bulunmuyor.
                    </p>
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

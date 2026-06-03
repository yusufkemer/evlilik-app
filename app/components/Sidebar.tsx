"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

type Props = {
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
};

export default function Sidebar({
  mobileOpen,
  setMobileOpen
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const menus = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Masraflar", path: "/expenses", icon: "🧾" },
    { name: "Analiz", path: "/analysis", icon: "📈" },
    { name: "Ödemeler", path: "/payments", icon: "📅" }
  ];

  async function logout() {
    await signOut(auth);
    router.push("/login");
  }

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-[70] lg:hidden bg-blue-600 text-white px-4 py-3 rounded-xl font-bold shadow-lg"
      >
        ☰ Menü
      </button>

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed lg:static z-50 top-0 left-0
          w-[300px] min-h-screen
          bg-[#061122] border-r border-slate-800
          p-7 transition-all duration-300
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-xl text-white">
              ◆
            </div>

            <div>
              <h1 className="text-2xl font-black text-white">
                WeddingPro
              </h1>

              <p className="text-slate-400 mt-1">
                Finans Yönetimi
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-white text-3xl"
          >
            ✕
          </button>
        </div>

        <nav className="space-y-4">
          {menus.map((menu) => (
            <Link
              key={menu.path}
              href={menu.path}
              onClick={() => setMobileOpen(false)}
              className={`
                flex items-center gap-4 px-5 py-4 rounded-xl text-lg font-bold transition
                ${
                  pathname === menu.path
                    ? "bg-blue-600 text-white"
                    : "text-white hover:bg-slate-800"
                }
              `}
            >
              <span className="text-xl">{menu.icon}</span>
              <span>{menu.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-10">
          <p className="text-slate-400 text-lg mb-4">
            Hesap
          </p>

          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 rounded-xl px-5 py-4 text-left text-lg font-bold text-white transition"
          >
            ← Çıkış Yap
          </button>
        </div>

        <div className="absolute bottom-8 left-7 right-7 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border border-slate-600 flex items-center justify-center text-xl font-black text-white">
            N
          </div>

          <p className="font-bold text-white">N</p>

          <span className="ml-auto text-slate-400">⌄</span>
        </div>
      </aside>
    </>
  );
}

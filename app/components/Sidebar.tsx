"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

type Props = {
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
};

export default function Sidebar({ mobileOpen, setMobileOpen }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const menus = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Masraflar", path: "/expenses", icon: "🧾" },
    { name: "Analiz", path: "/analysis", icon: "📊" },
    { name: "Ödemeler", path: "/payments", icon: "📅" },
  ];

  async function logout() {
    await signOut(auth);
    router.push("/login");
  }

  return (
    <>
      <div
        onClick={() => setMobileOpen(false)}
        className={`sidebar-overlay ${mobileOpen ? "show" : ""}`}
      />

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">◆</div>

          <div>
            <h1 className="logo-title">WeddingPro</h1>
            <p className="logo-subtitle">Finans Yönetimi</p>
          </div>
        </div>

        <nav className="nav-list">
          {menus.map((menu) => (
            <Link
              key={menu.path}
              href={menu.path}
              onClick={() => setMobileOpen(false)}
              className={`nav-link ${pathname === menu.path ? "active" : ""}`}
            >
              <span>{menu.icon}</span>
              <span>{menu.name}</span>
            </Link>
          ))}
        </nav>

        <div className="account-block">
          <p className="account-label">Hesap</p>

          <button onClick={logout} className="logout-btn">
            ← Çıkış Yap
          </button>
        </div>

        <div className="user-bottom">
          <div className="avatar">N</div>
          <p style={{ fontWeight: 900 }}>N</p>
          <span style={{ marginLeft: "auto", color: "#94a3b8" }}>⌄</span>
        </div>
      </aside>
    </>
  );
}

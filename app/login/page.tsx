"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    if (!email || !password) {
      alert("E-posta ve şifre gir.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch {
      alert("Giriş başarısız. E-posta veya şifre hatalı olabilir.");
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">WeddingPro</h1>
        <p className="auth-subtitle">Evlilik finans hesabına giriş yap</p>

        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-style"
          style={{ marginBottom: 12 }}
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-style"
          style={{ marginBottom: 18 }}
        />

        <button onClick={login} className="auth-btn">
          Giriş Yap
        </button>

        <button onClick={() => router.push("/register")} className="auth-secondary">
          Hesap Oluştur
        </button>
      </div>
    </main>
  );
}

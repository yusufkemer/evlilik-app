"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function register() {
    if (!email || !password) {
      alert("E-posta ve şifre gir.");
      return;
    }

    if (password.length < 6) {
      alert("Şifre en az 6 karakter olmalı.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch {
      alert("Kayıt başarısız. Bu e-posta kullanılıyor olabilir.");
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">WeddingPro</h1>
        <p className="auth-subtitle">Yeni hesap oluştur</p>

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

        <button onClick={register} className="auth-btn">
          Kayıt Ol
        </button>

        <button onClick={() => router.push("/login")} className="auth-secondary">
          Girişe Dön
        </button>
      </div>
    </main>
  );
}

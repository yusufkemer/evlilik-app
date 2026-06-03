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
      alert("Kayıt başarısız.");
    }
  }

  return (
    <main className="min-h-screen bg-[#020817] flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-md bg-[#08172b] border border-slate-700 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-4xl font-black mb-3 text-center">
          WeddingPro
        </h1>

        <p className="text-slate-400 text-center mb-8">
          Yeni hesap oluştur
        </p>

        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-style mb-4"
        />

        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-style mb-6"
        />

        <button
          onClick={register}
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-4 rounded-xl font-black"
        >
          Kayıt Ol
        </button>

        <button
          onClick={() => router.push("/login")}
          className="w-full mt-4 bg-[#061122] border border-slate-700 hover:bg-slate-800 transition p-4 rounded-xl font-bold"
        >
          Girişe Dön
        </button>
      </div>
    </main>
  );
}

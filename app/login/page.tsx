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
      alert("Giriş başarısız.");
    }
  }

  return (
    <main className="min-h-screen bg-[#020817] flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-md bg-[#08172b] border border-slate-700 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-4xl font-black mb-3 text-center">WeddingPro</h1>

        <p className="text-slate-400 text-center mb-8">
          Evlilik finans hesabına giriş yap
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
          onClick={login}
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-4 rounded-xl font-black"
        >
          Giriş Yap
        </button>
      </div>
    </main>
  );
}

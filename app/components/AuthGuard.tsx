"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
      else setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020817] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-black">WeddingPro</h1>
          <p className="text-slate-400 mt-3">Yükleniyor...</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}

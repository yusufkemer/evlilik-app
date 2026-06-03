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
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <main className="auth-page">
        <div style={{ textAlign: "center" }}>
          <h1 className="auth-title">WeddingPro</h1>
          <p className="muted">Yükleniyor...</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}

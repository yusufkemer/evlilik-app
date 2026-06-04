import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EVLİLİK FİNANS TAKİP",
  description: "EVLİLİK FİNANS VE MASRAF YÖNETİMİ",
  manifest: "/manifest.json",

  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport = {
  themeColor: "#020817",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
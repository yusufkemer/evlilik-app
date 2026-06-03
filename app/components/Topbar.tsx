"use client";

type Props = {
  title: string;
  subtitle: string;
  setMobileOpen: (value: boolean) => void;
};

export default function Topbar({
  title,
  subtitle,
  setMobileOpen,
}: Props) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div className="flex items-start gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-xl"
        >
          ☰
        </button>

        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-white">
            {title}
          </h1>

          <p className="text-slate-400 text-lg mt-2">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4 bg-[#061122] border border-slate-700 rounded-2xl px-6 py-4">
        <span className="text-xl">📅</span>

        <div>
          <p className="text-slate-400">Bugün</p>
          <p className="text-white font-black">
            {new Date().toLocaleDateString("tr-TR")}
          </p>
        </div>
      </div>
    </div>
  );
}
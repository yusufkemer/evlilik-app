type Props = {
  totalDebt: number;
  totalPaid: number;
  totalRemaining: number;
};

export default function SummaryCards({
  totalDebt,
  totalPaid,
  totalRemaining,
}: Props) {
  const cards = [
    {
      title: "Toplam Borç",
      value: totalDebt,
      color: "text-white",
      icon: "💰",
    },
    {
      title: "Toplam Ödenen",
      value: totalPaid,
      color: "text-green-400",
      icon: "✅",
    },
    {
      title: "Kalan Borç",
      value: totalRemaining,
      color: "text-red-400",
      icon: "⏳",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-[#0f172a] border border-gray-800 rounded-[24px] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm font-semibold">
              {card.title}
            </p>

            <span className="text-2xl">
              {card.icon}
            </span>
          </div>

          <h3 className={`text-3xl lg:text-4xl font-bold ${card.color}`}>
            {Number(card.value).toLocaleString("tr-TR")} ₺
          </h3>
        </div>
      ))}
    </div>
  );
}
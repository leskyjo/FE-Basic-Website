const items = [
  {
    name: "Focus Hoodie",
    desc: "Soft midweight hoodie for long sprints.",
    price: "$68",
  },
  {
    name: "Sprint Notebook",
    desc: "Dotted pages for weekly experiments.",
    price: "$18",
  },
  {
    name: "FE Button Badge Pack",
    desc: "Stickers and badges to mark milestones.",
    price: "$12",
  },
];

export default function ShopPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Shop</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">Gear tuned to your journey</h1>
        <p className="mt-2 text-sm text-gray-700">
          Localized shipping based on your zip. The FE Button can reorder your essentials.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.name} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-700">{item.desc}</p>
            <p className="mt-3 text-sm font-bold text-indigo-700">{item.price}</p>
            <button className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-500">
              Add via FE Button
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

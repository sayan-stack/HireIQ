const stats = [
  {
    title: "Total Applicants",
    value: "1,240",
    change: "+12%",
    subtitle: "vs last month",
    positive: true,
  },
  {
    title: "Active Jobs",
    value: "8",
    change: "0%",
    subtitle: "No change",
    positive: false,
  },
  {
    title: "Interviews",
    value: "14",
    change: "+2",
    subtitle: "Scheduled this week",
    positive: true,
  },
  {
    title: "Total Views",
    value: "5,230",
    change: "+8%",
    subtitle: "vs last month",
    positive: true,
  },
];

export default function Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((s) => (
        <div
          key={s.title}
          className="
            rounded-xl p-6
            bg-[var(--bg-card)]
            border border-[var(--border-subtle)]
            shadow-[var(--shadow-sm)]
            hover:shadow-[var(--shadow-md)]
            transition-all duration-300
          "
        >
          <p className="text-[var(--text-tertiary)] text-sm">{s.title}</p>

          <div className="flex justify-between items-center mt-3">
            <h3 className="text-2xl font-bold text-[var(--text-primary)]">{s.value}</h3>
            <span
              className={`text-sm font-medium ${s.positive ? "text-green-500" : "text-[var(--text-muted)]"
                }`}
            >
              {s.change}
            </span>
          </div>

          <p className="text-xs text-[var(--text-muted)] mt-1">{s.subtitle}</p>
        </div>
      ))}
    </div>
  );
}

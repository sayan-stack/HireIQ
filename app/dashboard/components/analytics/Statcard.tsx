export default function StatCard({
  title,
  value,
  subtitle,
  change,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  change: string;
  color: string;
}) {
  return (
    <div
      onClick={() => console.log(`${title} card clicked`)}
      className="cursor-pointer rounded-xl p-5 transition"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)'
      }}
    >
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{title}</p>

      <h3 className="text-2xl font-semibold mt-2" style={{ color: 'var(--text-primary)' }}>{value}</h3>

      <div className="flex justify-between items-center mt-3">
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
        <span className={`text-sm ${color}`}>{change}</span>
      </div>
    </div>
  );
}

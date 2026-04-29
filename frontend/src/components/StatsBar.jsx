const StatsBar = ({ stats }) => {
  const items = [
    { label: 'Total', value: stats.total, color: 'text-white' },
    { label: 'Pending', value: stats.pending, color: 'text-amber-400' },
    { label: 'In Progress', value: stats.inProgress, color: 'text-sage-400' },
    { label: 'Completed', value: stats.completed, color: 'text-ink-500' },
  ];

  const completionPct = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  return (
    <div className="card p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-sm text-ink-500 uppercase tracking-wider">
          Overview
        </h2>
        <span className="font-mono text-xs text-ink-500">
          {completionPct}% complete
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-ink-700 rounded-full mb-5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sage-600 to-sage-400 rounded-full transition-all duration-700"
          style={{ width: `${completionPct}%` }}
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4">
        {items.map(({ label, value, color }) => (
          <div key={label} className="text-center">
            <p className={`font-display font-bold text-2xl ${color}`}>{value}</p>
            <p className="text-ink-500 text-xs font-body mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;

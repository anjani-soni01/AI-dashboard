import './SimplePieChart.css';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export default function SimplePieChart({ data, title }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;

  const segments = data.map((d, i) => {
    const percent = total > 0 ? (d.value / total) * 100 : 0;
    const start = cumulative;
    cumulative += percent;
    return { ...d, percent, start, color: COLORS[i % COLORS.length] };
  });

  const gradient = segments
    .map((s) => `${s.color} ${s.start}% ${s.start + s.percent}%`)
    .join(', ');

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <div className="pie-chart">
        <div
          className="pie-chart-ring"
          style={{ background: `conic-gradient(${gradient})` }}
        />
        <div className="pie-chart-legend">
          {segments.map((s, i) => (
            <div key={i} className="pie-legend-item">
              <span className="pie-legend-dot" style={{ background: s.color }} />
              <span>{s.label}</span>
              <span style={{ marginLeft: 'auto', fontWeight: 600 }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

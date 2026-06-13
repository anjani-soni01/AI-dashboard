import './SimpleLineChart.css';

export default function SimpleLineChart({ data, title, color = '#8b5cf6' }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const padding = 20;
  const width = 400;
  const height = 160;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - (d.value / max) * (height - 2 * padding);
    return { x, y, ...d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <div className="line-chart">
        <svg viewBox={`0 0 ${width} ${height}`} className="line-chart-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`}
            fill="url(#lineGrad)"
          />
          <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill={color} />
          ))}
        </svg>
        <div className="line-chart-labels">
          {data.map((d, i) => (
            <span key={i} className="line-chart-label">{d.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

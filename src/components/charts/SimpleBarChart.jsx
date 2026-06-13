import './SimpleBarChart.css';

export default function SimpleBarChart({ data, title, color = '#3b82f6' }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      <div className="bar-chart">
        {data.map((item, i) => (
          <div key={i} className="bar-chart-item">
            <div className="bar-chart-bar-wrapper">
              <div
                className="bar-chart-bar animate-fade-in-up"
                style={{
                  height: `${(item.value / max) * 100}%`,
                  background: `linear-gradient(180deg, ${color} 0%, ${color}88 100%)`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            </div>
            <span className="bar-chart-label">{item.label}</span>
            <span className="bar-chart-value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

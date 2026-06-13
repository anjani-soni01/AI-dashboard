import Card from '../common/Card';
import './StatCard.css';

export default function StatCard({ icon, label, value, color = 'blue', trend }) {
  return (
    <Card className={`stat-card stat-card-${color}`}>
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-content">
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-label">{label}</span>
        {trend && <span className="stat-card-trend">{trend}</span>}
      </div>
    </Card>
  );
}

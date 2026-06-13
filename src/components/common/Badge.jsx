import './Badge.css';

const PRIORITY_MAP = {
  high: { label: 'High', class: 'badge-high' },
  medium: { label: 'Medium', class: 'badge-medium' },
  low: { label: 'Low', class: 'badge-low' },
};

export default function Badge({ children, variant = 'default', priority }) {
  if (priority) {
    const config = PRIORITY_MAP[priority] || PRIORITY_MAP.medium;
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  }

  return <span className={`badge badge-${variant}`}>{children}</span>;
}

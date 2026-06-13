import './Card.css';

export default function Card({ children, className = '', glass = true, hover = false, onClick, style }) {
  return (
    <div
      className={`card ${glass ? 'glass-card' : ''} ${hover ? 'card-hover' : ''} ${className}`}
      onClick={onClick}
      style={style}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

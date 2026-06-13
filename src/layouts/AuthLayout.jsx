import { Link } from 'react-router-dom';
import ThemeToggle from '../components/common/ThemeToggle';
import Card from '../components/common/Card';
import './MainLayout.css';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <Card className="auth-card glass-card animate-fade-in">
          <div className="auth-header">
            <div className="auth-logo gradient-text">{title}</div>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {children}
        </Card>
      </div>
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 10 }}>
        <ThemeToggle />
      </div>
    </div>
  );
}

export function AuthFooterLink({ text, linkText, to }) {
  return (
    <div className="auth-footer">
      {text} <Link to={to}>{linkText}</Link>
    </div>
  );
}

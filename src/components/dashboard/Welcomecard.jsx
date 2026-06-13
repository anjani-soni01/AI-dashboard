import { useAuth } from '../../context/AuthContext';
import './StatCard.css';

export default function WelcomeCard() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="welcome-card animate-fade-in">
      <h2>Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋</h2>
      <p>Stay updated with the latest college notices and announcements.</p>
      <div className="welcome-card-date">{today}</div>
    </div>
  );
}

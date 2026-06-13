import { FileText, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotices } from '../context/NoticeContext';
import { StudentLayout } from '../routes/ProtectedRoute';
import WelcomeCard from '../components/dashboard/Welcomecard';
import StatCard from '../components/dashboard/StatCard';
import NoticeCard from '../components/notices/NoticeCard';
import Card from '../components/common/Card';

export default function Dashboard() {
  const { user } = useAuth();
  const { getPersonalizedNotices, getStats } = useNotices();

  const personalized = getPersonalizedNotices(user);
  const stats = getStats(user);
  const latest = [...personalized].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  const recommended = personalized.filter((n) => n.priority === 'high' || n.mandatory).slice(0, 3);

  return (
    <StudentLayout title="Dashboard">
      <div className="page-container">
        <WelcomeCard />

        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          <StatCard icon={<FileText size={24} />} label="Total Notices" value={stats.total} color="blue" />
          <StatCard icon={<AlertTriangle size={24} />} label="Important" value={stats.important} color="orange" />
          <StatCard icon={<Clock size={24} />} label="Upcoming Deadlines" value={stats.upcomingDeadlines} color="purple" />
          <StatCard icon={<CheckCircle size={24} />} label="Read Notices" value={stats.read} color="green" />
        </div>

        <section style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Personalized Notices</h2>
          <div className="notice-list">
            {personalized.slice(0, 3).map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
          {personalized.length === 0 && (
            <Card glass><p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No personalized notices for your profile.</p></Card>
          )}
        </section>

        <section style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Latest Announcements</h2>
          <div className="notice-list">
            {latest.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Recommended Notices</h2>
          <div className="notice-list">
            {recommended.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        </section>
      </div>
    </StudentLayout>
  );
}

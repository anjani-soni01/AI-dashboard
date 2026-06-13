import { useState, useEffect } from 'react';
import { GraduationCap, Briefcase, Award, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotices } from '../context/NoticeContext';
import { StudentLayout } from '../routes/ProtectedRoute';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

const CATEGORY_CONFIG = {
  Exam: { icon: GraduationCap, label: 'Exam Deadlines', priority: 'high', color: 'var(--color-danger)' },
  Placement: { icon: Briefcase, label: 'Placement Deadlines', priority: 'high', color: 'var(--color-primary)' },
  Scholarship: { icon: Award, label: 'Scholarship Deadlines', priority: 'medium', color: 'var(--color-warning)' },
  Event: { icon: Calendar, label: 'Event Deadlines', priority: 'low', color: 'var(--color-success)' },
  Club: { icon: Calendar, label: 'Club/Event Deadlines', priority: 'low', color: 'var(--color-secondary)' },
};

function CountdownTimer({ deadline }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(deadline);
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        expired: false,
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (timeLeft.expired) {
    return <span style={{ color: 'var(--color-danger)', fontWeight: 600, fontSize: '0.85rem' }}>Expired</span>;
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {[
        { val: timeLeft.days, label: 'D' },
        { val: timeLeft.hours, label: 'H' },
        { val: timeLeft.minutes, label: 'M' },
        { val: timeLeft.seconds, label: 'S' },
      ].map((t) => (
        <div key={t.label} style={{ textAlign: 'center', padding: '0.4rem 0.6rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-sm)', minWidth: '44px' }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{t.val}</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Reminders() {
  const { user } = useAuth();
  const { getPersonalizedNotices, reminders } = useNotices();
  const notices = getPersonalizedNotices(user);

  const upcomingNotices = notices
    .filter((n) => new Date(n.deadline) >= new Date())
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const grouped = {};
  upcomingNotices.forEach((n) => {
    const key = n.category === 'Club' ? 'Club' : n.category;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(n);
  });

  return (
    <StudentLayout title="Reminders">
      <div className="page-container">
        <div className="page-header">
          <h1>Smart Reminders</h1>
          <p>Track upcoming deadlines with countdown timers</p>
        </div>

        {Object.entries(CATEGORY_CONFIG).map(([category, config]) => {
          const items = grouped[category];
          if (!items?.length) return null;
          const Icon = config.icon;

          return (
            <section key={category} style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Icon size={22} color={config.color} />
                <h2 style={{ fontSize: '1.15rem' }}>{config.label}</h2>
                <Badge priority={config.priority} />
              </div>

              <div className="grid-2">
                {items.map((notice) => {
                  const hasReminder = reminders.some((r) => r.noticeId === notice.id);
                  return (
                    <Card key={notice.id} glass>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{notice.title}</h3>
                        {hasReminder && (
                          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-success)', background: 'rgba(16,185,129,0.1)', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                            Reminder Set
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        Due: {new Date(notice.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                      <CountdownTimer deadline={notice.deadline} />
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}

        {upcomingNotices.length === 0 && (
          <Card glass>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
              No upcoming deadlines. You're all caught up!
            </p>
          </Card>
        )}
      </div>
    </StudentLayout>
  );
}

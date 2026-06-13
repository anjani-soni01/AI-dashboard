import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotices } from '../context/NoticeContext';
import { StudentLayout } from '../routes/ProtectedRoute';
import NoticeCard from '../components/notices/NoticeCard';
import NoticeFilters from '../components/notices/NoticeFilters';
import Card from '../components/common/Card';

export default function Notices() {
  const { user } = useAuth();
  const { getPersonalizedNotices } = useNotices();
  const [filters, setFilters] = useState({ branch: '', category: '', priority: '' });

  const notices = getPersonalizedNotices(user);

  const filtered = useMemo(() => {
    return notices.filter((n) => {
      if (filters.branch && !n.branches.includes(filters.branch)) return false;
      if (filters.category && n.category !== filters.category) return false;
      if (filters.priority && n.priority !== filters.priority) return false;
      return true;
    });
  }, [notices, filters]);

  return (
    <StudentLayout title="Notices">
      <div className="page-container">
        <div className="page-header">
          <h1>All Notices</h1>
          <p>Browse and filter college notices relevant to you</p>
        </div>

        <NoticeFilters filters={filters} onChange={setFilters} />

        <div className="notice-list">
          {filtered.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>

        {filtered.length === 0 && (
          <Card glass>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
              No notices match your filters.
            </p>
          </Card>
        )}
      </div>
    </StudentLayout>
  );
}

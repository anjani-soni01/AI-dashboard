import { Users, FileText, Activity, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotices } from '../context/NoticeContext';
import { ANALYTICS_DATA } from '../services/mockData';
import { AdminLayout } from '../routes/ProtectedRoute';
import StatCard from '../components/dashboard/StatCard';
import SimpleBarChart from '../components/charts/SimpleBarChart';
import SimpleLineChart from '../components/charts/SimpleLineChart';
import Card from '../components/common/Card';

export default function AdminDashboard() {
  const { getAllStudents } = useAuth();
  const { notices, readNotices } = useNotices();
  const students = getAllStudents();

  const activeNotices = notices.filter((n) => new Date(n.deadline) >= new Date()).length;
  const totalViews = notices.reduce((sum, n) => sum + (n.views || 0), 0);
  const readRate = notices.length > 0 ? Math.round((readNotices.length / notices.length) * 100) : 0;

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="page-container">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Overview of college noticeboard statistics</p>
        </div>

        <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
          <StatCard icon={<Users size={24} />} label="Total Students" value={students.length} color="blue" trend="+12% this month" />
          <StatCard icon={<FileText size={24} />} label="Total Notices" value={notices.length} color="purple" />
          <StatCard icon={<Activity size={24} />} label="Active Notices" value={activeNotices} color="green" />
          <StatCard icon={<Eye size={24} />} label="Read Rate" value={`${readRate}%`} color="orange" />
        </div>

        <div className="grid-2" style={{ gap: '1.5rem' }}>
          <Card glass>
            <SimpleLineChart data={ANALYTICS_DATA.studentEngagement} title="Student Engagement" color="#3b82f6" />
          </Card>
          <Card glass>
            <SimpleBarChart data={ANALYTICS_DATA.noticeViews} title="Notice Views (This Week)" color="#8b5cf6" />
          </Card>
          <Card glass>
            <SimpleBarChart data={ANALYTICS_DATA.departmentReach.map((d) => ({ label: d.label, value: d.value }))} title="Department Reach" color="#10b981" />
          </Card>
          <Card glass>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Notices</h3>
            {notices.slice(0, 5).map((n) => (
              <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 500 }}>{n.title.slice(0, 40)}...</span>
                <span style={{ color: 'var(--text-muted)' }}>{n.views} views</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

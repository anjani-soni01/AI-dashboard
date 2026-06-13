import { ANALYTICS_DATA } from '../services/mockData';
import { AdminLayout } from '../routes/ProtectedRoute';
import SimpleBarChart from '../components/charts/SimpleBarChart';
import SimpleLineChart from '../components/charts/SimpleLineChart';
import SimplePieChart from '../components/charts/SimplePieChart';
import Card from '../components/common/Card';

export default function Analytics() {
  return (
    <AdminLayout title="Analytics">
      <div className="page-container">
        <div className="page-header">
          <h1>Analytics Dashboard</h1>
          <p>Detailed insights into noticeboard performance</p>
        </div>

        <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
          <Card glass>
            <SimpleBarChart data={ANALYTICS_DATA.noticeViews} title="Notice Views (Daily)" color="#3b82f6" />
          </Card>
          <Card glass>
            <SimpleLineChart data={ANALYTICS_DATA.studentEngagement} title="Student Engagement" color="#8b5cf6" />
          </Card>
        </div>

        <div className="grid-2" style={{ gap: '1.5rem' }}>
          <Card glass>
            <SimplePieChart data={ANALYTICS_DATA.faqAnalytics} title="FAQ Analytics" />
          </Card>
          <Card glass>
            <SimpleBarChart data={ANALYTICS_DATA.monthlyActivity} title="Monthly Activity" color="#10b981" />
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

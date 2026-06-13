import { useState } from 'react';
import { Sparkles, Download, Share2, Calendar, Building2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotices } from '../context/NoticeContext';
import { generateSummary } from '../services/aiService';
import { StudentLayout } from '../routes/ProtectedRoute';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function Summary() {
  const { user } = useAuth();
  const { getPersonalizedNotices } = useNotices();
  const notices = getPersonalizedNotices(user);
  const [selectedId, setSelectedId] = useState(notices[0]?.id || '');
  const selected = notices.find((n) => n.id === selectedId);

  const summary = selected ? generateSummary(selected) : '';

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleShare = () => {
    if (navigator.share && summary) {
      navigator.share({ title: selected.title, text: summary });
    } else {
      navigator.clipboard?.writeText(summary);
      alert('Summary copied to clipboard!');
    }
  };

  return (
    <StudentLayout title="AI Summary">
      <div className="page-container">
        <div className="page-header">
          <h1>AI Summary</h1>
          <p>Get instant AI-generated summaries of college notices</p>
        </div>

        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
          <label className="input-label">Select Notice</label>
          <select className="select-field" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            {notices.map((n) => (
              <option key={n.id} value={n.id}>{n.title}</option>
            ))}
          </select>
        </div>

        {selected && (
          <div className="grid-2" style={{ gap: '1.5rem' }}>
            <Card glass className="animate-fade-in">
              <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>{selected.title}</h2>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                <Badge priority={selected.priority} />
                <Badge variant="category">{selected.category}</Badge>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={16} color="var(--color-warning)" />
                  <strong>Deadline:</strong> {formatDate(selected.deadline)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <Building2 size={16} color="var(--color-primary)" />
                  <strong>Department:</strong> {selected.department}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle size={16} color="var(--color-success)" />
                  <strong>Eligibility:</strong> {selected.eligibility || 'See full notice'}
                </div>
              </div>

              {selected.additionalDetails && (
                <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius)', marginBottom: '1rem' }}>
                  <strong>Additional Details:</strong>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '0.35rem', fontSize: '0.9rem' }}>{selected.additionalDetails}</p>
                </div>
              )}
            </Card>

            <Card glass className="animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Sparkles size={20} color="var(--color-secondary)" />
                <h2 style={{ fontSize: '1.15rem' }}>AI Generated Summary</h2>
              </div>

              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                {summary}
              </pre>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Button variant="secondary" icon={<Download size={18} />}>Download PDF</Button>
                <Button variant="outline" onClick={handleShare} icon={<Share2 size={18} />}>Share</Button>
              </div>
            </Card>
          </div>
        )}

        {!selected && (
          <Card glass>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
              No notices available for summary.
            </p>
          </Card>
        )}
      </div>
    </StudentLayout>
  );
}

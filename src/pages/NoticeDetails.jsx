import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, Building2, Tag, Download, Sparkles, Bell, FileText, ArrowLeft,
} from 'lucide-react';
import { useNotices } from '../context/NoticeContext';
import { generateSummary } from '../services/aiService';
import { StudentLayout } from '../routes/ProtectedRoute';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

export default function NoticeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNoticeById, incrementViews, markAsRead, addReminder } = useNotices();
  const notice = getNoticeById(id);
  const [summary, setSummary] = useState('');
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderDate, setReminderDate] = useState('');

  useEffect(() => {
    if (notice) {
      incrementViews(notice.id);
      markAsRead(notice.id);
    }
  }, [notice, incrementViews, markAsRead]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleGenerateSummary = () => {
    setSummary(generateSummary(notice));
  };

  const handleSetReminder = () => {
    if (reminderDate) {
      addReminder(notice.id, reminderDate);
      setShowReminderModal(false);
      setReminderDate('');
    }
  };

  if (!notice) {
    return (
      <StudentLayout title="Notice">
        <div className="page-container">
          <Card glass>
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              Notice not found.
            </p>
            <Button onClick={() => navigate('/notices')} variant="outline">Back to Notices</Button>
          </Card>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="Notice Details">
      <div className="page-container">
        <Button variant="ghost" onClick={() => navigate(-1)} icon={<ArrowLeft size={18} />} style={{ marginBottom: '1rem' }}>
          Back
        </Button>

        <Card glass className="animate-fade-in">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <Badge priority={notice.priority} />
            <Badge variant="category">{notice.category}</Badge>
            {notice.mandatory && <Badge variant="mandatory">Mandatory</Badge>}
          </div>

          <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{notice.title}</h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Building2 size={16} /> {notice.department}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={16} /> {formatDate(notice.date)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-warning)' }}><Clock size={16} /> Deadline: {formatDate(notice.deadline)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Tag size={16} /> {notice.category}</span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Description</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{notice.description}</p>
          </div>

          {notice.eligibility && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius)' }}>
              <strong>Eligibility:</strong> {notice.eligibility}
            </div>
          )}

          {notice.attachments?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Attachments</h3>
              {notice.attachments.map((att, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius)', marginBottom: '0.5rem' }}>
                  <FileText size={18} color="var(--color-primary)" />
                  <span>{att.name}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Button onClick={handleGenerateSummary} icon={<Sparkles size={18} />}>Generate Summary</Button>
            <Button variant="secondary" icon={<Download size={18} />}>Download PDF</Button>
            <Button variant="outline" onClick={() => setShowReminderModal(true)} icon={<Bell size={18} />}>Set Reminder</Button>
          </div>

          {summary && (
            <div style={{ padding: '1.25rem', background: 'var(--gradient-surface)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--color-secondary)" /> AI Summary
              </h3>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{summary}</pre>
            </div>
          )}
        </Card>

        {showReminderModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '1rem' }} onClick={() => setShowReminderModal(false)}>
            <Card glass onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', width: '100%' }}>
              <h3 style={{ marginBottom: '1rem' }}>Set Reminder</h3>
              <input type="date" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} className="input-field" style={{ width: '100%', marginBottom: '1rem' }} />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Button onClick={handleSetReminder} fullWidth>Set Reminder</Button>
                <Button variant="ghost" onClick={() => setShowReminderModal(false)}>Cancel</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

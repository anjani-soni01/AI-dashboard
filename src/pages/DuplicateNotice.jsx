import { useState } from 'react';
import { Copy, AlertTriangle } from 'lucide-react';
import { useNotices } from '../context/NoticeContext';
import { detectDuplicates } from '../services/aiService';
import { AdminLayout } from '../routes/ProtectedRoute';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

export default function DuplicateNotice() {
  const { notices } = useNotices();
  const [selectedId, setSelectedId] = useState(notices[0]?.id || '');

  const selected = notices.find((n) => n.id === selectedId);
  const duplicates = selected ? detectDuplicates(selected, notices) : [];

  return (
    <AdminLayout title="Duplicate Detection">
      <div className="page-container">
        <div className="page-header">
          <h1>Duplicate Notice Detection</h1>
          <p>AI-powered similarity analysis to detect duplicate notices</p>
        </div>

        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
          <label className="input-label">Select Notice to Analyze</label>
          <select className="select-field" value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            {notices.map((n) => (
              <option key={n.id} value={n.id}>{n.title}</option>
            ))}
          </select>
        </div>

        {selected && (
          <div className="grid-2" style={{ gap: '1.5rem' }}>
            <Card glass>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Copy size={20} color="var(--color-primary)" />
                <h2 style={{ fontSize: '1.1rem' }}>Current Notice</h2>
              </div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>{selected.title}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Badge variant="category">{selected.category}</Badge>
                <Badge priority={selected.priority} />
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {selected.description.slice(0, 300)}...
              </p>
            </Card>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <AlertTriangle size={20} color="var(--color-warning)" />
                <h2 style={{ fontSize: '1.1rem' }}>Similar Notices ({duplicates.length})</h2>
              </div>

              {duplicates.length === 0 && (
                <Card glass>
                  <p style={{ textAlign: 'center', color: 'var(--color-success)', padding: '2rem', fontWeight: 600 }}>
                    No similar notices detected. This notice appears unique.
                  </p>
                </Card>
              )}

              {duplicates.map(({ notice, similarity }) => (
                <Card key={notice.id} glass style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{notice.title}</h3>
                    <div
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: similarity > 70 ? 'rgba(239,68,68,0.15)' : similarity > 50 ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                        color: similarity > 70 ? 'var(--color-danger)' : similarity > 50 ? 'var(--color-warning)' : 'var(--color-success)',
                      }}
                    >
                      {similarity}% Match
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Badge variant="category">{notice.category}</Badge>
                    <Badge priority={notice.priority} />
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {notice.description.slice(0, 150)}...
                  </p>
                  <div style={{ marginTop: '0.75rem' }}>
                    <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${similarity}%`,
                          borderRadius: '999px',
                          background: similarity > 70 ? 'var(--color-danger)' : similarity > 50 ? 'var(--color-warning)' : 'var(--color-success)',
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

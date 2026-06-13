import { useState } from 'react';
import { User, Mail, Hash, Phone, Building2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BRANCHES, SECTIONS, YEARS } from '../services/mockData';
import { StudentLayout } from '../routes/ProtectedRoute';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    enrollmentNumber: user?.enrollmentNumber || '',
    branch: user?.branch || '',
    section: user?.section || '',
    year: user?.year || '',
    whatsapp: user?.whatsapp || '',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <StudentLayout title="Profile">
      <div className="page-container" style={{ maxWidth: '700px' }}>
        <div className="page-header">
          <h1>Student Profile</h1>
          <p>Manage your account information</p>
        </div>

        <Card glass>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.75rem', fontWeight: 800 }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem' }}>{user?.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{user?.email}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user?.branch} • {user?.year} • Section {user?.section}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} icon={<User size={18} />} required />
            <Input label="College Email" name="email" type="email" value={form.email} onChange={handleChange} icon={<Mail size={18} />} disabled />
            <Input label="Enrollment Number" name="enrollmentNumber" value={form.enrollmentNumber} onChange={handleChange} icon={<Hash size={18} />} disabled />

            <div className="input-group">
              <label className="input-label">Branch</label>
              <select name="branch" value={form.branch} onChange={handleChange} className="select-field">
                {BRANCHES.filter((b) => b !== 'All Branches').map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="grid-2" style={{ gap: '0' }}>
              <div className="input-group">
                <label className="input-label">Section</label>
                <select name="section" value={form.section} onChange={handleChange} className="select-field">
                  {SECTIONS.filter((s) => s !== 'All Sections').map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Year</label>
                <select name="year" value={form.year} onChange={handleChange} className="select-field">
                  {YEARS.filter((y) => y !== 'All Years').map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <Input label="WhatsApp Number" name="whatsapp" value={form.whatsapp} onChange={handleChange} icon={<Phone size={18} />} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <Button type="submit" icon={<Save size={18} />}>Save Changes</Button>
              {saved && <span style={{ color: 'var(--color-success)', fontSize: '0.9rem', fontWeight: 600 }}>Profile updated!</span>}
            </div>
          </form>
        </Card>

        <Card glass style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={18} /> Academic Info
          </h3>
          <div className="grid-2">
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Branch</span>
              <p style={{ fontWeight: 600 }}>{user?.branch}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enrollment</span>
              <p style={{ fontWeight: 600 }}>{user?.enrollmentNumber}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Year</span>
              <p style={{ fontWeight: 600 }}>{user?.year}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Section</span>
              <p style={{ fontWeight: 600 }}>{user?.section}</p>
            </div>
          </div>
        </Card>
      </div>
    </StudentLayout>
  );
}

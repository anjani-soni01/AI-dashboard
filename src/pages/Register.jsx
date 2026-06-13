import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Hash, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BRANCHES, SECTIONS, YEARS } from '../services/mockData';
import AuthLayout, { AuthFooterLink } from '../layouts/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const initialForm = {
  name: '',
  email: '',
  enrollmentNumber: '',
  branch: '',
  section: '',
  year: '',
  whatsapp: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email format';
    else if (!form.email.includes('college') && !form.email.includes('edu')) newErrors.email = 'Use your college email';
    if (!form.enrollmentNumber.trim()) newErrors.enrollmentNumber = 'Enrollment number is required';
    if (!form.branch) newErrors.branch = 'Select your branch';
    if (!form.section) newErrors.section = 'Select your section';
    if (!form.year) newErrors.year = 'Select your year';
    if (!form.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp number is required';
    else if (!/^\d{10}$/.test(form.whatsapp.replace(/\D/g, '').slice(-10))) newErrors.whatsapp = 'Enter valid 10-digit number';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = register(form);
    setLoading(false);

    if (result.success) {
      navigate('/login');
    } else {
      setErrors({ general: result.error });
    }
  };

  return (
    <AuthLayout title="NoticeBoard AI" subtitle="Create your student account">
      <form onSubmit={handleSubmit}>
        {errors.general && (
          <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)', borderRadius: 'var(--border-radius)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {errors.general}
          </div>
        )}

        <Input label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" icon={<User size={18} />} error={errors.name} required />
        <Input label="College Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="student@college.edu" icon={<Mail size={18} />} error={errors.email} required />
        <Input label="Enrollment Number" name="enrollmentNumber" value={form.enrollmentNumber} onChange={handleChange} placeholder="EN2024001" icon={<Hash size={18} />} error={errors.enrollmentNumber} required />

        <div className="input-group">
          <label className="input-label">Branch <span className="input-required">*</span></label>
          <select name="branch" value={form.branch} onChange={handleChange} className="select-field">
            <option value="">Select Branch</option>
            {BRANCHES.filter((b) => b !== 'All Branches').map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          {errors.branch && <span className="input-error-text">{errors.branch}</span>}
        </div>

        <div className="grid-2" style={{ gap: '0' }}>
          <div className="input-group">
            <label className="input-label">Section <span className="input-required">*</span></label>
            <select name="section" value={form.section} onChange={handleChange} className="select-field">
              <option value="">Select</option>
              {SECTIONS.filter((s) => s !== 'All Sections').map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.section && <span className="input-error-text">{errors.section}</span>}
          </div>
          <div className="input-group">
            <label className="input-label">Year <span className="input-required">*</span></label>
            <select name="year" value={form.year} onChange={handleChange} className="select-field">
              <option value="">Select</option>
              {YEARS.filter((y) => y !== 'All Years').map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            {errors.year && <span className="input-error-text">{errors.year}</span>}
          </div>
        </div>

        <Input label="WhatsApp Number" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="9876543210" icon={<Phone size={18} />} error={errors.whatsapp} required />

        <div className="input-group">
          <label className="input-label">Password <span className="input-required">*</span></label>
          <div className="input-wrapper has-icon">
            <span className="input-icon"><Lock size={18} /></span>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              className="input-field"
              style={{ paddingRight: '2.75rem' }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <span className="input-error-text">{errors.password}</span>}
        </div>

        <Input label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm password" icon={<Lock size={18} />} error={errors.confirmPassword} required />

        <Button type="submit" fullWidth disabled={loading} style={{ marginTop: '0.5rem' }}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <AuthFooterLink text="Already have an account?" linkText="Sign In" to="/login" />
    </AuthLayout>
  );
}

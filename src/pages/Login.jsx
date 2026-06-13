import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getItem, STORAGE_KEYS } from '../services/storage';
import AuthLayout, { AuthFooterLink } from '../layouts/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const remembered = getItem(STORAGE_KEYS.REMEMBER_ME);

  const [form, setForm] = useState({
    email: remembered?.email || '',
    password: '',
    rememberMe: !!remembered,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = login(form.email, form.password, form.rememberMe);
    setLoading(false);

    if (result.success) {
      navigate(result.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <AuthLayout title="NoticeBoard AI" subtitle="Sign in to your account">
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)', borderRadius: 'var(--border-radius)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="student@college.edu"
          icon={<Mail size={18} />}
          required
        />

        <div className="input-group">
          <label className="input-label" htmlFor="password">Password <span className="input-required">*</span></label>
          <div className="input-wrapper has-icon">
            <span className="input-icon"><Lock size={18} /></span>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="input-field"
              style={{ paddingRight: '2.75rem' }}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '0.75rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={form.rememberMe}
            onChange={handleChange}
            style={{ accentColor: 'var(--color-primary)' }}
          />
          <label htmlFor="rememberMe" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Remember me
          </label>
        </div>

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Admin: admin@college.edu / admin123
        </p>
      </form>

      <AuthFooterLink text="Don't have an account?" linkText="Register" to="/register" />
    </AuthLayout>
  );
}

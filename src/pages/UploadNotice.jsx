import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText } from 'lucide-react';
import { useNotices } from '../context/NoticeContext';
import { BRANCHES, SECTIONS, YEARS, CATEGORIES, DEPARTMENTS, PRIORITIES } from '../services/mockData';
import { AdminLayout } from '../routes/ProtectedRoute';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const initialForm = {
  title: '',
  description: '',
  category: '',
  department: '',
  priority: 'medium',
  deadline: '',
  mandatory: false,
  branches: [],
  years: [],
  sections: [],
  pdfName: '',
};

export default function UploadNotice() {
  const navigate = useNavigate();
  const { addNotice } = useNotices();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMultiSelect = (field, value) => {
    setForm((prev) => {
      const current = prev[field];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [field]: updated };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, pdfName: file.name }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.category) newErrors.category = 'Select a category';
    if (!form.department) newErrors.department = 'Select a department';
    if (!form.deadline) newErrors.deadline = 'Deadline is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const notice = {
      title: form.title,
      description: form.description,
      category: form.category,
      department: form.department,
      priority: form.priority,
      deadline: form.deadline,
      mandatory: form.mandatory,
      branches: form.branches.length ? form.branches : ['All Branches'],
      years: form.years.length ? form.years : ['All Years'],
      sections: form.sections.length ? form.sections : ['All Sections'],
      attachments: form.pdfName ? [{ name: form.pdfName, url: '#' }] : [],
      eligibility: '',
      additionalDetails: '',
    };

    addNotice(notice);
    setSuccess(true);
    setTimeout(() => {
      navigate('/admin');
    }, 1500);
  };

  return (
    <AdminLayout title="Upload Notice">
      <div className="page-container" style={{ maxWidth: '800px' }}>
        <div className="page-header">
          <h1>Upload Notice</h1>
          <p>Create and publish a new college notice</p>
        </div>

        {success && (
          <div style={{ padding: '0.75rem', background: 'rgba(16,185,129,0.1)', color: 'var(--color-success)', borderRadius: 'var(--border-radius)', marginBottom: '1rem', fontWeight: 600 }}>
            Notice published successfully! Redirecting...
          </div>
        )}

        <Card glass>
          <form onSubmit={handleSubmit}>
            <Input label="Title" name="title" value={form.title} onChange={handleChange} placeholder="Notice title" icon={<FileText size={18} />} error={errors.title} required />

            <div className="input-group">
              <label className="input-label">Description <span className="input-required">*</span></label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Full notice description..." className="textarea-field" rows={5} />
              {errors.description && <span className="input-error-text">{errors.description}</span>}
            </div>

            <div className="grid-2" style={{ gap: '0' }}>
              <div className="input-group">
                <label className="input-label">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="select-field">
                  <option value="">Select Category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <span className="input-error-text">{errors.category}</span>}
              </div>
              <div className="input-group">
                <label className="input-label">Department</label>
                <select name="department" value={form.department} onChange={handleChange} className="select-field">
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.department && <span className="input-error-text">{errors.department}</span>}
              </div>
            </div>

            <div className="grid-2" style={{ gap: '0' }}>
              <div className="input-group">
                <label className="input-label">Priority</label>
                <select name="priority" value={form.priority} onChange={handleChange} className="select-field">
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Deadline</label>
                <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className="input-field" />
                {errors.deadline && <span className="input-error-text">{errors.deadline}</span>}
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">PDF Upload</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="file" accept=".pdf" onChange={handleFileChange} style={{ fontSize: '0.85rem' }} />
                {form.pdfName && <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{form.pdfName}</span>}
              </div>
            </div>

            <div className="input-group">
              <label className="checkbox-item">
                <input type="checkbox" name="mandatory" checked={form.mandatory} onChange={handleChange} />
                Mandatory Notice
              </label>
            </div>

            <div className="input-group">
              <label className="input-label">Branch Selection</label>
              <div className="checkbox-group">
                {BRANCHES.map((b) => (
                  <label key={b} className="checkbox-item">
                    <input type="checkbox" checked={form.branches.includes(b)} onChange={() => handleMultiSelect('branches', b)} />
                    {b}
                  </label>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Year Selection</label>
              <div className="checkbox-group">
                {YEARS.map((y) => (
                  <label key={y} className="checkbox-item">
                    <input type="checkbox" checked={form.years.includes(y)} onChange={() => handleMultiSelect('years', y)} />
                    {y}
                  </label>
                ))}
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Section Selection</label>
              <div className="checkbox-group">
                {SECTIONS.map((s) => (
                  <label key={s} className="checkbox-item">
                    <input type="checkbox" checked={form.sections.includes(s)} onChange={() => handleMultiSelect('sections', s)} />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" icon={<Upload size={18} />} size="lg">Publish Notice</Button>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );
}

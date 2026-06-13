import { BRANCHES, CATEGORIES, PRIORITIES } from '../../services/mockData';
import './NoticeFilters.css';

export default function NoticeFilters({ filters, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="notice-filters">
      <div className="notice-filter-group">
        <label className="notice-filter-label">Branch</label>
        <select
          className="select-field"
          value={filters.branch}
          onChange={(e) => handleChange('branch', e.target.value)}
        >
          <option value="">All Branches</option>
          {BRANCHES.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="notice-filter-group">
        <label className="notice-filter-label">Category</label>
        <select
          className="select-field"
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="notice-filter-group">
        <label className="notice-filter-label">Priority</label>
        <select
          className="select-field"
          value={filters.priority}
          onChange={(e) => handleChange('priority', e.target.value)}
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

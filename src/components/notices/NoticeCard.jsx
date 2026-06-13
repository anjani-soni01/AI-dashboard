import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Building2, Bookmark, BookmarkCheck, Eye } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { useNotices } from '../../context/NoticeContext';
import './NoticeCard.css';

export default function NoticeCard({ notice, showActions = true }) {
  const navigate = useNavigate();
  const { toggleBookmark, markAsRead, isBookmarked, isRead } = useNotices();
  const bookmarked = isBookmarked(notice.id);
  const read = isRead(notice.id);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleClick = () => {
    markAsRead(notice.id);
    navigate(`/notice/${notice.id}`);
  };

  return (
    <Card className={`notice-card ${read ? 'notice-read' : ''}`} hover onClick={handleClick}>
      <div className="notice-card-header">
        <div className="notice-card-badges">
          <Badge priority={notice.priority} />
          <Badge variant="category">{notice.category}</Badge>
          {notice.mandatory && <Badge variant="mandatory">Mandatory</Badge>}
        </div>
        {showActions && (
          <button
            className="notice-bookmark-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(notice.id);
            }}
            aria-label="Bookmark"
          >
            {bookmarked ? <BookmarkCheck size={18} color="var(--color-primary)" /> : <Bookmark size={18} />}
          </button>
        )}
      </div>

      <h3 className="notice-card-title">{notice.title}</h3>

      <div className="notice-card-meta">
        <span className="notice-meta-item">
          <Building2 size={14} />
          {notice.department}
        </span>
        <span className="notice-meta-item">
          <Calendar size={14} />
          {formatDate(notice.date)}
        </span>
        <span className="notice-meta-item notice-deadline">
          <Clock size={14} />
          Due: {formatDate(notice.deadline)}
        </span>
      </div>

      <p className="notice-card-desc">{notice.description.slice(0, 120)}...</p>

      {notice.views && (
        <div className="notice-card-footer">
          <span className="notice-views">
            <Eye size={14} />
            {notice.views} views
          </span>
          {read && <span className="notice-read-badge">Read</span>}
        </div>
      )}
    </Card>
  );
}

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getItem, setItem, STORAGE_KEYS } from '../services/storage';
import { DEFAULT_NOTICES } from '../services/mockData';

const NoticeContext = createContext(null);

export function NoticeProvider({ children }) {
  const [notices, setNotices] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [readNotices, setReadNotices] = useState([]);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const stored = getItem(STORAGE_KEYS.NOTICES);
    setNotices(stored || DEFAULT_NOTICES);
    setBookmarks(getItem(STORAGE_KEYS.BOOKMARKS, []));
    setReadNotices(getItem(STORAGE_KEYS.READ_NOTICES, []));
    setReminders(getItem(STORAGE_KEYS.REMINDERS, []));
  }, []);

  const persistNotices = useCallback((updated) => {
    setNotices(updated);
    setItem(STORAGE_KEYS.NOTICES, updated);
  }, []);

  const addNotice = useCallback((notice) => {
    const newNotice = {
      ...notice,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      views: 0,
    };
    const updated = [newNotice, ...notices];
    persistNotices(updated);
    return newNotice;
  }, [notices, persistNotices]);

  const getNoticeById = useCallback(
    (id) => notices.find((n) => n.id === id),
    [notices]
  );

  const incrementViews = useCallback(
    (id) => {
      const updated = notices.map((n) =>
        n.id === id ? { ...n, views: (n.views || 0) + 1 } : n
      );
      persistNotices(updated);
    },
    [notices, persistNotices]
  );

  const toggleBookmark = useCallback((id) => {
    setBookmarks((prev) => {
      const updated = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
      setItem(STORAGE_KEYS.BOOKMARKS, updated);
      return updated;
    });
  }, []);

  const markAsRead = useCallback((id) => {
    setReadNotices((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      setItem(STORAGE_KEYS.READ_NOTICES, updated);
      return updated;
    });
  }, []);

  const addReminder = useCallback((noticeId, reminderDate) => {
    const reminder = {
      id: Date.now().toString(),
      noticeId,
      reminderDate,
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    setReminders((prev) => {
      const updated = [...prev, reminder];
      setItem(STORAGE_KEYS.REMINDERS, updated);
      return updated;
    });
    return reminder;
  }, []);

  const getPersonalizedNotices = useCallback(
    (user) => {
      if (!user) return notices;
      return notices.filter((n) => {
        const branchMatch =
          n.branches.includes('All Branches') || n.branches.includes(user.branch);
        const yearMatch = n.years.includes('All Years') || n.years.includes(user.year);
        const sectionMatch =
          n.sections.includes('All Sections') || n.sections.includes(user.section);
        return branchMatch && yearMatch && sectionMatch;
      });
    },
    [notices]
  );

  const getStats = useCallback(
    (user) => {
      const personalized = getPersonalizedNotices(user);
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      return {
        total: personalized.length,
        important: personalized.filter((n) => n.priority === 'high' || n.mandatory).length,
        upcomingDeadlines: personalized.filter((n) => {
          const deadline = new Date(n.deadline);
          return deadline >= now && deadline <= weekFromNow;
        }).length,
        read: personalized.filter((n) => readNotices.includes(n.id)).length,
      };
    },
    [getPersonalizedNotices, readNotices]
  );

  return (
    <NoticeContext.Provider
      value={{
        notices,
        bookmarks,
        readNotices,
        reminders,
        addNotice,
        getNoticeById,
        incrementViews,
        toggleBookmark,
        markAsRead,
        addReminder,
        getPersonalizedNotices,
        getStats,
        isBookmarked: (id) => bookmarks.includes(id),
        isRead: (id) => readNotices.includes(id),
      }}
    >
      {children}
    </NoticeContext.Provider>
  );
}

export function useNotices() {
  const context = useContext(NoticeContext);
  if (!context) throw new Error('useNotices must be used within NoticeProvider');
  return context;
}

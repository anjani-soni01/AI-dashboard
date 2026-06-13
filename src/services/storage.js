const STORAGE_KEYS = {
  STUDENTS: 'noticeboard_students',
  SESSION: 'noticeboard_session',
  NOTICES: 'noticeboard_notices',
  REMINDERS: 'noticeboard_reminders',
  BOOKMARKS: 'noticeboard_bookmarks',
  READ_NOTICES: 'noticeboard_read',
  THEME: 'noticeboard_theme',
  REMEMBER_ME: 'noticeboard_remember',
  ANALYTICS: 'noticeboard_analytics',
};

export function getItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key) {
  localStorage.removeItem(key);
}

export { STORAGE_KEYS };

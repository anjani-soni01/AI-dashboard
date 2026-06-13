import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getItem, setItem, STORAGE_KEYS } from '../services/storage';
import { ADMIN_CREDENTIALS } from '../services/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getItem(STORAGE_KEYS.SESSION);
    if (session) {
      setUser(session);
    }
    setLoading(false);
  }, []);

  const login = useCallback((email, password, rememberMe = false) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminUser = {
        id: 'admin',
        name: 'Administrator',
        email: ADMIN_CREDENTIALS.email,
        role: 'admin',
      };
      setUser(adminUser);
      setItem(STORAGE_KEYS.SESSION, adminUser);
      if (rememberMe) setItem(STORAGE_KEYS.REMEMBER_ME, { email, role: 'admin' });
      return { success: true, role: 'admin' };
    }

    const students = getItem(STORAGE_KEYS.STUDENTS, []);
    const student = students.find((s) => s.email === email && s.password === password);

    if (student) {
      const { password: _, ...safeUser } = student;
      const sessionUser = { ...safeUser, role: 'student' };
      setUser(sessionUser);
      setItem(STORAGE_KEYS.SESSION, sessionUser);
      if (rememberMe) setItem(STORAGE_KEYS.REMEMBER_ME, { email, role: 'student' });
      return { success: true, role: 'student' };
    }

    return { success: false, error: 'Invalid email or password' };
  }, []);

  const register = useCallback((studentData) => {
    const students = getItem(STORAGE_KEYS.STUDENTS, []);
    const exists = students.some((s) => s.email === studentData.email || s.enrollmentNumber === studentData.enrollmentNumber);

    if (exists) {
      return { success: false, error: 'Email or enrollment number already registered' };
    }

    const newStudent = {
      id: Date.now().toString(),
      ...studentData,
      createdAt: new Date().toISOString(),
    };

    students.push(newStudent);
    setItem(STORAGE_KEYS.STUDENTS, students);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    removeSession();
  }, []);

  const updateProfile = useCallback((updates) => {
    if (!user || user.role !== 'student') return;

    const students = getItem(STORAGE_KEYS.STUDENTS, []);
    const index = students.findIndex((s) => s.id === user.id);
    if (index === -1) return;

    students[index] = { ...students[index], ...updates };
    setItem(STORAGE_KEYS.STUDENTS, students);

    const { password: _, ...safeUser } = students[index];
    const sessionUser = { ...safeUser, role: 'student' };
    setUser(sessionUser);
    setItem(STORAGE_KEYS.SESSION, sessionUser);
  }, [user]);

  const getAllStudents = useCallback(() => {
    return getItem(STORAGE_KEYS.STUDENTS, []);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, getAllStudents }}>
      {children}
    </AuthContext.Provider>
  );
}

function removeSession() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

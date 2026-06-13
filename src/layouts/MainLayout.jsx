import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './MainLayout.css';

export default function MainLayout({ children, title, variant = 'student' }) {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <LoadingSpinner size="lg" text="Loading..." />;

  if (!user) return <Navigate to="/login" replace />;

  if (variant === 'student' && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (variant === 'admin' && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        variant={variant}
      />
      <div className="layout-main">
        <Navbar onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="layout-content">{children}</main>
      </div>
    </div>
  );
}

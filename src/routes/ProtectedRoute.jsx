import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
}

export function StudentLayout({ children, title }) {
  return (
    <ProtectedRoute role="student">
      <MainLayout title={title} variant="student">{children}</MainLayout>
    </ProtectedRoute>
  );
}

export function AdminLayout({ children, title }) {
  return (
    <ProtectedRoute role="admin">
      <MainLayout title={title} variant="admin">{children}</MainLayout>
    </ProtectedRoute>
  );
}

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Notices from '../pages/Notices';
import NoticeDetails from '../pages/NoticeDetails';
import Summary from '../pages/Summary';
import Reminders from '../pages/Reminders';
import Chatbot from '../pages/Chatbot';
import Profile from '../pages/Profile';
import AdminDashboard from '../pages/AdminDashboard';
import UploadNotice from '../pages/UploadNotice';
import Analytics from '../pages/Analytics';
import DuplicateNotice from '../pages/DuplicateNotice';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/notice/:id" element={<NoticeDetails />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/upload" element={<UploadNotice />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/duplicates" element={<DuplicateNotice />} />
      </Routes>
    </BrowserRouter>
  );
}

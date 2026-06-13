import { Link } from 'react-router-dom';
import { Sparkles, FileText, Bell, MessageSquare, Shield, Zap } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ThemeToggle from '../components/common/ThemeToggle';
import '../layouts/MainLayout.css';

const features = [
  {
    icon: FileText,
    title: 'Smart Notices',
    description: 'Personalized notices filtered by your branch, year, and section.',
  },
  {
    icon: Sparkles,
    title: 'AI Summaries',
    description: 'Get instant AI-generated summaries of lengthy notices and documents.',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Never miss deadlines with intelligent countdown reminders.',
  },
  {
    icon: MessageSquare,
    title: 'AI Chatbot',
    description: 'Ask questions about exams, placements, scholarships, and events.',
  },
  {
    icon: Shield,
    title: 'Admin Portal',
    description: 'Comprehensive admin dashboard with analytics and duplicate detection.',
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Stay informed with the latest announcements as they happen.',
  },
];

export default function Landing() {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-nav-logo gradient-text">
          <Sparkles size={24} />
          NoticeBoard AI
        </div>
        <div className="landing-nav-links">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Register</Button>
          </Link>
        </div>
      </nav>

      <section className="landing-hero animate-fade-in">
        <h1>
          Your <span className="gradient-text">AI-Powered</span>
          <br />College Noticeboard
        </h1>
        <p>
          Stay ahead with intelligent notice management, AI summaries, smart reminders,
          and an interactive chatbot — all in one modern college portal.
        </p>
        <div className="landing-hero-actions">
          <Link to="/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">Student Login</Button>
          </Link>
        </div>
      </section>

      <section className="landing-features">
        <h2>Everything You Need</h2>
        <div className="landing-features-grid">
          {features.map((feature, i) => (
            <Card key={i} className={`landing-feature-card animate-fade-in-up stagger-${i + 1}`} glass>
              <div className="landing-feature-icon">
                <feature.icon size={28} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        © 2026 NoticeBoard AI — AI-Powered College Noticeboard System
      </footer>
    </div>
  );
}

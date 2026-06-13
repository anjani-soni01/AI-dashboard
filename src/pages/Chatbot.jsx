import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { useNotices } from '../context/NoticeContext';
import { getChatbotResponse } from '../services/aiService';
import { StudentLayout } from '../routes/ProtectedRoute';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const SUGGESTED = [
  'What are the upcoming exams?',
  'Scholarship form deadlines?',
  'Placement drive dates?',
];

export default function Chatbot() {
  const { notices } = useNotices();
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "Hello! I'm your AI Noticeboard Assistant. I can help you search notices, answer FAQs about exams, placements, scholarships, and events. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const response = getChatbotResponse(text, notices);
      setMessages((prev) => [...prev, { role: 'bot', content: response }]);
      setTyping(false);
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <StudentLayout title="AI Chatbot">
      <div className="page-container" style={{ maxWidth: '900px' }}>
        <div className="page-header">
          <h1>AI Chatbot</h1>
          <p>Search notices, get FAQs, and ask questions</p>
        </div>

        <Card glass style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 220px)', minHeight: '400px', padding: '0' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: msg.role === 'user' ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                    color: msg.role === 'user' ? 'white' : 'var(--color-secondary)',
                  }}
                >
                  {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--border-radius-lg)',
                    background: msg.role === 'user' ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)', color: 'var(--color-secondary)' }}>
                  <Bot size={18} />
                </div>
                <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-lg)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Thinking...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.8rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '999px',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all var(--transition)',
                  }}
                  onMouseEnter={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.color = 'var(--color-primary)'; }}
                  onMouseLeave={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.color = 'var(--text-secondary)'; }}
                >
                  {q}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about exams, placements, scholarships..."
                className="input-field"
                style={{ flex: 1 }}
              />
              <Button type="submit" icon={<Send size={18} />} disabled={!input.trim()}>
                Send
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </StudentLayout>
  );
}

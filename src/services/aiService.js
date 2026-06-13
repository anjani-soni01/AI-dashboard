export function generateSummary(notice) {
  if (!notice) return '';

  const parts = [
    `📋 ${notice.title}`,
    '',
    `⏰ Deadline: ${formatDate(notice.deadline)}`,
    `🏛️ Department: ${notice.department}`,
    `📂 Category: ${notice.category}`,
    '',
    notice.eligibility ? `✅ Eligibility: ${notice.eligibility}` : '',
    '',
    '📝 Summary:',
    truncateText(notice.description, 200),
    '',
    notice.additionalDetails ? `ℹ️ Note: ${notice.additionalDetails}` : '',
  ];

  return parts.filter(Boolean).join('\n');
}

export function detectDuplicates(notice, allNotices) {
  if (!notice) return [];

  return allNotices
    .filter((n) => n.id !== notice.id)
    .map((n) => ({
      notice: n,
      similarity: calculateSimilarity(notice, n),
    }))
    .filter((item) => item.similarity > 30)
    .sort((a, b) => b.similarity - a.similarity);
}

export function getChatbotResponse(message, notices) {
  const lower = message.toLowerCase();

  if (lower.includes('exam') || lower.includes('examination')) {
    const examNotices = notices.filter((n) => n.category === 'Exam' || n.title.toLowerCase().includes('exam'));
    if (examNotices.length > 0) {
      return `Found ${examNotices.length} exam-related notice(s):\n\n${examNotices.map((n) => `• ${n.title} (Deadline: ${formatDate(n.deadline)})`).join('\n')}`;
    }
    return 'No exam notices found at the moment. Check back later!';
  }

  if (lower.includes('scholarship') || lower.includes('form')) {
    const schol = notices.filter((n) => n.category === 'Scholarship');
    if (schol.length > 0) {
      return `Scholarship notices:\n\n${schol.map((n) => `• ${n.title}\n  Deadline: ${formatDate(n.deadline)}\n  Eligibility: ${n.eligibility || 'See notice for details'}`).join('\n\n')}`;
    }
    return 'No scholarship notices available currently.';
  }

  if (lower.includes('placement') || lower.includes('drive') || lower.includes('job')) {
    const placements = notices.filter((n) => n.category === 'Placement');
    if (placements.length > 0) {
      return `Placement opportunities:\n\n${placements.map((n) => `• ${n.title}\n  Date: ${formatDate(n.deadline)}\n  Branches: ${n.branches.join(', ')}`).join('\n\n')}`;
    }
    return 'No placement drives scheduled at the moment.';
  }

  if (lower.includes('event') || lower.includes('fest')) {
    const events = notices.filter((n) => n.category === 'Event' || n.category === 'Club');
    if (events.length > 0) {
      return `Upcoming events:\n\n${events.map((n) => `• ${n.title} - ${formatDate(n.deadline)}`).join('\n')}`;
    }
    return 'No events listed currently.';
  }

  const searchTerm = lower.replace(/[^a-z0-9\s]/g, '');
  const matched = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm) ||
      n.description.toLowerCase().includes(searchTerm) ||
      n.category.toLowerCase().includes(searchTerm)
  );

  if (matched.length > 0) {
    return `Found ${matched.length} matching notice(s):\n\n${matched.slice(0, 5).map((n) => `• ${n.title} (${n.category})`).join('\n')}`;
  }

  return "I can help you search notices, answer FAQs about exams, placements, scholarships, and events. Try asking:\n• What are the upcoming exams?\n• Scholarship form deadlines?\n• Placement drive dates?";
}

function calculateSimilarity(a, b) {
  const textA = `${a.title} ${a.description}`.toLowerCase();
  const textB = `${b.title} ${b.description}`.toLowerCase();

  const wordsA = new Set(textA.split(/\s+/).filter((w) => w.length > 3));
  const wordsB = new Set(textB.split(/\s+/).filter((w) => w.length > 3));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let common = 0;
  wordsA.forEach((w) => {
    if (wordsB.has(w)) common++;
  });

  const titleMatch = a.title.toLowerCase() === b.title.toLowerCase() ? 50 : 0;
  const categoryMatch = a.category === b.category ? 15 : 0;
  const wordScore = Math.round((common / Math.max(wordsA.size, wordsB.size)) * 100);

  return Math.min(100, wordScore + titleMatch + categoryMatch);
}

function truncateText(text, max) {
  if (!text) return '';
  return text.length <= max ? text : text.slice(0, max) + '...';
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

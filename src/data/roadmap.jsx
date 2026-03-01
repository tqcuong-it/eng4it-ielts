/**
 * IELTS 6.0 Roadmap — 10 tháng (03/2026 → 12/2026)
 * 40 tuần, 4 giai đoạn
 */

export const roadmap = {
  target: 'IELTS 6.0',
  startDate: '2026-03-05',
  examDate: '2026-12-31',
  totalWeeks: 40,

  phases: [
    {
      id: 'phase-1',
      title: 'Nền tảng',
      subtitle: 'Grammar cơ bản + 1,500 từ vựng',
      icon: '🟢',
      months: 'Tháng 3–5',
      weeks: [1, 12],
      skills: [
        'Present Simple, Continuous, Past, Future, Present Perfect',
        'Articles, Prepositions, Countable/Uncountable',
        'Comparatives, Passive, Conditionals, Modal verbs',
        '1,500 từ vựng thông dụng',
        'Nghe hiểu câu đơn giản',
      ],
      milestone: 'Nắm vững grammar cơ bản, đọc hiểu đoạn 200-300 từ',
    },
    {
      id: 'phase-2',
      title: 'Xây dựng kỹ năng',
      subtitle: '4 kỹ năng IELTS + 3,000 từ',
      icon: '🔵',
      months: 'Tháng 6–8',
      weeks: [13, 24],
      skills: [
        'Làm quen format IELTS (Listening, Reading, Writing, Speaking)',
        'Reading: đoạn văn 500+ từ',
        'Writing: Task 1 (biểu đồ) + Task 2 (essay)',
        'Speaking: Part 1, 2, 3',
        '3,000 từ vựng',
      ],
      milestone: 'Hoàn thành được 1 bài thi thử đầy đủ',
    },
    {
      id: 'phase-3',
      title: 'Luyện thi',
      subtitle: 'Practice test + chiến thuật',
      icon: '🟡',
      months: 'Tháng 9–11',
      weeks: [25, 36],
      skills: [
        'Full practice test trong thời gian quy định',
        'Chiến thuật Listening: đọc trước câu hỏi, gạch keywords',
        'Chiến thuật Reading: skim + scan, 20 phút/passage',
        'Writing template + time management',
        'Speaking: trả lời tự nhiên, đưa ý kiến',
      ],
      milestone: 'Mock test đạt 5.5+',
    },
    {
      id: 'phase-4',
      title: 'Sprint cuối',
      subtitle: 'Mock test + ôn tập tổng',
      icon: '🔴',
      months: 'Tháng 12',
      weeks: [37, 40],
      skills: [
        'Mock test 2 ngày/lần',
        'Review kỹ mỗi lỗi sai',
        'Tập trung kỹ năng yếu nhất',
        'Ôn từ vựng + template Writing',
        'ĐĂNG KÝ THI IELTS! 🎯',
      ],
      milestone: 'Sẵn sàng thi — mục tiêu 6.0!',
    },
  ],
}

// Calculate current week number (1-indexed) from start date
export function getCurrentWeek() {
  const start = new Date('2026-03-05')
  const now = new Date()
  if (now < start) return 0
  const diffMs = now - start
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1
  return Math.min(diffWeeks, 40)
}

// Calculate overall progress percentage
export function getOverallProgress(currentWeek) {
  if (currentWeek <= 0) return 0
  return Math.round((currentWeek / 40) * 100)
}

// Get current phase based on week
export function getCurrentPhase(currentWeek) {
  if (currentWeek <= 0) return null
  for (const phase of roadmap.phases) {
    if (currentWeek >= phase.weeks[0] && currentWeek <= phase.weeks[1]) {
      return phase
    }
  }
  return roadmap.phases[3] // past week 40 = phase 4
}

// Days until exam
export function getDaysUntilExam() {
  const exam = new Date('2026-12-31')
  const now = new Date()
  const diff = Math.ceil((exam - now) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

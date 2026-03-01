/**
 * IELTS 6.0 Roadmap — dựa trên tiến độ thực tế
 * Không gắn tháng cố định — tùy tốc độ người học
 */

export const roadmap = {
  target: 'IELTS 6.0',
  totalWeeks: 40,

  phases: [
    {
      id: 'phase-1',
      title: 'Nền tảng',
      subtitle: 'Grammar cơ bản + 1,500 từ vựng',
      icon: '🟢',
      duration: '~12 tuần',
      weeks: [1, 12],
      skills: [
        'Present Simple, Continuous, Past, Future, Present Perfect',
        'Articles, Prepositions, Countable/Uncountable',
        'Comparatives, Passive, Conditionals, Modal verbs',
        '1,500 từ vựng thông dụng',
        'Nghe hiểu câu đơn giản',
      ],
      milestone: 'Nắm vững grammar cơ bản, đọc hiểu đoạn 200–300 từ',
    },
    {
      id: 'phase-2',
      title: 'Xây dựng kỹ năng',
      subtitle: '4 kỹ năng IELTS + 3,000 từ',
      icon: '🔵',
      duration: '~12 tuần',
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
      duration: '~12 tuần',
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
      duration: '~4 tuần',
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

/**
 * Calculate progress based on completed weeks (from user's lesson data)
 * completedWeeks = number of weeks where all required exercises are done
 */
export function getProgressFromWeeks(completedWeeks) {
  return Math.min(100, Math.round((completedWeeks / 40) * 100))
}

/**
 * Get current phase based on completed weeks
 */
export function getPhaseFromWeeks(completedWeeks) {
  if (completedWeeks <= 0) return roadmap.phases[0]
  for (const phase of roadmap.phases) {
    if (completedWeeks < phase.weeks[1]) {
      return phase
    }
  }
  return roadmap.phases[3]
}

/**
 * Get phase progress percentage
 */
export function getPhaseProgress(phase, completedWeeks) {
  if (completedWeeks >= phase.weeks[1]) return 100
  if (completedWeeks < phase.weeks[0]) return 0
  const phaseTotal = phase.weeks[1] - phase.weeks[0] + 1
  const weeksIn = completedWeeks - phase.weeks[0] + 1
  return Math.round((weeksIn / phaseTotal) * 100)
}

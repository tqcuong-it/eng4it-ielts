import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { useProgress } from '../hooks/useProgress.jsx'
import { Link } from 'react-router-dom'
import { weeksIndex, PHASE_NAMES } from '../data/weeks-index.jsx'
import { getWeekData, hasWeekData } from '../data/loader.jsx'
import { getProgressFromWeeks, getPhaseFromWeeks } from '../data/roadmap.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { lessonProgress, isLessonUnlocked, getExerciseStatus, isDayCompleted, getStats, getDueWords } = useProgress()
  const stats = getStats()
  const dueWords = getDueWords()
  
  // Count completed weeks dynamically
  const completedWeeks = weeksIndex.filter(w => {
    const data = getWeekData(w.id)
    if (!data) return false
    return data.days.every(day => isDayCompleted(day.id))
  }).length
  const overallProgress = getProgressFromWeeks(completedWeeks)
  const currentPhase = getPhaseFromWeeks(completedWeeks)

  // Track which weeks and days are expanded
  const [expandedWeeks, setExpandedWeeks] = useState({ 'week-1': true })
  const [expandedDays, setExpandedDays] = useState({})
  const toggleWeek = (weekId) => {
    setExpandedWeeks(prev => ({ ...prev, [weekId]: !prev[weekId] }))
  }
  const toggleDay = (dayId) => {
    setExpandedDays(prev => ({ ...prev, [dayId]: !prev[dayId] }))
  }

  // Group weeks by phase
  const phases = [1, 2, 3, 4]


  // Check if a week's Day 1 should be unlocked
  const isWeekUnlocked = (weekId) => {
    // Week 1 always unlocked
    if (weekId === 'week-1') return true
    // Previous week must be completed
    const weekNum = parseInt(weekId.replace('week-', ''))
    const prevWeekId = `week-${weekNum - 1}`
    const prevWeekData = getWeekData(prevWeekId)
    if (!prevWeekData) return true // If prev week has no app data, unlock anyway
    // Check all days of previous week are completed
    return prevWeekData.days.every(d => isDayCompleted(`${prevWeekId}-${d.id}`))
  }

  // Render interactive day (any week with app data)
  const renderInteractiveDay = (day, index, weekId) => {
    const globalDayId = `${weekId}-${day.id}`
    const weekOpen = isWeekUnlocked(weekId)
    const unlocked = weekOpen && (index === 0 || isDayCompleted(`${weekId}-day-${index}`))
    const completed = isDayCompleted(globalDayId)
    const exStatus = getExerciseStatus(globalDayId)
    const requiredPassed = [exStatus.reading, exStatus.listening, exStatus.quiz].filter(Boolean).length
    let dayProgress = 0
    if (exStatus.vocab) dayProgress += 10
    if (exStatus.grammar) dayProgress += 10
    if (exStatus.reading) dayProgress += 27
    if (exStatus.listening) dayProgress += 27
    if (exStatus.quiz) dayProgress += 26
    const isExpanded = expandedDays[globalDayId] || false

    if (completed) {
      return (
        <div key={globalDayId} className="lesson-card passed collapsed" onClick={() => toggleDay(globalDayId)}>
          <div className="lesson-top">
            <div className="lesson-status">✅</div>
            <div className="lesson-info">
              <h3>{day.title}</h3>
              <p>{dayProgress}% · {requiredPassed}/3 bắt buộc</p>
            </div>
            <span className={`toggle-arrow ${isExpanded ? 'open' : ''}`}>›</span>
          </div>
          {isExpanded && renderExerciseLinks(day, globalDayId, exStatus)}
        </div>
      )
    }

    if (unlocked) {
      return (
        <div key={globalDayId} className="lesson-card">
          <div className="lesson-top">
            <div className="lesson-info">
              <h3>{day.title}</h3>
              <div className="day-progress-row">
                <span>{dayProgress}%</span>
                <div className="day-progress-bar">
                  <div className="day-progress-fill" style={{ width: `${dayProgress}%` }} />
                </div>
                <span>{requiredPassed}/3</span>
              </div>
              {day.blogUrl && (
                <a href={day.blogUrl} target="_blank" rel="noopener" className="blog-link">📖 Xem giáo án trên blog</a>
              )}
            </div>
          </div>
          {renderExerciseLinks(day, globalDayId, exStatus)}
        </div>
      )
    }

    return (
      <div key={globalDayId} className="lesson-card locked">
        <div className="lesson-top">
          <div className="lesson-status">🔒</div>
          <div className="lesson-info">
            <h3>{day.title}</h3>
            <p>Pass 3 bài bắt buộc của ngày trước để mở khóa</p>
          </div>
        </div>
      </div>
    )
  }

  const renderExerciseLinks = (day, globalDayId, exStatus) => (
    <div className="exercise-list">
      <Link to={`/learn/${globalDayId}`} className={`exercise-row optional ${exStatus.vocab ? 'done' : ''}`} onClick={e => e.stopPropagation()}>
        <span className="ex-status-icon">{exStatus.vocab ? '✅' : '○'}</span>
        <span className="ex-name">📚 Từ vựng</span>
        <span className="ex-arrow">›</span>
      </Link>
      <Link to={`/grammar/${globalDayId}`} className={`exercise-row optional ${exStatus.grammar ? 'done' : ''}`} onClick={e => e.stopPropagation()}>
        <span className="ex-status-icon">{exStatus.grammar ? '✅' : '○'}</span>
        <span className="ex-name">📝 Ngữ pháp</span>
        <span className="ex-arrow">›</span>
      </Link>
      <div className="exercise-divider"></div>
      <Link to={`/reading/${globalDayId}`} className={`exercise-row ${exStatus.reading ? 'done' : ''}`} onClick={e => e.stopPropagation()}>
        <span className="ex-status-icon">{exStatus.reading ? '✅' : '○'}</span>
        <span className="ex-name">📖 Đọc hiểu</span>
        <span className="ex-arrow">›</span>
      </Link>
      <Link to={`/listening/${globalDayId}`} className={`exercise-row ${exStatus.listening ? 'done' : ''}`} onClick={e => e.stopPropagation()}>
        <span className="ex-status-icon">{exStatus.listening ? '✅' : '○'}</span>
        <span className="ex-name">🎧 Nghe</span>
        <span className="ex-arrow">›</span>
      </Link>
      <Link to={`/quiz/${globalDayId}`} className={`exercise-row ${exStatus.quiz ? 'done' : ''}`} onClick={e => e.stopPropagation()}>
        <span className="ex-status-icon">{exStatus.quiz ? '✅' : '○'}</span>
        <span className="ex-name">🧪 Kiểm tra</span>
        <span className="ex-arrow">›</span>
      </Link>
    </div>
  )

  // Render blog-only day (weeks without app data yet)
  const renderBlogDay = (day) => (
    <a key={day.id} href={day.blogUrl} target="_blank" rel="noopener" className="lesson-card blog-day">
      <div className="lesson-top">
        <div className="lesson-status">📖</div>
        <div className="lesson-info">
          <h3>{day.title}</h3>
          <p className="blog-hint">Mở bài học trên blog →</p>
        </div>
        <span className="ex-arrow">›</span>
      </div>
    </a>
  )

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div>
          <h1>Xin chào, {user?.user_metadata?.name || 'bạn'}! 👋</h1>
          <p className="subtitle">Hãy học mỗi ngày để tiến bộ nhé!</p>
        </div>
        <div className="header-actions">
          <ThemeToggle />
          <Link to="/profile" className="avatar-link">
            {user?.user_metadata?.avatar_url 
              ? <img src={user.user_metadata.avatar_url} alt="" className="avatar-img" />
              : <span className="avatar-placeholder">{(user?.user_metadata?.name || user?.email || 'U')[0].toUpperCase()}</span>
            }
          </Link>
        </div>
      </header>

      {/* IELTS Progress */}
      <Link to="/roadmap" className="ielts-progress-card">
        <div className="ielts-progress-top">
          <div className="ielts-progress-left">
            <span className="ielts-target">🎯 IELTS 6.0</span>
            <span className="ielts-phase">{currentPhase ? `${currentPhase.icon} ${currentPhase.title}` : 'Chưa bắt đầu'}</span>
          </div>
          <div className="ielts-progress-right">
            <span className="ielts-pct">{overallProgress}%</span>
            <span className="ielts-days">{completedWeeks}/40 tuần</span>
          </div>
        </div>
        <div className="ielts-progress-bar">
          <div className="ielts-progress-fill" style={{ width: `${overallProgress}%` }} />
        </div>
        <span className="ielts-progress-hint">Xem lộ trình chi tiết →</span>
      </Link>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Từ đã học</span>
        </div>
        <div className="stat-card accent">
          <span className="stat-number">{stats.due}</span>
          <span className="stat-label">Cần ôn hôm nay</span>
        </div>
        <div className="stat-card success">
          <span className="stat-number">{stats.mastered}</span>
          <span className="stat-label">Đã thuộc</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.lessonsCompleted}</span>
          <span className="stat-label">Bài đã pass</span>
        </div>
      </div>

      {/* Review Button */}
      {dueWords.length > 0 && (
        <Link to="/review" className="review-banner">
          🔁 Có <strong>{dueWords.length} từ</strong> cần ôn tập hôm nay!
          <span className="btn-primary">Ôn ngay →</span>
        </Link>
      )}

      {/* All Weeks by Phase */}
      {phases.map(phase => {
        const phaseWeeks = weeksIndex.filter(w => w.phase === phase)
        return (
          <section key={phase} className="phase-section">
            <h2 className="phase-title">{PHASE_NAMES[phase]}</h2>
            {phaseWeeks.map(weekInfo => {
              const weekAppData = getWeekData(weekInfo.id)
              const isOpen = expandedWeeks[weekInfo.id] || false
              const days = weekAppData ? weekAppData.days : weekInfo.days
              const weekUnlocked = isWeekUnlocked(weekInfo.id)
              const weekCompleted = weekAppData 
                ? weekAppData.days.every(d => isDayCompleted(`${weekInfo.id}-${d.id}`))
                : false
              // Count completed days in this week
              const completedDaysCount = weekAppData
                ? weekAppData.days.filter(d => isDayCompleted(`${weekInfo.id}-${d.id}`)).length
                : 0
              const weekIcon = weekCompleted ? '✅' : weekUnlocked ? '🔓' : '🔒'
              const weekStatusClass = weekCompleted ? 'week-completed' : weekUnlocked ? 'week-unlocked' : 'week-locked'

              return (
                <div key={weekInfo.id} className={`week-card ${weekInfo.milestone ? 'milestone' : ''} ${weekStatusClass}`}>
                  <div className="week-header" onClick={() => weekUnlocked && toggleWeek(weekInfo.id)}>
                    <span className="week-status-icon">{weekIcon}</span>
                    <span className="week-title">
                      {weekInfo.milestone ? '🏆 ' : ''}{weekInfo.title}
                    </span>
                    <span className="week-meta">
                      {weekAppData && completedDaysCount > 0 && !weekCompleted && (
                        <span className="week-day-count">{completedDaysCount}/7</span>
                      )}
                      {weekInfo.title.split(':')[0]}
                      {weekUnlocked && <span className={`toggle-arrow ${isOpen ? 'open' : ''}`}>›</span>}
                    </span>
                  </div>
                  {isOpen && weekUnlocked && (
                    <div className="week-days">
                      {weekAppData
                        ? weekAppData.days.map((day, idx) => renderInteractiveDay(day, idx, weekInfo.id))
                        : days?.map(day => renderBlogDay(day))
                      }
                    </div>
                  )}
                </div>
              )
            })}
          </section>
        )
      })}
    </div>
  )
}

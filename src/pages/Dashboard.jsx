import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { useProgress } from '../hooks/useProgress.jsx'
import { Link } from 'react-router-dom'
import { week1 } from '../data/week1.jsx'
import { weeksIndex, PHASE_NAMES } from '../data/weeks-index.jsx'
import { getProgressFromWeeks, getPhaseFromWeeks } from '../data/roadmap.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { lessonProgress, isLessonUnlocked, getExerciseStatus, isDayCompleted, getStats, getDueWords } = useProgress()
  const stats = getStats()
  const dueWords = getDueWords()
  const week1Done = week1.days.every(day => isDayCompleted(day.id))
  const completedWeeks = week1Done ? 1 : 0
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

  // Render exercise list for Week 1 days (has app data)
  const renderWeek1Day = (day, index) => {
    const unlocked = isLessonUnlocked(index)
    const completed = isDayCompleted(day.id)
    const exStatus = getExerciseStatus(day.id)
    const requiredPassed = [exStatus.reading, exStatus.listening, exStatus.quiz].filter(Boolean).length
    let dayProgress = 0
    if (exStatus.vocab) dayProgress += 10
    if (exStatus.grammar) dayProgress += 10
    if (exStatus.reading) dayProgress += 27
    if (exStatus.listening) dayProgress += 27
    if (exStatus.quiz) dayProgress += 26
    const isExpanded = expandedDays[day.id] || false

    if (completed) {
      return (
        <div key={day.id} className="lesson-card passed collapsed" onClick={() => toggleDay(day.id)}>
          <div className="lesson-top">
            <div className="lesson-status">✅</div>
            <div className="lesson-info">
              <h3>{day.title}</h3>
              <p>{dayProgress}% · {requiredPassed}/3 bắt buộc</p>
            </div>
            <span className={`toggle-arrow ${isExpanded ? 'open' : ''}`}>›</span>
          </div>
          {isExpanded && (
            <div className="exercise-list">
              <Link to={`/learn/${day.id}`} className="exercise-row" onClick={e => e.stopPropagation()}>
                <span className="ex-status-icon">{exStatus.vocab ? '✅' : '○'}</span>
                <span className="ex-name">📚 Từ vựng</span>
                <span className="ex-arrow">›</span>
              </Link>
              <Link to={`/grammar/${day.id}`} className="exercise-row" onClick={e => e.stopPropagation()}>
                <span className="ex-status-icon">{exStatus.grammar ? '✅' : '○'}</span>
                <span className="ex-name">📝 Ngữ pháp</span>
                <span className="ex-arrow">›</span>
              </Link>
              <div className="exercise-divider"></div>
              <Link to={`/reading/${day.id}`} className="exercise-row" onClick={e => e.stopPropagation()}>
                <span className="ex-status-icon">✅</span>
                <span className="ex-name">📖 Đọc hiểu</span>
                <span className="ex-arrow">›</span>
              </Link>
              <Link to={`/listening/${day.id}`} className="exercise-row" onClick={e => e.stopPropagation()}>
                <span className="ex-status-icon">✅</span>
                <span className="ex-name">🎧 Nghe</span>
                <span className="ex-arrow">›</span>
              </Link>
              <Link to={`/quiz/${day.id}`} className="exercise-row" onClick={e => e.stopPropagation()}>
                <span className="ex-status-icon">✅</span>
                <span className="ex-name">🧪 Kiểm tra</span>
                <span className="ex-arrow">›</span>
              </Link>
            </div>
          )}
        </div>
      )
    }

    if (unlocked) {
      return (
        <div key={day.id} className="lesson-card">
          <div className="lesson-top">
            <div className="lesson-status">🔓</div>
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
                <a href={day.blogUrl} target="_blank" rel="noopener" className="blog-link">
                  📖 Xem giáo án trên blog
                </a>
              )}
            </div>
          </div>
          <div className="exercise-list">
            <Link to={`/learn/${day.id}`} className={`exercise-row optional ${exStatus.vocab ? 'done' : ''}`}>
              <span className="ex-status-icon">{exStatus.vocab ? '✅' : '○'}</span>
              <span className="ex-name">📚 Từ vựng</span>
              <span className="ex-arrow">›</span>
            </Link>
            <Link to={`/grammar/${day.id}`} className={`exercise-row optional ${exStatus.grammar ? 'done' : ''}`}>
              <span className="ex-status-icon">{exStatus.grammar ? '✅' : '○'}</span>
              <span className="ex-name">📝 Ngữ pháp</span>
              <span className="ex-arrow">›</span>
            </Link>
            <div className="exercise-divider"></div>
            <Link to={`/reading/${day.id}`} className={`exercise-row ${exStatus.reading ? 'done' : ''}`}>
              <span className="ex-status-icon">{exStatus.reading ? '✅' : '○'}</span>
              <span className="ex-name">📖 Đọc hiểu</span>
              <span className="ex-arrow">›</span>
            </Link>
            <Link to={`/listening/${day.id}`} className={`exercise-row ${exStatus.listening ? 'done' : ''}`}>
              <span className="ex-status-icon">{exStatus.listening ? '✅' : '○'}</span>
              <span className="ex-name">🎧 Nghe</span>
              <span className="ex-arrow">›</span>
            </Link>
            <Link to={`/quiz/${day.id}`} className={`exercise-row ${exStatus.quiz ? 'done' : ''}`}>
              <span className="ex-status-icon">{exStatus.quiz ? '✅' : '○'}</span>
              <span className="ex-name">🧪 Kiểm tra</span>
              <span className="ex-arrow">›</span>
            </Link>
          </div>
        </div>
      )
    }

    return (
      <div key={day.id} className="lesson-card locked">
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

  // Render blog-only day (Week 2+)
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
          <button className="btn-secondary" onClick={signOut}>Đăng xuất</button>
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
              const isWeek1 = weekInfo.id === 'week-1'
              const isOpen = expandedWeeks[weekInfo.id] || false
              const week1Data = isWeek1 ? week1 : null
              const days = isWeek1 ? week1.days : weekInfo.days

              return (
                <div key={weekInfo.id} className={`week-card ${weekInfo.milestone ? 'milestone' : ''}`}>
                  <div className="week-header" onClick={() => toggleWeek(weekInfo.id)}>
                    <span className="week-title">
                      {weekInfo.milestone ? '🏆 ' : ''}{weekInfo.title}
                    </span>
                    <span className="week-meta">
                      {isWeek1 && weekInfo.hasAppData ? '📱 App' : '📖 Blog'}
                      <span className={`toggle-arrow ${isOpen ? 'open' : ''}`}>›</span>
                    </span>
                  </div>
                  {isOpen && (
                    <div className="week-days">
                      {isWeek1 
                        ? week1.days.map((day, idx) => renderWeek1Day(day, idx))
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

import { Link } from 'react-router-dom'
import { roadmap, getCurrentWeek, getOverallProgress, getCurrentPhase, getDaysUntilExam } from '../data/roadmap.jsx'

export default function Roadmap() {
  const currentWeek = getCurrentWeek()
  const progress = getOverallProgress(currentWeek)
  const currentPhase = getCurrentPhase(currentWeek)
  const daysLeft = getDaysUntilExam()

  return (
    <div className="roadmap-page">
      <header className="learn-header">
        <Link to="/" className="back-link">← Dashboard</Link>
        <h2>🎯 Lộ trình IELTS 6.0</h2>
      </header>

      {/* Progress Overview */}
      <div className="roadmap-overview">
        <div className="roadmap-target">
          <span className="target-score">6.0</span>
          <span className="target-label">Mục tiêu IELTS</span>
        </div>
        <div className="roadmap-stats">
          <div className="roadmap-stat">
            <span className="stat-val">{progress}%</span>
            <span className="stat-desc">Tiến độ</span>
          </div>
          <div className="roadmap-stat">
            <span className="stat-val">{currentWeek > 0 ? `${currentWeek}/40` : '—'}</span>
            <span className="stat-desc">Tuần</span>
          </div>
          <div className="roadmap-stat">
            <span className="stat-val">{daysLeft}</span>
            <span className="stat-desc">Ngày còn lại</span>
          </div>
        </div>
        <div className="roadmap-bar">
          <div className="roadmap-bar-fill" style={{ width: `${progress}%` }} />
          <div className="roadmap-bar-markers">
            <span style={{ left: '30%' }}>GĐ1</span>
            <span style={{ left: '60%' }}>GĐ2</span>
            <span style={{ left: '90%' }}>GĐ3</span>
            <span style={{ left: '100%' }}>🎯</span>
          </div>
        </div>
      </div>

      {/* Phases */}
      <div className="roadmap-phases">
        {roadmap.phases.map((phase) => {
          const isCurrent = currentPhase?.id === phase.id
          const isPast = currentWeek > phase.weeks[1]
          const isFuture = currentWeek < phase.weeks[0]

          // Phase progress
          let phaseProgress = 0
          if (isPast) phaseProgress = 100
          else if (isCurrent) {
            const phaseWeeks = phase.weeks[1] - phase.weeks[0] + 1
            const weeksIn = currentWeek - phase.weeks[0] + 1
            phaseProgress = Math.round((weeksIn / phaseWeeks) * 100)
          }

          return (
            <div key={phase.id} className={`phase-card ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''} ${isFuture ? 'future' : ''}`}>
              <div className="phase-header">
                <span className="phase-icon">{phase.icon}</span>
                <div className="phase-title-block">
                  <h3>{phase.title}</h3>
                  <span className="phase-months">{phase.months} · Tuần {phase.weeks[0]}–{phase.weeks[1]}</span>
                </div>
                <span className="phase-pct">{phaseProgress}%</span>
              </div>

              {isCurrent && (
                <div className="phase-progress-bar">
                  <div className="phase-progress-fill" style={{ width: `${phaseProgress}%` }} />
                </div>
              )}

              <p className="phase-subtitle">{phase.subtitle}</p>

              <ul className="phase-skills">
                {phase.skills.map((skill, i) => (
                  <li key={i}>
                    <span className="skill-check">{isPast ? '✅' : isCurrent && i < Math.floor(phase.skills.length * phaseProgress / 100) ? '✅' : '○'}</span>
                    {skill}
                  </li>
                ))}
              </ul>

              <div className="phase-milestone">
                🏁 {phase.milestone}
              </div>
            </div>
          )
        })}
      </div>

      {/* Info */}
      <div className="roadmap-info">
        <p>📅 Bắt đầu: 05/03/2026 · Thi: cuối tháng 12/2026</p>
        <p>⏰ Học 1–1.5 tiếng/ngày · 7 ngày/tuần</p>
        <a href="https://eng4it.com/ielts/roadmap/" target="_blank" rel="noopener" className="roadmap-blog-link">
          📖 Xem lộ trình chi tiết trên blog →
        </a>
      </div>
    </div>
  )
}

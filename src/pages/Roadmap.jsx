import { Link } from 'react-router-dom'
import { roadmap, getProgressFromWeeks, getPhaseFromWeeks, getPhaseProgress } from '../data/roadmap.jsx'
import { useProgress } from '../hooks/useProgress.jsx'
import { week1 } from '../data/week1.jsx'

export default function Roadmap() {
  const { isDayCompleted } = useProgress()

  // Count completed weeks based on actual user progress
  // For now: Week 1 = 7 days all completed
  const week1Done = week1.days.every(day => isDayCompleted(day.id))
  const completedWeeks = week1Done ? 1 : 0
  // TODO: add more weeks as content grows

  const progress = getProgressFromWeeks(completedWeeks)
  const currentPhase = getPhaseFromWeeks(completedWeeks)

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
            <span className="stat-val">{completedWeeks}/40</span>
            <span className="stat-desc">Tuần hoàn thành</span>
          </div>
          <div className="roadmap-stat">
            <span className="stat-val">{currentPhase.icon}</span>
            <span className="stat-desc">{currentPhase.title}</span>
          </div>
        </div>
        <div className="roadmap-bar">
          <div className="roadmap-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Phases */}
      <div className="roadmap-phases">
        {roadmap.phases.map((phase) => {
          const isCurrent = currentPhase?.id === phase.id
          const isPast = completedWeeks >= phase.weeks[1]
          const isFuture = completedWeeks < phase.weeks[0]
          const phasePct = getPhaseProgress(phase, completedWeeks)

          return (
            <div key={phase.id} className={`phase-card ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''} ${isFuture ? 'future' : ''}`}>
              <div className="phase-header">
                <span className="phase-icon">{phase.icon}</span>
                <div className="phase-title-block">
                  <h3>{phase.title}</h3>
                  <span className="phase-months">{phase.duration} · Tuần {phase.weeks[0]}–{phase.weeks[1]}</span>
                </div>
                <span className="phase-pct">{phasePct}%</span>
              </div>

              {isCurrent && (
                <div className="phase-progress-bar">
                  <div className="phase-progress-fill" style={{ width: `${phasePct}%` }} />
                </div>
              )}

              <p className="phase-subtitle">{phase.subtitle}</p>

              <ul className="phase-skills">
                {phase.skills.map((skill, i) => (
                  <li key={i}>
                    <span className="skill-check">{isPast ? '✅' : '○'}</span>
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
        <p>⏰ Học 1–1.5 tiếng/ngày · Tốc độ tùy bạn</p>
        <p>📊 Tiến độ tính theo tuần hoàn thành thực tế</p>
        <a href="https://eng4it.com/ielts/roadmap/" target="_blank" rel="noopener" className="roadmap-blog-link">
          📖 Xem lộ trình chi tiết trên blog →
        </a>
      </div>
    </div>
  )
}

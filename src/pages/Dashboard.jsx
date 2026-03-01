import { useAuth } from '../hooks/useAuth.jsx'
import { useProgress } from '../hooks/useProgress.jsx'
import { Link } from 'react-router-dom'
import { week1 } from '../data/week1.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { lessonProgress, isLessonUnlocked, getExerciseStatus, isDayCompleted, getStats, getDueWords } = useProgress()
  const stats = getStats()
  const dueWords = getDueWords()

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

      {/* Lessons */}
      <section className="lessons-section">
        <h2>📚 Tuần 1: Làm Quen Với Tiếng Anh</h2>
        <div className="lessons-list">
          {week1.days.map((day, index) => {
            const unlocked = isLessonUnlocked(index)
            const completed = isDayCompleted(day.id)
            const exStatus = getExerciseStatus(day.id)
            const requiredPassed = [exStatus.reading, exStatus.listening, exStatus.quiz].filter(Boolean).length

            return (
              <div key={day.id} className={`lesson-card ${!unlocked ? 'locked' : ''} ${completed ? 'passed' : ''}`}>
                <div className="lesson-top">
                  <div className="lesson-status">
                    {completed ? '✅' : unlocked ? '🔓' : '🔒'}
                  </div>
                  <div className="lesson-info">
                    <h3>{day.title}</h3>
                    <p>{day.vocabulary.length} từ vựng · Bắt buộc: {requiredPassed}/3</p>
                    {day.blogUrl && (
                      <a href={day.blogUrl} target="_blank" rel="noopener" className="blog-link">
                        📖 Xem giáo án trên blog
                      </a>
                    )}
                  </div>
                </div>

                {unlocked && (
                  <div className="exercise-section">
                    <div className="exercise-label">Tự chọn</div>
                    <div className="exercise-grid optional">
                      <Link to={`/learn/${day.id}`} className={`exercise-btn optional ${exStatus.vocab ? 'done' : ''}`}>
                        <span className="ex-icon">📚</span>
                        <span className="ex-label">Từ vựng</span>
                        <span className="ex-status">{exStatus.vocab ? '✅' : '○'}</span>
                      </Link>
                      <Link to={`/grammar/${day.id}`} className={`exercise-btn optional ${exStatus.grammar ? 'done' : ''}`}>
                        <span className="ex-icon">📝</span>
                        <span className="ex-label">Ngữ pháp</span>
                        <span className="ex-status">{exStatus.grammar ? '✅' : '○'}</span>
                      </Link>
                    </div>
                    <div className="exercise-label required-label">Bắt buộc ⭐</div>
                    <div className="exercise-grid required">
                      <Link to={`/reading/${day.id}`} className={`exercise-btn ${exStatus.reading ? 'done' : ''}`}>
                        <span className="ex-icon">📖</span>
                        <span className="ex-label">Đọc hiểu</span>
                        <span className="ex-status">{exStatus.reading ? '✅' : '○'}</span>
                      </Link>
                      <Link to={`/listening/${day.id}`} className={`exercise-btn ${exStatus.listening ? 'done' : ''}`}>
                        <span className="ex-icon">🎧</span>
                        <span className="ex-label">Nghe</span>
                        <span className="ex-status">{exStatus.listening ? '✅' : '○'}</span>
                      </Link>
                      <Link to={`/quiz/${day.id}`} className={`exercise-btn ${exStatus.quiz ? 'done' : ''}`}>
                        <span className="ex-icon">🧪</span>
                        <span className="ex-label">Kiểm tra</span>
                        <span className="ex-status">{exStatus.quiz ? '✅' : '○'}</span>
                      </Link>
                    </div>
                  </div>
                )}

                {!unlocked && (
                  <div className="locked-msg">
                    🔒 Pass 3 bài bắt buộc (Đọc, Nghe, Kiểm tra) của ngày trước để mở khóa
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

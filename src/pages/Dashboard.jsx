import { useAuth } from '../hooks/useAuth.jsx'
import { useProgress } from '../hooks/useProgress.jsx'
import { Link } from 'react-router-dom'
import { week1 } from '../data/week1.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { lessonProgress, isLessonUnlocked, getStats, getDueWords } = useProgress()
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
            const progress = lessonProgress[day.id]
            const passed = progress?.passed

            return (
              <div key={day.id} className={`lesson-card ${!unlocked ? 'locked' : ''} ${passed ? 'passed' : ''}`}>
                <div className="lesson-status">
                  {passed ? '✅' : unlocked ? '🔓' : '🔒'}
                </div>
                <div className="lesson-info">
                  <h3>{day.title}</h3>
                  <p>{day.vocabulary.length} từ vựng · {day.quiz.length} câu quiz</p>
                  {progress && (
                    <p className="lesson-score">
                      Điểm cao nhất: <strong>{progress.best_score}%</strong>
                      {' · '}{progress.attempts} lần thử
                    </p>
                  )}
                  {day.blogUrl && (
                    <a href={day.blogUrl} target="_blank" rel="noopener" className="blog-link">
                      📖 Xem giáo án trên blog
                    </a>
                  )}
                </div>
                <div className="lesson-actions">
                  {unlocked && (
                    <>
                      <Link to={`/learn/${day.id}`} className="btn-primary">
                        {passed ? 'Học lại' : 'Bắt đầu'}
                      </Link>
                      <Link to={`/quiz/${day.id}`} className="btn-secondary">
                        Kiểm tra
                      </Link>
                    </>
                  )}
                  {!unlocked && (
                    <span className="locked-text">Pass bài trước để mở khóa</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

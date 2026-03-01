import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { week1 } from '../data/week1.jsx'
import { useProgress } from '../hooks/useProgress.jsx'

export default function Reading() {
  const { dayId } = useParams()
  const { submitQuiz } = useProgress()
  const day = week1.days.find(d => d.id === dayId)
  
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [finished, setFinished] = useState(false)
  const [quizResult, setQuizResult] = useState(null)

  if (!day?.reading) return <div className="page-center">Bài đọc không tồn tại</div>

  const { reading } = day
  const question = reading.questions[currentQ]
  const progress = ((currentQ + 1) / reading.questions.length) * 100

  const handleSelect = (option) => {
    if (showResult) return
    setSelected(option)
    setShowResult(true)
    if (option === question.answer) setScore(score + 1)
  }

  const handleNext = async () => {
    if (currentQ < reading.questions.length - 1) {
      setCurrentQ(currentQ + 1)
      setSelected(null)
      setShowResult(false)
    } else {
      const finalScore = score + (selected === question.answer ? 1 : 0)
      const result = await submitQuiz(`${dayId}-reading`, finalScore, reading.questions.length)
      setQuizResult(result)
      setFinished(true)
    }
  }

  if (finished && quizResult) {
    return (
      <div className="page-center">
        <div className={`result-card ${quizResult.passed ? 'passed' : 'failed'}`}>
          <h1>{quizResult.passed ? '🎉 Đọc giỏi lắm!' : '😤 Chưa đạt!'}</h1>
          <div className="result-score">
            <span className="big-score">{quizResult.percentage}%</span>
            <span className="score-detail">{score}/{reading.questions.length} câu đúng</span>
          </div>
          <div className="complete-actions">
            <Link to="/" className="btn-primary">Về Dashboard →</Link>
            {!quizResult.passed && (
              <button className="btn-secondary" onClick={() => {
                setCurrentQ(0); setScore(0); setSelected(null)
                setShowResult(false); setFinished(false); setQuizResult(null)
              }}>Làm lại</button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-page">
      <header className="learn-header">
        <Link to="/" className="back-link">← Quay lại</Link>
        <h2>📖 {reading.title}</h2>
        <span className="progress-text">{currentQ + 1}/{reading.questions.length}</span>
      </header>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="reading-passage">
        <div className="passage-header">
          <span>📄 Đoạn văn ({reading.wordCount} từ)</span>
        </div>
        <p>{reading.passage}</p>
      </div>

      <div className="quiz-card">
        <div className="quiz-type">📖 Đọc hiểu</div>
        <h3 className="quiz-question">{question.question}</h3>

        <div className="quiz-options">
          {question.options.map((option) => {
            let className = 'quiz-option'
            if (showResult) {
              if (option === question.answer) className += ' correct'
              else if (option === selected) className += ' wrong'
            }
            return (
              <button key={option} className={className} onClick={() => handleSelect(option)} disabled={showResult}>
                {option}
              </button>
            )
          })}
        </div>

        {showResult && (
          <div className={`quiz-feedback ${selected === question.answer ? 'correct' : 'wrong'}`}>
            {selected === question.answer ? '✅ Chính xác!' : `❌ Sai! Đáp án: ${question.answer}`}
          </div>
        )}

        {showResult && (
          <button className="btn-primary btn-next" onClick={handleNext}>
            {currentQ < reading.questions.length - 1 ? 'Câu tiếp →' : 'Xem kết quả'}
          </button>
        )}
      </div>
    </div>
  )
}

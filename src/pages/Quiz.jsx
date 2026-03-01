import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { week1 } from '../data/week1.jsx'
import { useProgress } from '../hooks/useProgress.jsx'

export default function Quiz() {
  const { dayId } = useParams()
  const { submitQuiz } = useProgress()
  const day = week1.days.find(d => d.id === dayId)

  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [finished, setFinished] = useState(false)
  const [quizResult, setQuizResult] = useState(null)

  if (!day) return <div className="page-center">Bài kiểm tra không tồn tại</div>

  const question = day.quiz[currentQ]
  const progress = ((currentQ + 1) / day.quiz.length) * 100

  const handleSelect = (option) => {
    if (showResult) return
    setSelected(option)
    setShowResult(true)

    const isCorrect = option === question.answer
    if (isCorrect) setScore(score + 1)
  }

  const handleNext = async () => {
    if (currentQ < day.quiz.length - 1) {
      setCurrentQ(currentQ + 1)
      setSelected(null)
      setShowResult(false)
    } else {
      // Submit quiz
      const result = await submitQuiz(dayId, score + (selected === question.answer ? 1 : 0), day.quiz.length)
      setQuizResult(result)
      setFinished(true)
    }
  }

  if (finished && quizResult) {
    return (
      <div className="page-center">
        <div className={`result-card ${quizResult.passed ? 'passed' : 'failed'}`}>
          <h1>{quizResult.passed ? '🎉 Tuyệt vời!' : '😤 Chưa đạt!'}</h1>
          <div className="result-score">
            <span className="big-score">{quizResult.percentage}%</span>
            <span className="score-detail">{score}/{day.quiz.length} câu đúng</span>
          </div>
          <p>
            {quizResult.passed
              ? 'Bạn đã pass! Bài tiếp theo đã được mở khóa 🔓'
              : `Cần đạt ${day.passScore}% để mở khóa bài tiếp. Hãy ôn lại và thử lại nhé!`
            }
          </p>
          <div className="complete-actions">
            {quizResult.passed ? (
              <Link to="/" className="btn-primary">Về Dashboard →</Link>
            ) : (
              <>
                <Link to={`/learn/${dayId}`} className="btn-primary">Học lại</Link>
                <button className="btn-secondary" onClick={() => {
                  setCurrentQ(0)
                  setScore(0)
                  setSelected(null)
                  setShowResult(false)
                  setFinished(false)
                  setQuizResult(null)
                }}>Làm lại quiz</button>
              </>
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
        <h2>Kiểm tra: {day.title}</h2>
        <span className="progress-text">{currentQ + 1}/{day.quiz.length}</span>
      </header>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="quiz-card">
        <div className="quiz-type">
          {question.type === 'translate' ? '🔤 Dịch từ' : '✏️ Điền từ'}
        </div>
        <h3 className="quiz-question">{question.question}</h3>

        <div className="quiz-options">
          {question.options.map((option) => {
            let className = 'quiz-option'
            if (showResult) {
              if (option === question.answer) className += ' correct'
              else if (option === selected) className += ' wrong'
            } else if (option === selected) {
              className += ' selected'
            }

            return (
              <button
                key={option}
                className={className}
                onClick={() => handleSelect(option)}
                disabled={showResult}
              >
                {option}
              </button>
            )
          })}
        </div>

        {showResult && (
          <div className={`quiz-feedback ${selected === question.answer ? 'correct' : 'wrong'}`}>
            {selected === question.answer
              ? '✅ Chính xác!'
              : `❌ Sai rồi! Đáp án đúng: ${question.answer}`
            }
          </div>
        )}

        {showResult && (
          <button className="btn-primary btn-next" onClick={handleNext}>
            {currentQ < day.quiz.length - 1 ? 'Câu tiếp →' : 'Xem kết quả'}
          </button>
        )}
      </div>
    </div>
  )
}

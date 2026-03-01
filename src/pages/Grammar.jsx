import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getWeekData } from '../data/loader.jsx'
import { parseGlobalDayId, findDayInWeek } from '../utils/dayHelper.jsx'
import { useProgress } from '../hooks/useProgress.jsx'

export default function Grammar() {
  const { dayId: globalDayId } = useParams()
  const { submitQuiz } = useProgress()
  
  const parsed = parseGlobalDayId(globalDayId)
  const weekData = parsed ? getWeekData(parsed.weekId) : null
  const day = weekData ? findDayInWeek(weekData, parsed.dayId) : null
  
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [finished, setFinished] = useState(false)
  const [quizResult, setQuizResult] = useState(null)
  const [showExplanation, setShowExplanation] = useState(true)

  if (!day?.grammar) return <div className="page-center">Bài ngữ pháp không tồn tại</div>

  const { grammar } = day
  const question = grammar.exercises[currentQ]
  const progress = ((currentQ + 1) / grammar.exercises.length) * 100

  const handleSelect = (option) => {
    if (showResult) return
    setSelected(option)
    setShowResult(true)
    if (option === question.answer) setScore(score + 1)
  }

  const handleNext = async () => {
    if (currentQ < grammar.exercises.length - 1) {
      setCurrentQ(currentQ + 1)
      setSelected(null)
      setShowResult(false)
    } else {
      const finalScore = score + (selected === question.answer ? 1 : 0)
      const result = await submitQuiz(`${globalDayId}-grammar`, finalScore, grammar.exercises.length)
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
            <span className="score-detail">{score}/{grammar.exercises.length} câu đúng</span>
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
        <h2>📝 {grammar.title}</h2>
        <span className="progress-text">{currentQ + 1}/{grammar.exercises.length}</span>
      </header>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {showExplanation && (
        <div className="grammar-box">
          <p className="grammar-vi">{grammar.explanation.vi}</p>
          <div className="grammar-formulas">
            {grammar.explanation.formula.map((f, i) => (
              <div key={i} className="formula-row">
                <span className="formula-type">{f.type === 'positive' ? '✅' : f.type === 'negative' ? '❌' : f.type === 'question' ? '❓' : '📌'}</span>
                <div>
                  <strong>{f.pattern}</strong>
                  <p className="formula-example">{f.example}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-secondary btn-small" onClick={() => setShowExplanation(false)}>Ẩn giải thích</button>
        </div>
      )}
      {!showExplanation && (
        <button className="btn-secondary btn-small" onClick={() => setShowExplanation(true)} style={{marginBottom: '16px'}}>📖 Xem giải thích</button>
      )}

      <div className="quiz-card">
        <div className="quiz-type">
          {question.type === 'fill' ? '✏️ Điền từ' : question.type === 'correct' ? '✅ Chọn câu đúng' : '🔄 Sắp xếp'}
        </div>
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
            {currentQ < grammar.exercises.length - 1 ? 'Câu tiếp →' : 'Xem kết quả'}
          </button>
        )}
      </div>
    </div>
  )
}

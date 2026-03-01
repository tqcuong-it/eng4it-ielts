import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { week1 } from '../data/week1.jsx'
import { useProgress } from '../hooks/useProgress.jsx'

export default function Learn() {
  const { dayId } = useParams()
  const { reviewWord, markVocabDone } = useProgress()
  const day = week1.days.find(d => d.id === dayId)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [mode, setMode] = useState('flashcard') // flashcard | complete

  if (!day) return <div className="page-center">Bài học không tồn tại</div>

  const word = day.vocabulary[currentIndex]
  const progress = ((currentIndex + 1) / day.vocabulary.length) * 100

  const handleResponse = async (quality) => {
    const wordId = `w1-${dayId}-${currentIndex}`
    await reviewWord(wordId, quality)

    if (currentIndex < day.vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setFlipped(false)
    } else {
      await markVocabDone(dayId)
      setMode('complete')
    }
  }

  if (mode === 'complete') {
    return (
      <div className="page-center">
        <div className="complete-card">
          <h1>🎉 Hoàn thành!</h1>
          <p>Bạn đã học xong <strong>{day.vocabulary.length} từ</strong> trong bài này.</p>
          <p>Giờ hãy làm bài kiểm tra để mở khóa bài tiếp theo!</p>
          <div className="complete-actions">
            <Link to={`/quiz/${dayId}`} className="btn-primary">Làm bài kiểm tra →</Link>
            <Link to="/" className="btn-secondary">Về trang chủ</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="learn-page">
      <header className="learn-header">
        <Link to="/" className="back-link">← Quay lại</Link>
        <h2>{day.title}</h2>
        <span className="progress-text">{currentIndex + 1}/{day.vocabulary.length}</span>
      </header>

      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Flashcard */}
      <div className="flashcard-container" onClick={() => setFlipped(!flipped)}>
        <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
          <div className="flashcard-front">
            <span className="word-en">{word.en}</span>
            <span className="word-ipa">{word.ipa}</span>
            <span className="tap-hint">Nhấn để lật thẻ</span>
          </div>
          <div className="flashcard-back">
            <span className="word-vi">{word.vi}</span>
            <span className="word-example">{word.example}</span>
          </div>
        </div>
      </div>

      {/* Response buttons (only show when flipped) */}
      {flipped && (
        <div className="response-buttons">
          <button className="resp-btn resp-forgot" onClick={() => handleResponse(1)}>
            😵 Quên
          </button>
          <button className="resp-btn resp-hard" onClick={() => handleResponse(3)}>
            😤 Khó
          </button>
          <button className="resp-btn resp-good" onClick={() => handleResponse(4)}>
            😊 Nhớ
          </button>
          <button className="resp-btn resp-easy" onClick={() => handleResponse(5)}>
            😎 Dễ
          </button>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress.jsx'
import { getAllVocabularyFromAllWeeks } from '../data/loader.jsx'

export default function Review() {
  const { getDueWords, reviewWord, vocabProgress } = useProgress()
  const [dueWords, setDueWords] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(false)
  const allVocab = getAllVocabularyFromAllWeeks()

  useEffect(() => {
    const due = getDueWords()
    // Map due words to full vocab data
    const mapped = due.map(d => {
      const vocab = allVocab.find(v => v.id === d.wordId)
      return vocab ? { ...vocab, ...d } : null
    }).filter(Boolean)
    setDueWords(mapped)
    if (mapped.length === 0) setDone(true)
  }, [])

  if (done || dueWords.length === 0) {
    return (
      <div className="page-center">
        <div className="complete-card">
          <h1>🎉 Ôn tập xong!</h1>
          <p>{dueWords.length === 0
            ? 'Không có từ nào cần ôn hôm nay. Giỏi lắm!'
            : `Bạn đã ôn xong ${dueWords.length} từ!`
          }</p>
          <Link to="/" className="btn-primary">Về Dashboard →</Link>
        </div>
      </div>
    )
  }

  const word = dueWords[currentIndex]
  const progress = ((currentIndex + 1) / dueWords.length) * 100

  const handleResponse = async (quality) => {
    await reviewWord(word.id, quality)

    if (currentIndex < dueWords.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setFlipped(false)
    } else {
      setDone(true)
    }
  }

  return (
    <div className="learn-page">
      <header className="learn-header">
        <Link to="/" className="back-link">← Quay lại</Link>
        <h2>🔁 Ôn tập SRS</h2>
        <span className="progress-text">{currentIndex + 1}/{dueWords.length}</span>
      </header>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <p className="review-context">Từ bài: {word.dayTitle}</p>

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

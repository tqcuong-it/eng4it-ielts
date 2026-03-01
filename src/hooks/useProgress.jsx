import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.jsx'
import { useAuth } from './useAuth.jsx'
import { sm2, getWordStatus } from '../lib/srs.jsx'

// All exercise types that must be passed to unlock next day
const EXERCISE_TYPES = ['vocab', 'grammar', 'reading', 'listening', 'quiz']

export function useProgress() {
  const { user } = useAuth()
  const [vocabProgress, setVocabProgress] = useState({})
  const [lessonProgress, setLessonProgress] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    loadProgress()
  }, [user])

  const loadProgress = async () => {
    setLoading(true)
    try {
      const { data: vocabData } = await supabase
        .from('vocabulary_progress')
        .select('*')
        .eq('user_id', user.id)

      const vocabMap = {}
      vocabData?.forEach(v => { vocabMap[v.word_id] = v })
      setVocabProgress(vocabMap)

      const { data: lessonData } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)

      const lessonMap = {}
      lessonData?.forEach(l => { lessonMap[l.lesson_id] = l })
      setLessonProgress(lessonMap)
    } catch (err) {
      console.error('Failed to load progress:', err)
    }
    setLoading(false)
  }

  const reviewWord = async (wordId, quality) => {
    const current = vocabProgress[wordId] || {
      repetition: 0,
      ease_factor: 2.5,
      interval: 1,
    }

    const result = sm2(quality, current.repetition, current.ease_factor, current.interval)

    const update = {
      user_id: user.id,
      word_id: wordId,
      ease_factor: result.easeFactor,
      interval: result.interval,
      repetition: result.repetition,
      next_review: result.nextReview,
      status: getWordStatus(result.repetition),
      last_reviewed: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('vocabulary_progress')
      .upsert(update, { onConflict: 'user_id,word_id' })

    if (!error) {
      setVocabProgress(prev => ({ ...prev, [wordId]: update }))
    }

    return { result, error }
  }

  // Submit any exercise result (vocab, grammar, reading, listening, quiz)
  const submitQuiz = async (lessonId, score, total) => {
    const percentage = Math.round((score / total) * 100)
    
    // Determine pass threshold based on type
    const isListening = lessonId.endsWith('-listening')
    const passThreshold = isListening ? 60 : 80
    const passed = percentage >= passThreshold

    const current = lessonProgress[lessonId]
    const attempts = (current?.attempts || 0) + 1
    const bestScore = Math.max(current?.best_score || 0, percentage)

    const update = {
      user_id: user.id,
      lesson_id: lessonId,
      score: percentage,
      best_score: bestScore,
      passed,
      attempts,
      completed_at: passed ? new Date().toISOString() : current?.completed_at || null,
    }

    const { error } = await supabase
      .from('lesson_progress')
      .upsert(update, { onConflict: 'user_id,lesson_id' })

    if (!error) {
      setLessonProgress(prev => ({ ...prev, [lessonId]: update }))
    }

    return { passed, percentage, error }
  }

  // Mark vocab flashcard session as completed
  const markVocabDone = async (dayId) => {
    const lessonId = `${dayId}-vocab`
    const update = {
      user_id: user.id,
      lesson_id: lessonId,
      score: 100,
      best_score: 100,
      passed: true,
      attempts: 1,
      completed_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('lesson_progress')
      .upsert(update, { onConflict: 'user_id,lesson_id' })

    if (!error) {
      setLessonProgress(prev => ({ ...prev, [lessonId]: update }))
    }
  }

  // Get status of each exercise type for a day
  const getExerciseStatus = (dayId) => {
    return {
      vocab: lessonProgress[`${dayId}-vocab`]?.passed === true,
      grammar: lessonProgress[`${dayId}-grammar`]?.passed === true,
      reading: lessonProgress[`${dayId}-reading`]?.passed === true,
      listening: lessonProgress[`${dayId}-listening`]?.passed === true,
      quiz: lessonProgress[dayId]?.passed === true,
    }
  }

  // Check if ALL exercises of a day are passed
  const isDayCompleted = (dayId) => {
    const status = getExerciseStatus(dayId)
    return Object.values(status).every(v => v === true)
  }

  // Unlock: day 1 always open; next day requires ALL exercises of previous day passed
  const isLessonUnlocked = (dayIndex) => {
    if (dayIndex === 0) return true
    const prevDayId = `day-${dayIndex}`
    return isDayCompleted(prevDayId)
  }

  const getDueWords = () => {
    const today = new Date().toISOString().split('T')[0]
    return Object.entries(vocabProgress)
      .filter(([_, v]) => v.next_review <= today)
      .map(([wordId, v]) => ({ wordId, ...v }))
  }

  const getStats = () => {
    const total = Object.keys(vocabProgress).length
    const mastered = Object.values(vocabProgress).filter(v => v.status === 'mastered').length
    const learning = Object.values(vocabProgress).filter(v => v.status === 'learning').length
    const due = getDueWords().length
    const lessonsCompleted = Object.values(lessonProgress).filter(l => l.passed).length

    return { total, mastered, learning, due, lessonsCompleted }
  }

  return {
    vocabProgress,
    lessonProgress,
    loading,
    reviewWord,
    submitQuiz,
    markVocabDone,
    isLessonUnlocked,
    isDayCompleted,
    getExerciseStatus,
    getDueWords,
    getStats,
    reload: loadProgress,
  }
}

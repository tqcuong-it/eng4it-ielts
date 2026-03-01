/**
 * SM-2 Spaced Repetition Algorithm (like Anki)
 * 
 * quality: 0-5 (0=forgot, 3=hard, 4=good, 5=easy)
 * Returns: { easeFactor, interval, repetition, nextReview }
 */
export function sm2(quality, repetition = 0, easeFactor = 2.5, interval = 1) {
  let newEF = easeFactor
  let newInterval = interval
  let newRep = repetition

  if (quality >= 3) {
    // Correct response
    if (repetition === 0) {
      newInterval = 1
    } else if (repetition === 1) {
      newInterval = 3
    } else {
      newInterval = Math.round(interval * easeFactor)
    }
    newRep = repetition + 1
  } else {
    // Incorrect — reset
    newRep = 0
    newInterval = 1
  }

  // Update ease factor
  newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (newEF < 1.3) newEF = 1.3

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + newInterval)

  return {
    easeFactor: Math.round(newEF * 100) / 100,
    interval: newInterval,
    repetition: newRep,
    nextReview: nextReview.toISOString().split('T')[0],
  }
}

/**
 * Get word status based on repetition count
 */
export function getWordStatus(repetition) {
  if (repetition === 0) return 'new'
  if (repetition <= 2) return 'learning'
  if (repetition <= 5) return 'review'
  return 'mastered'
}

/**
 * Get status color
 */
export function getStatusColor(status) {
  switch (status) {
    case 'new': return '#9CA3AF'
    case 'learning': return '#F59E0B'
    case 'review': return '#3B82F6'
    case 'mastered': return '#10B981'
    default: return '#9CA3AF'
  }
}

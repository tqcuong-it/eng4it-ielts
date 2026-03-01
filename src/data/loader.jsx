/**
 * Dynamic week data loader — uses Vite glob import
 * Auto-detects all weekN.jsx files in this directory
 */

// Eagerly import all week*.jsx files
const modules = import.meta.glob('./week*.jsx', { eager: true })

const weekData = {}

for (const [path, mod] of Object.entries(modules)) {
  // Extract week number from filename: ./week1.jsx → 1
  const match = path.match(/week(\d+)\.jsx$/)
  if (match) {
    const num = match[1]
    const key = `week-${num}`
    // Each module exports weekN
    weekData[key] = mod[`week${num}`]
  }
}

export function getWeekData(weekId) {
  return weekData[weekId] || null
}

export function hasWeekData(weekId) {
  return weekId in weekData
}

export function getAllWeekData() {
  return weekData
}

export function getAvailableWeekIds() {
  return Object.keys(weekData)
}

export function getAllVocabularyFromAllWeeks() {
  return Object.values(weekData).flatMap(week =>
    week.days.flatMap(day => day.vocabulary || [])
  )
}

/**
 * Parse globalDayId (e.g., "week-1-day-3") into weekId and dayId
 * Returns { weekId, dayId } or null if invalid
 */
export function parseGlobalDayId(globalDayId) {
  const match = globalDayId?.match(/^(week-\d+)-(day-\d+)$/)
  if (!match) return null
  return { weekId: match[1], dayId: match[2] }
}

/**
 * Find day data from a week data object
 */
export function findDayInWeek(weekData, dayId) {
  if (!weekData?.days) return null
  return weekData.days.find(d => d.id === dayId) || null
}

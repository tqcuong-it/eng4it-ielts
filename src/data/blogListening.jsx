/**
 * Days where listening exercises are on the blog (YouTube Cambridge IELTS)
 * instead of in-app exercises.
 * 
 * For these days:
 * - Listening button → opens blog post in new tab
 * - Listening is NOT required for day unlock
 */

const BLOG_LISTENING = {
  'week-13-day-2': 'https://eng4it.com/ielts/week-13/day-2-numbers-dates-spelling-listening-practice/',
  'week-13-day-4': 'https://eng4it.com/ielts/week-13/day-4-multiple-choice-listening-tips-practice/',
  'week-14-day-2': 'https://eng4it.com/ielts/week-14/day-2-matching-questions-strategy/',
  'week-14-day-3': 'https://eng4it.com/ielts/week-14/day-3-classification-questions/',
  'week-14-day-6': 'https://eng4it.com/ielts/week-14/day-6-practice-test-section-2/',
  'week-25-day-1': 'https://eng4it.com/ielts/week-25/day-1-section-1-2-review-on-chien-luoc-luyen-co-gio/',
  'week-25-day-3': 'https://eng4it.com/ielts/week-25/day-3-section-4-skills-bai-giang-ghi-chu-nhanh/',
  'week-25-day-4': 'https://eng4it.com/ielts/week-25/day-4-speed-listening-nghe-toc-do-1-25x-du-doan-tu-khoa/',
  'week-25-day-6': 'https://eng4it.com/ielts/week-25/day-6-full-listening-test-1-40-cau-hoi-mo-phong-thi-that/',
  'week-26-day-1': 'https://eng4it.com/ielts/week-26/day-1-spelling-number-traps-bay-chinh-ta-so-thuong-gap/',
  'week-26-day-3': 'https://eng4it.com/ielts/week-26/day-3-signpost-language-tu-chuyen-tiep-trong-bai-giang/',
  'week-26-day-4': 'https://eng4it.com/ielts/week-26/day-4-accent-training-british-australian-american/',
  'week-26-day-5': 'https://eng4it.com/ielts/week-26/day-5-full-listening-test-2-40-cau-hoi-mo-phong-thi-that/',
  'week-33-day-6': 'https://eng4it.com/ielts/week-33/day-6-targeted-weakness-practice/',
  'week-35-day-1': 'https://eng4it.com/ielts/week-35/day-1-diagnostic-xac-dinh-top-3-diem-yeu/',
  'week-35-day-2': 'https://eng4it.com/ielts/week-35/day-2-weakness-1-intensive-practice/',
  'week-36-day-1': 'https://eng4it.com/ielts/week-36/day-1-mock-test-4-listening-reading/',
  'week-37-day-1': 'https://eng4it.com/ielts/week-37/day-1-full-mock-listening-40-cau-hoi/',
  'week-38-day-6': 'https://eng4it.com/ielts/week-38/day-6-final-weakness-check/',
}

export function getBlogListeningUrl(globalDayId) {
  return BLOG_LISTENING[globalDayId] || null
}

export function isBlogListening(globalDayId) {
  return globalDayId in BLOG_LISTENING
}

export default BLOG_LISTENING

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved) return saved === 'dark'
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return true
      // Auto-detect: if between 20:00-06:00 and no preference saved, use dark
      const hour = new Date().getHours()
      const isNight = hour >= 20 || hour < 6
      return isNight
    }
    return false
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">
      {dark ? '☀️' : '🌙'}
    </button>
  )
}

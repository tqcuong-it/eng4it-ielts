import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useNavigate } from 'react-router-dom'

// Admin emails — only these can access
const ADMIN_EMAILS = ['tqcuong.it@gmail.com']

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('overview')

  const isAdmin = user && ADMIN_EMAILS.includes(user.email)

  useEffect(() => {
    if (!isAdmin) return
    loadAdminData()
  }, [user])

  const loadAdminData = async () => {
    setLoading(true)
    try {
      // Total users (unique user_ids in lesson_progress)
      const { data: lessonData } = await supabase
        .from('lesson_progress')
        .select('user_id, lesson_id, score, best_score, passed, attempts, completed_at')

      const { data: vocabData } = await supabase
        .from('vocabulary_progress')
        .select('user_id, word_id, status, last_reviewed')

      // Aggregate by user
      const userMap = {}

      lessonData?.forEach(l => {
        if (!userMap[l.user_id]) {
          userMap[l.user_id] = {
            id: l.user_id,
            lessonsCompleted: 0,
            totalAttempts: 0,
            avgScore: 0,
            scores: [],
            lastActive: null,
            weekProgress: {},
          }
        }
        const u = userMap[l.user_id]
        if (l.passed) u.lessonsCompleted++
        u.totalAttempts += l.attempts || 1
        u.scores.push(l.best_score || l.score || 0)

        const activeDate = l.completed_at
        if (activeDate && (!u.lastActive || activeDate > u.lastActive)) {
          u.lastActive = activeDate
        }

        // Track week progress
        const match = l.lesson_id.match(/week-(\d+)/)
        if (match) {
          const week = match[1]
          if (!u.weekProgress[week]) u.weekProgress[week] = 0
          if (l.passed) u.weekProgress[week]++
        }
      })

      vocabData?.forEach(v => {
        if (!userMap[v.user_id]) {
          userMap[v.user_id] = {
            id: v.user_id,
            lessonsCompleted: 0,
            totalAttempts: 0,
            avgScore: 0,
            scores: [],
            lastActive: null,
            weekProgress: {},
          }
        }
        const u = userMap[v.user_id]
        if (!u.vocabCount) u.vocabCount = 0
        if (!u.vocabMastered) u.vocabMastered = 0
        u.vocabCount++
        if (v.status === 'mastered') u.vocabMastered++

        if (v.last_reviewed && (!u.lastActive || v.last_reviewed > u.lastActive)) {
          u.lastActive = v.last_reviewed
        }
      })

      // Calculate averages
      const userList = Object.values(userMap).map(u => ({
        ...u,
        avgScore: u.scores.length > 0 
          ? Math.round(u.scores.reduce((a, b) => a + b, 0) / u.scores.length) 
          : 0,
        currentWeek: Object.keys(u.weekProgress).length > 0
          ? Math.max(...Object.keys(u.weekProgress).map(Number))
          : 0,
        vocabCount: u.vocabCount || 0,
        vocabMastered: u.vocabMastered || 0,
      }))

      // Sort by last active
      userList.sort((a, b) => (b.lastActive || '').localeCompare(a.lastActive || ''))

      // Overall stats
      const totalUsers = userList.length
      const activeToday = userList.filter(u => {
        if (!u.lastActive) return false
        const today = new Date().toISOString().split('T')[0]
        return u.lastActive.startsWith(today)
      }).length
      const activeWeek = userList.filter(u => {
        if (!u.lastActive) return false
        const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()
        return u.lastActive > weekAgo
      }).length
      const totalLessons = lessonData?.length || 0
      const totalVocab = vocabData?.length || 0
      const passedLessons = lessonData?.filter(l => l.passed).length || 0

      setStats({
        totalUsers,
        activeToday,
        activeWeek,
        totalLessons,
        totalVocab,
        passedLessons,
        passRate: totalLessons > 0 ? Math.round((passedLessons / totalLessons) * 100) : 0,
      })

      setUsers(userList)
    } catch (err) {
      console.error('Admin load error:', err)
    }
    setLoading(false)
  }

  if (!isAdmin) {
    return (
      <div className="page-center" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>🔒 Không có quyền truy cập</h2>
        <p style={{ color: '#666', marginTop: 12 }}>Trang này chỉ dành cho admin.</p>
        <button onClick={() => navigate('/')} style={btnStyle}>← Về Dashboard</button>
      </div>
    )
  }

  if (loading) {
    return <div className="page-center"><div className="spinner" /></div>
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>📊 Admin Dashboard</h1>
        <button onClick={() => navigate('/')} style={btnStyle}>← App</button>
      </div>

      {/* Stats Cards */}
      <div style={gridStyle}>
        <StatCard label="Tổng người dùng" value={stats.totalUsers} icon="👥" />
        <StatCard label="Hoạt động hôm nay" value={stats.activeToday} icon="🟢" />
        <StatCard label="Hoạt động 7 ngày" value={stats.activeWeek} icon="📅" />
        <StatCard label="Tỷ lệ pass" value={`${stats.passRate}%`} icon="✅" />
        <StatCard label="Bài tập đã nộp" value={stats.totalLessons} icon="📝" />
        <StatCard label="Từ vựng đã học" value={stats.totalVocab} icon="📚" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginTop: 32, marginBottom: 16 }}>
        {['overview', 'users'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            ...tabStyle,
            background: tab === t ? '#1b70b8' : '#f0f0f0',
            color: tab === t ? '#fff' : '#333',
          }}>
            {t === 'overview' ? '📊 Tổng quan' : '👥 Người dùng'}
          </button>
        ))}
        <button onClick={loadAdminData} style={{ ...tabStyle, background: '#f0f0f0', marginLeft: 'auto' }}>
          🔄 Refresh
        </button>
      </div>

      {tab === 'overview' && (
        <div>
          <h3>📈 Hoạt động gần đây</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>User ID</th>
                <th style={thStyle}>Bài đã pass</th>
                <th style={thStyle}>Điểm TB</th>
                <th style={thStyle}>Tuần</th>
                <th style={thStyle}>Từ vựng</th>
                <th style={thStyle}>Hoạt động</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 20).map(u => (
                <tr key={u.id}>
                  <td style={tdStyle}>{u.id.substring(0, 8)}...</td>
                  <td style={tdStyle}>{u.lessonsCompleted}</td>
                  <td style={tdStyle}>{u.avgScore}%</td>
                  <td style={tdStyle}>W{u.currentWeek}</td>
                  <td style={tdStyle}>{u.vocabMastered}/{u.vocabCount}</td>
                  <td style={tdStyle}>{u.lastActive ? formatDate(u.lastActive) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p style={{ color: '#999', textAlign: 'center' }}>Chưa có người dùng nào</p>}
        </div>
      )}

      {tab === 'users' && (
        <div>
          <h3>👥 Chi tiết người dùng ({users.length})</h3>
          {users.map(u => (
            <div key={u.id} style={userCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>🧑 {u.id.substring(0, 12)}...</strong>
                <span style={{ color: '#999', fontSize: 13 }}>{u.lastActive ? formatDate(u.lastActive) : 'Chưa hoạt động'}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 14, color: '#666' }}>
                <span>📝 {u.lessonsCompleted} bài pass</span>
                <span>📊 TB {u.avgScore}%</span>
                <span>📚 {u.vocabMastered}/{u.vocabCount} từ</span>
                <span>🗓 Tuần {u.currentWeek}</span>
                <span>🔄 {u.totalAttempts} lần nộp</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div style={cardStyle}>
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>{label}</div>
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  const now = new Date()
  const diff = now - d
  if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} ngày trước`
  return d.toLocaleDateString('vi-VN')
}

// Styles
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
  gap: 12,
}

const cardStyle = {
  background: '#fff',
  borderRadius: 12,
  padding: '16px 20px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  textAlign: 'center',
}

const btnStyle = {
  padding: '8px 16px',
  borderRadius: 8,
  border: '1px solid #ddd',
  background: '#fff',
  cursor: 'pointer',
  fontSize: 14,
}

const tabStyle = {
  padding: '8px 16px',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 600,
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 14,
}

const thStyle = {
  textAlign: 'left',
  padding: '10px 12px',
  borderBottom: '2px solid #eee',
  fontWeight: 600,
  fontSize: 13,
  color: '#666',
}

const tdStyle = {
  padding: '10px 12px',
  borderBottom: '1px solid #f0f0f0',
}

const userCardStyle = {
  background: '#fff',
  borderRadius: 10,
  padding: '14px 18px',
  marginBottom: 10,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
}

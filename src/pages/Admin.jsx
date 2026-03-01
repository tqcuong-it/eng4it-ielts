import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useNavigate } from 'react-router-dom'

const ADMIN_EMAILS = ['tqcuong.it@gmail.com', 'darkfactor8@gmail.com']

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
      // Get user profiles via RPC
      const { data: authUsers } = await supabase.rpc('get_admin_users')
      const userProfileMap = {}
      authUsers?.forEach(u => {
        userProfileMap[u.id] = {
          email: u.email,
          name: u.display_name,
          avatar: u.avatar_url,
          createdAt: u.created_at,
          lastSignIn: u.last_sign_in,
        }
      })

      // Get progress data
      const { data: lessonData } = await supabase
        .from('lesson_progress')
        .select('user_id, lesson_id, score, best_score, passed, attempts, completed_at')

      const { data: vocabData } = await supabase
        .from('vocabulary_progress')
        .select('user_id, word_id, status, last_reviewed')

      // Aggregate by user — exclude admin emails
      const userMap = {}

      const isAdminUser = (userId) => {
        const profile = userProfileMap[userId]
        return profile && ADMIN_EMAILS.includes(profile.email)
      }

      lessonData?.forEach(l => {
        if (isAdminUser(l.user_id)) return
        if (!userMap[l.user_id]) {
          userMap[l.user_id] = {
            id: l.user_id,
            lessonsCompleted: 0,
            totalAttempts: 0,
            scores: [],
            lastActive: null,
            weekProgress: {},
            vocabCount: 0,
            vocabMastered: 0,
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
        const match = l.lesson_id.match(/week-(\d+)/)
        if (match) {
          const week = parseInt(match[1])
          if (!u.weekProgress[week]) u.weekProgress[week] = 0
          if (l.passed) u.weekProgress[week]++
        }
      })

      vocabData?.forEach(v => {
        if (isAdminUser(v.user_id)) return
        if (!userMap[v.user_id]) {
          userMap[v.user_id] = {
            id: v.user_id,
            lessonsCompleted: 0,
            totalAttempts: 0,
            scores: [],
            lastActive: null,
            weekProgress: {},
            vocabCount: 0,
            vocabMastered: 0,
          }
        }
        const u = userMap[v.user_id]
        u.vocabCount++
        if (v.status === 'mastered') u.vocabMastered++
        if (v.last_reviewed && (!u.lastActive || v.last_reviewed > u.lastActive)) {
          u.lastActive = v.last_reviewed
        }
      })

      const userList = Object.values(userMap).map(u => {
        const profile = userProfileMap[u.id] || {}
        return {
          ...u,
          email: profile.email || '—',
          name: profile.name || '—',
          avatar: profile.avatar || null,
          signedUp: profile.createdAt,
          avgScore: u.scores.length > 0
            ? Math.min(100, Math.round(u.scores.reduce((a, b) => a + b, 0) / u.scores.length))
            : 0,
          currentWeek: Object.keys(u.weekProgress).length > 0
            ? Math.max(...Object.keys(u.weekProgress).map(Number))
            : 0,
        }
      })

      userList.sort((a, b) => (b.lastActive || '').localeCompare(a.lastActive || ''))

      // Overall stats (excluding admin)
      const nonAdminLessons = lessonData?.filter(l => !isAdminUser(l.user_id)) || []
      const nonAdminVocab = vocabData?.filter(v => !isAdminUser(v.user_id)) || []

      const totalUsers = userList.length
      const now = new Date()
      const activeToday = userList.filter(u => {
        if (!u.lastActive) return false
        return u.lastActive.startsWith(now.toISOString().split('T')[0])
      }).length
      const activeWeek = userList.filter(u => {
        if (!u.lastActive) return false
        return u.lastActive > new Date(now - 7 * 86400000).toISOString()
      }).length
      const passedLessons = nonAdminLessons.filter(l => l.passed).length

      setStats({
        totalUsers,
        activeToday,
        activeWeek,
        totalLessons: nonAdminLessons.length,
        totalVocab: nonAdminVocab.length,
        passedLessons,
        passRate: nonAdminLessons.length > 0 ? Math.round((passedLessons / nonAdminLessons.length) * 100) : 0,
        totalAuthUsers: (authUsers?.length || 0) - ADMIN_EMAILS.length,
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

  if (loading) return <div className="page-center"><div className="spinner" /></div>

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>📊 Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={loadAdminData} style={btnStyle}>🔄</button>
          <button onClick={() => navigate('/')} style={btnStyle}>← App</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={gridStyle}>
        <StatCard label="Người dùng" value={stats.totalUsers} icon="👥" sub={`${stats.totalAuthUsers} đăng ký`} />
        <StatCard label="Active hôm nay" value={stats.activeToday} icon="🟢" />
        <StatCard label="Active 7 ngày" value={stats.activeWeek} icon="📅" />
        <StatCard label="Tỷ lệ pass" value={`${stats.passRate}%`} icon="✅" />
        <StatCard label="Bài đã nộp" value={stats.totalLessons} icon="📝" />
        <StatCard label="Từ vựng" value={stats.totalVocab} icon="📚" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginTop: 28, marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 12 }}>
        {[['overview', '📊 Tổng quan'], ['users', '👥 Người dùng']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            ...tabStyle,
            background: tab === key ? '#1b70b8' : 'transparent',
            color: tab === key ? '#fff' : '#666',
          }}>{label}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div>
          {users.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: 40 }}>
              Chưa có người dùng nào (ngoài admin) 🙂
            </p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Người dùng</th>
                  <th style={thStyle}>Bài pass</th>
                  <th style={thStyle}>Điểm TB</th>
                  <th style={thStyle}>Tuần</th>
                  <th style={thStyle}>Từ vựng</th>
                  <th style={thStyle}>Hoạt động</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {u.avatar && <img src={u.avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                          <div style={{ fontSize: 12, color: '#999' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>{u.lessonsCompleted}</td>
                    <td style={tdStyle}>{u.avgScore}%</td>
                    <td style={tdStyle}>W{u.currentWeek || '—'}</td>
                    <td style={tdStyle}>{u.vocabMastered}/{u.vocabCount}</td>
                    <td style={tdStyle}><span style={{ fontSize: 13 }}>{formatDate(u.lastActive)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'users' && (
        <div>
          <h3 style={{ marginBottom: 12 }}>👥 Chi tiết ({users.length} người dùng)</h3>
          {users.length === 0 && (
            <p style={{ color: '#999', textAlign: 'center', padding: 40 }}>Chưa có người dùng nào</p>
          )}
          {users.map(u => (
            <div key={u.id} style={userCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {u.avatar && <img src={u.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{u.name}</div>
                  <div style={{ fontSize: 13, color: '#888' }}>{u.email}</div>
                </div>
                <div style={{ fontSize: 12, color: '#aaa' }}>
                  {u.signedUp ? `Đăng ký: ${new Date(u.signedUp).toLocaleDateString('vi-VN')}` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 14, color: '#555', flexWrap: 'wrap' }}>
                <span>📝 {u.lessonsCompleted} bài pass</span>
                <span>📊 TB {u.avgScore}%</span>
                <span>📚 {u.vocabMastered}/{u.vocabCount} từ</span>
                <span>🗓 Tuần {u.currentWeek || '—'}</span>
                <span>🔄 {u.totalAttempts} lần nộp</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 32, fontSize: 12, color: '#ccc' }}>
        ⚠️ Thống kê không bao gồm tài khoản admin
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, sub }) {
  return (
    <div style={cardStyle}>
      <div style={{ fontSize: 24 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: '#bbb', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return 'Vừa xong'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} ngày trước`
  return d.toLocaleDateString('vi-VN')
}

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }
const cardStyle = { background: '#fff', borderRadius: 12, padding: '14px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', textAlign: 'center' }
const btnStyle = { padding: '8px 14px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 14 }
const tabStyle = { padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 }
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: 14 }
const thStyle = { textAlign: 'left', padding: '10px 12px', borderBottom: '2px solid #eee', fontWeight: 600, fontSize: 13, color: '#666' }
const tdStyle = { padding: '10px 12px', borderBottom: '1px solid #f5f5f5', verticalAlign: 'middle' }
const userCardStyle = { background: '#fff', borderRadius: 12, padding: '16px 20px', marginBottom: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }

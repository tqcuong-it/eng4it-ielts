import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle.jsx'

export default function Profile() {
  const { user, updateProfile, signOut } = useAuth()
  const [name, setName] = useState(user?.user_metadata?.name || user?.user_metadata?.full_name || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setMessage('')

    const { error } = await updateProfile({ name: name.trim() })
    if (error) {
      setMessage('❌ Lỗi: ' + error.message)
    } else {
      setMessage('✅ Đã cập nhật!')
    }
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <Link to="/" className="back-link">← Trang chủ</Link>
        <ThemeToggle />
      </header>

      <div className="profile-card">
        <div className="profile-avatar">
          {user?.user_metadata?.avatar_url 
            ? <img src={user.user_metadata.avatar_url} alt="" />
            : <span>{(name || 'U')[0].toUpperCase()}</span>
          }
        </div>

        <form onSubmit={handleSave}>
          <label>Tên hiển thị</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nhập tên của bạn"
            maxLength={50}
          />

          <label>Email</label>
          <input type="email" value={user?.email || ''} disabled />

          {message && <p className={message.startsWith('✅') ? 'success-msg' : 'error-msg'}>{message}</p>}

          <button type="submit" className="btn-primary btn-full" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </form>

        <button className="btn-danger btn-full" onClick={signOut}>
          Đăng xuất
        </button>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import adminApi from '@/lib/adminApi'

const inputStyle = {
  width: '100%', padding: '12px 14px',
  background: '#0f1623', border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: '10px', color: '#f1f5f9', outline: 'none',
  fontSize: '14px', marginBottom: '16px',
}

const labelStyle = { color: '#cbd5e1', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }

const cardStyle = {
  background: '#1a1f2e', borderRadius: '18px', padding: '28px',
  border: '1px solid rgba(255,255,255,0.1)',
}

export default function Settings() {

  const [profile,    setProfile]    = useState({ name: '', email: '' })
  const [passwords,  setPasswords]  = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [profileMsg, setProfileMsg] = useState('')
  const [passMsg,    setPassMsg]    = useState('')
  const [loading1,   setLoading1]   = useState(false)
  const [loading2,   setLoading2]   = useState(false)

  useEffect(() => {
    const data = localStorage.getItem('adminData')
    if (data) setProfile(JSON.parse(data))
  }, [])

  const saveProfile = async (e) => {
    e.preventDefault()
    setLoading1(true)
    const data = await adminApi.updateProfile(profile)
    setProfileMsg(data.message)
    if (data.success) localStorage.setItem('adminData', JSON.stringify({ ...JSON.parse(localStorage.getItem('adminData')), ...profile }))
    setLoading1(false)
    setTimeout(() => setProfileMsg(''), 3000)
  }

  const savePassword = async (e) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) { setPassMsg('New passwords do not match'); return }
    setLoading2(true)
    const data = await adminApi.updatePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword })
    setPassMsg(data.message)
    if (data.success) setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setLoading2(false)
    setTimeout(() => setPassMsg(''), 3000)
  }

  return (
    <div className="row">

      {/* Profile */}
      <div className="col-lg-6 mb-4">
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(37,99,235,0.5)',
            }}>
              <i className="fa fa-user" style={{ color: '#fff', fontSize: '16px' }} />
            </div>
            <div>
              <h4 style={{ color: '#f1f5f9', margin: 0, fontSize: '16px', fontWeight: '700' }}>Profile Settings</h4>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '13px' }}>Update your name and email</p>
            </div>
          </div>
          <form onSubmit={saveProfile}>
            <label style={labelStyle}>Full Name</label>
            <input style={inputStyle} value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} required />
            <label style={labelStyle}>Email Address</label>
            <input type="email" style={inputStyle} value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} required />
            {profileMsg && (
              <p style={{ color: '#34d399', fontSize: '13px', marginBottom: '14px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', padding: '10px 14px', borderRadius: '8px' }}>
                <i className="fa fa-check" style={{ marginRight: '8px' }} />{profileMsg}
              </p>
            )}
            <button type="submit" disabled={loading1} style={{
              background: '#2563eb', color: '#fff', border: 'none',
              padding: '12px 26px', borderRadius: '12px', fontWeight: '700',
              fontSize: '14px', cursor: 'pointer', opacity: loading1 ? 0.7 : 1,
              boxShadow: '0 4px 14px rgba(37,99,235,0.5)',
            }}>
              {loading1 ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>

      {/* Password */}
      <div className="col-lg-6 mb-4">
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg,#f59e0b,#b45309)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(245,158,11,0.5)',
            }}>
              <i className="fa fa-lock" style={{ color: '#fff', fontSize: '16px' }} />
            </div>
            <div>
              <h4 style={{ color: '#f1f5f9', margin: 0, fontSize: '16px', fontWeight: '700' }}>Change Password</h4>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '13px' }}>Update your security password</p>
            </div>
          </div>
          <form onSubmit={savePassword}>
            <label style={labelStyle}>Current Password</label>
            <input type="password" style={inputStyle} placeholder="••••••••" value={passwords.currentPassword} onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })} required />
            <label style={labelStyle}>New Password</label>
            <input type="password" style={inputStyle} placeholder="••••••••" value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} required />
            <label style={labelStyle}>Confirm New Password</label>
            <input type="password" style={inputStyle} placeholder="••••••••" value={passwords.confirmPassword} onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })} required />
            {passMsg && (
              <p style={{
                fontSize: '13px', marginBottom: '14px', padding: '10px 14px', borderRadius: '8px',
                color: passMsg.toLowerCase().includes('success') ? '#34d399' : '#f87171',
                background: passMsg.toLowerCase().includes('success') ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                border: `1px solid ${passMsg.toLowerCase().includes('success') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              }}>
                <i className={`fa ${passMsg.toLowerCase().includes('success') ? 'fa-check' : 'fa-times'}`} style={{ marginRight: '8px' }} />
                {passMsg}
              </p>
            )}
            <button type="submit" disabled={loading2} style={{
              background: 'rgba(245,158,11,0.15)', color: '#fbbf24',
              border: '1px solid rgba(245,158,11,0.4)',
              padding: '12px 26px', borderRadius: '12px', fontWeight: '700',
              fontSize: '14px', cursor: 'pointer', opacity: loading2 ? 0.7 : 1,
            }}>
              {loading2 ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}

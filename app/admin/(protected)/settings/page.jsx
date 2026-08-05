'use client'

import { useState, useEffect } from 'react'
import adminApi from '@/lib/adminApi'
import { API_URL as API } from '@/service/config'

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

  const [siteInfo,   setSiteInfo]   = useState({ site_name: '', email: '', phone: '', address: '', opening_hours: '' })
  const [siteMsg,    setSiteMsg]    = useState('')
  const [loading3,   setLoading3]   = useState(false)

  const [newsletterFile,    setNewsletterFile]    = useState(null)
  const [newsletterSaved,   setNewsletterSaved]   = useState('')   // image actually saved on the server
  const [newsletterPreview, setNewsletterPreview] = useState('')   // local preview of a newly picked file (not saved yet)
  const [newsletterMsg,     setNewsletterMsg]      = useState('')
  const [loading4,          setLoading4]           = useState(false)

  const [socialLinks, setSocialLinks] = useState({ facebook: '', instagram: '', linkedin: '', youtube: '', twitter: '' })
  const [socialMsg,   setSocialMsg]   = useState('')
  const [loading5,    setLoading5]    = useState(false)

  useEffect(() => {
    const data = localStorage.getItem('adminData')
    if (data) setProfile(JSON.parse(data))
    adminApi.getSiteSettings().then(res => {
      if (res.success && res.data) {
        setSiteInfo(prev => ({
          ...prev,
          site_name:     res.data.site_name     ?? '',
          email:         res.data.email         ?? '',
          phone:         res.data.phone         ?? '',
          address:       res.data.address       ?? '',
          opening_hours: res.data.opening_hours ?? '',
        }))
        if (res.data.newsletter_bg) setNewsletterSaved(res.data.newsletter_bg)
        setSocialLinks(prev => ({
          ...prev,
          facebook:  res.data.facebook  ?? '',
          instagram: res.data.instagram ?? '',
          linkedin:  res.data.linkedin  ?? '',
          youtube:   res.data.youtube   ?? '',
          twitter:   res.data.twitter   ?? '',
        }))
      }
    })
  }, [])

  const handleNewsletterFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setNewsletterFile(file)
    setNewsletterPreview(URL.createObjectURL(file))
    setNewsletterMsg('')
  }

  const saveNewsletterBg = async (e) => {
    e.preventDefault()
    if (!newsletterFile) { setNewsletterMsg('Please choose an image first'); setTimeout(() => setNewsletterMsg(''), 3000); return }
    setLoading4(true)
    const formData = new FormData()
    formData.append('newsletter_bg', newsletterFile)
    const res = await adminApi.updateNewsletterBackground(formData)
    setNewsletterMsg(res.message)
    if (res.success && res.data?.newsletter_bg) {
      setNewsletterSaved(res.data.newsletter_bg)  // now this is the confirmed saved image
      setNewsletterFile(null)
      setNewsletterPreview('')
    }
    setLoading4(false)
    setTimeout(() => setNewsletterMsg(''), 3000)
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    setLoading1(true)
    const data = await adminApi.updateProfile(profile)
    setProfileMsg(data.message)
    if (data.success) localStorage.setItem('adminData', JSON.stringify({ ...JSON.parse(localStorage.getItem('adminData')), ...profile }))
    setLoading1(false)
    setTimeout(() => setProfileMsg(''), 3000)
  }

  const saveSiteInfo = async (e) => {
    e.preventDefault()
    setLoading3(true)
    const res = await adminApi.updateSiteSettings(siteInfo)
    setSiteMsg(res.message)
    setLoading3(false)
    setTimeout(() => setSiteMsg(''), 3000)
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

  const saveSocialLinks = async (e) => {
    e.preventDefault()
    setLoading5(true)
    const res = await adminApi.updateSocialLinks(socialLinks)
    setSocialMsg(res.message)
    setLoading5(false)
    setTimeout(() => setSocialMsg(''), 3000)
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

      {/* Website Info */}
      <div className="col-12">
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg,#10b981,#065f46)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(16,185,129,0.5)',
            }}>
              <i className="fa fa-globe" style={{ color: '#fff', fontSize: '16px' }} />
            </div>
            <div>
              <h4 style={{ color: '#f1f5f9', margin: 0, fontSize: '16px', fontWeight: '700' }}>Website Info</h4>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '13px' }}>Contact details shown on the website</p>
            </div>
          </div>
          <form onSubmit={saveSiteInfo}>
            <div className="row">
              <div className="col-md-6">
                <label style={labelStyle}>Website / Company Name</label>
                <input style={inputStyle} placeholder="e.g. Michael Leber Immobilien"
                  value={siteInfo.site_name} onChange={e => setSiteInfo({ ...siteInfo, site_name: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label style={labelStyle}>Contact Email</label>
                <input type="email" style={inputStyle} placeholder="e.g. office@example.at"
                  value={siteInfo.email} onChange={e => setSiteInfo({ ...siteInfo, email: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label style={labelStyle}>Phone Number</label>
                <input style={inputStyle} placeholder="e.g. +43 664 547 5915"
                  value={siteInfo.phone} onChange={e => setSiteInfo({ ...siteInfo, phone: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label style={labelStyle}>Address</label>
                <input style={inputStyle} placeholder="e.g. Musterstraße 1, 1010 Wien"
                  value={siteInfo.address} onChange={e => setSiteInfo({ ...siteInfo, address: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label style={labelStyle}>Opening Hours</label>
                <input style={inputStyle} placeholder="e.g. Mo – Fr: 09:00 – 18:00"
                  value={siteInfo.opening_hours} onChange={e => setSiteInfo({ ...siteInfo, opening_hours: e.target.value })} />
              </div>
            </div>
            {siteMsg && (
              <p style={{ color: '#34d399', fontSize: '13px', marginBottom: '14px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', padding: '10px 14px', borderRadius: '8px' }}>
                <i className="fa fa-check" style={{ marginRight: '8px' }} />{siteMsg}
              </p>
            )}
            <button type="submit" disabled={loading3} style={{
              background: 'rgba(16,185,129,0.15)', color: '#34d399',
              border: '1px solid rgba(16,185,129,0.4)',
              padding: '12px 26px', borderRadius: '12px', fontWeight: '700',
              fontSize: '14px', cursor: 'pointer', opacity: loading3 ? 0.7 : 1,
            }}>
              {loading3 ? 'Saving...' : 'Save Website Info'}
            </button>
          </form>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="col-12">
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg,#ec4899,#9d174d)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(236,72,153,0.5)',
            }}>
              <i className="fa fa-share-alt" style={{ color: '#fff', fontSize: '16px' }} />
            </div>
            <div>
              <h4 style={{ color: '#f1f5f9', margin: 0, fontSize: '16px', fontWeight: '700' }}>Social Media Links</h4>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '13px' }}>Shown as icons in the website footer / header</p>
            </div>
          </div>
          <form onSubmit={saveSocialLinks}>
            <div className="row">
              <div className="col-md-6">
                <label style={labelStyle}><i className="fa fa-facebook" style={{ marginRight: '8px', color: '#1877f2' }} />Facebook</label>
                <input style={inputStyle} placeholder="https://facebook.com/yourpage"
                  value={socialLinks.facebook} onChange={e => setSocialLinks({ ...socialLinks, facebook: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label style={labelStyle}><i className="fa fa-instagram" style={{ marginRight: '8px', color: '#e1306c' }} />Instagram</label>
                <input style={inputStyle} placeholder="https://instagram.com/yourpage"
                  value={socialLinks.instagram} onChange={e => setSocialLinks({ ...socialLinks, instagram: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label style={labelStyle}><i className="fa fa-linkedin" style={{ marginRight: '8px', color: '#0a66c2' }} />LinkedIn</label>
                <input style={inputStyle} placeholder="https://linkedin.com/company/yourpage"
                  value={socialLinks.linkedin} onChange={e => setSocialLinks({ ...socialLinks, linkedin: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label style={labelStyle}><i className="fa fa-youtube-play" style={{ marginRight: '8px', color: '#ff0000' }} />YouTube</label>
                <input style={inputStyle} placeholder="https://youtube.com/@yourchannel"
                  value={socialLinks.youtube} onChange={e => setSocialLinks({ ...socialLinks, youtube: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label style={labelStyle}><i className="fa fa-twitter" style={{ marginRight: '8px', color: '#1da1f2' }} />Twitter / X</label>
                <input style={inputStyle} placeholder="https://x.com/yourpage"
                  value={socialLinks.twitter} onChange={e => setSocialLinks({ ...socialLinks, twitter: e.target.value })} />
              </div>
            </div>
            {socialMsg && (
              <p style={{ color: '#34d399', fontSize: '13px', marginBottom: '14px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', padding: '10px 14px', borderRadius: '8px' }}>
                <i className="fa fa-check" style={{ marginRight: '8px' }} />{socialMsg}
              </p>
            )}
            <button type="submit" disabled={loading5} style={{
              background: 'rgba(236,72,153,0.15)', color: '#f472b6',
              border: '1px solid rgba(236,72,153,0.4)',
              padding: '12px 26px', borderRadius: '12px', fontWeight: '700',
              fontSize: '14px', cursor: 'pointer', opacity: loading5 ? 0.7 : 1,
            }}>
              {loading5 ? 'Saving...' : 'Save Social Links'}
            </button>
          </form>
        </div>
      </div>

      {/* Newsletter Background Image */}
      <div className="col-12">
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg,#8b5cf6,#5b21b6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(139,92,246,0.5)',
            }}>
              <i className="fa fa-picture-o" style={{ color: '#fff', fontSize: '16px' }} />
            </div>
            <div>
              <h4 style={{ color: '#f1f5f9', margin: 0, fontSize: '16px', fontWeight: '700' }}>Newsletter Background</h4>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '13px' }}>Upload the background image shown behind the newsletter section</p>
            </div>
          </div>

          <form onSubmit={saveNewsletterBg}>
            <div className="row align-items-start">

              <div className="col-md-6">
                <label style={labelStyle}>Background Image</label>
                <input
                  type="file"
                  accept="image/*"
                  style={inputStyle}
                  onChange={handleNewsletterFileChange}
                />
                <p style={{ color: '#64748b', fontSize: '12px', marginTop: '-10px', marginBottom: '16px' }}>
                  Recommended: wide banner image, JPG or PNG.
                </p>

                {newsletterMsg && (
                  <p style={{
                    color: '#34d399', fontSize: '13px', marginBottom: '14px',
                    background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
                    padding: '10px 14px', borderRadius: '8px',
                  }}>
                    <i className="fa fa-check" style={{ marginRight: '8px' }} />{newsletterMsg}
                  </p>
                )}

                <button type="submit" disabled={loading4} style={{
                  background: 'rgba(139,92,246,0.15)', color: '#a78bfa',
                  border: '1px solid rgba(139,92,246,0.4)',
                  padding: '12px 26px', borderRadius: '12px', fontWeight: '700',
                  fontSize: '14px', cursor: 'pointer', opacity: loading4 ? 0.7 : 1,
                }}>
                  {loading4 ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>

              <div className="col-md-6">
                <label style={labelStyle}>
                  Currently Saved
                  <span style={{ color: '#64748b', fontWeight: '400', textTransform: 'none', letterSpacing: 0 }}> (live on website)</span>
                </label>
                <div style={{
                  width: '100%', height: '160px', borderRadius: '12px',
                  border: '1px solid rgba(52,211,153,0.35)',
                  background: newsletterSaved ? `url(${API}${newsletterSaved}) center/cover no-repeat` : '#0f1623',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  {!newsletterSaved && (
                    <span style={{ color: '#475569', fontSize: '13px' }}>
                      <i className="fa fa-image" style={{ marginRight: '8px' }} />No image saved yet
                    </span>
                  )}
                </div>

                {newsletterPreview && (
                  <>
                    <label style={labelStyle}>
                      New Selection
                      <span style={{ color: '#fbbf24', fontWeight: '400', textTransform: 'none', letterSpacing: 0 }}> (not saved yet)</span>
                    </label>
                    <div style={{
                      width: '100%', height: '160px', borderRadius: '12px',
                      border: '1px dashed rgba(251,191,36,0.6)',
                      background: `url(${newsletterPreview}) center/cover no-repeat`,
                    }} />
                  </>
                )}
              </div>

            </div>
          </form>
        </div>
      </div>

    </div>
  )
}
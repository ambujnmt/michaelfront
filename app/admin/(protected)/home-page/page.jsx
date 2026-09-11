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

const textareaStyle = { ...inputStyle, resize: 'vertical', minHeight: '210px', lineHeight: 1.6 }

const labelStyle = { color: '#cbd5e1', fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }

const langTag = (lang) => ({
  display: 'inline-block', marginLeft: '8px', fontSize: '10px', fontWeight: '700',
  color: lang === 'de' ? '#60a5fa' : '#34d399',
  background: lang === 'de' ? 'rgba(96,165,250,0.15)' : 'rgba(52,211,153,0.15)',
  border: `1px solid ${lang === 'de' ? 'rgba(96,165,250,0.35)' : 'rgba(52,211,153,0.35)'}`,
  padding: '1px 7px', borderRadius: '20px', verticalAlign: 'middle',
})

const cardStyle = {
  background: '#1a1f2e', borderRadius: '18px', padding: '28px',
  border: '1px solid rgba(255,255,255,0.1)',
}

function TextFieldPair({ icon, label, name, form, setForm, placeholder }) {
  return (
    <div className="col-12 mb-4">
      <div style={cardStyle}>
        <h4 style={{ color: '#f1f5f9', marginBottom: '20px', fontSize: '16px', fontWeight: '700' }}>
          <i className={`fa ${icon}`} style={{ marginRight: '10px', color: '#60a5fa' }} />
          {label}
        </h4>
        <div className="row">
          <div className="col-lg-6">
            <label style={labelStyle}>{label}<span style={langTag('de')}>DE</span></label>
            <input
              type="text"
              style={inputStyle}
              placeholder={placeholder}
              value={form[`${name}_de`]}
              onChange={e => setForm(f => ({ ...f, [`${name}_de`]: e.target.value }))}
            />
          </div>
          <div className="col-lg-6">
            <label style={labelStyle}>{label}<span style={langTag('en')}>EN</span></label>
            <input
              type="text"
              style={inputStyle}
              placeholder={placeholder}
              value={form[`${name}_en`]}
              onChange={e => setForm(f => ({ ...f, [`${name}_en`]: e.target.value }))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function TextAreaFieldPair({ icon, label, name, form, setForm, placeholder }) {
  return (
    <div className="col-12 mb-4">
      <div style={cardStyle}>
        <h4 style={{ color: '#f1f5f9', marginBottom: '20px', fontSize: '16px', fontWeight: '700' }}>
          <i className={`fa ${icon}`} style={{ marginRight: '10px', color: '#60a5fa' }} />
          {label}
        </h4>
        <div className="row">
          <div className="col-lg-6">
            <label style={labelStyle}>{label}<span style={langTag('de')}>DE</span></label>
            <textarea
              className="hi-textarea"
              style={textareaStyle}
              placeholder={placeholder}
              value={form[`${name}_de`]}
              onChange={e => setForm(f => ({ ...f, [`${name}_de`]: e.target.value }))}
            />
          </div>
          <div className="col-lg-6">
            <label style={labelStyle}>{label}<span style={langTag('en')}>EN</span></label>
            <textarea
              className="hi-textarea"
              style={textareaStyle}
              placeholder={placeholder}
              value={form[`${name}_en`]}
              onChange={e => setForm(f => ({ ...f, [`${name}_en`]: e.target.value }))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function VideoUploadCard({ title, hint, savedVideo, preview, onFileChange }) {
  return (
    <div className="col-12 mb-4">
      <div style={cardStyle}>
        <h4 style={{ color: '#f1f5f9', marginBottom: '20px', fontSize: '16px', fontWeight: '700' }}>
          <i className="fa fa-video-camera" style={{ marginRight: '10px', color: '#60a5fa' }} />
          {title}
        </h4>
        <div className="row align-items-start">
          <div className="col-md-6">
            <label style={labelStyle}>Upload New Video</label>
            <input type="file" accept="video/mp4,video/webm,video/quicktime,video/ogg" style={inputStyle} onChange={onFileChange} />
            <p style={{ color: '#64748b', fontSize: '12px', marginTop: '-10px' }}>{hint || 'MP4, WEBM, MOV, OGG — max 50MB'}</p>
          </div>
          <div className="col-md-6">
            <label style={labelStyle}>Currently Saved</label>
            {savedVideo ? (
              <video
                src={`${API}${savedVideo}`}
                controls
                muted
                style={{ width: '100%', height: '160px', borderRadius: '12px', border: '1px solid rgba(52,211,153,0.35)', background: '#0f1623', marginBottom: '16px', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '100%', height: '160px', borderRadius: '12px',
                border: '1px solid rgba(52,211,153,0.35)',
                background: '#0f1623',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <span style={{ color: '#475569', fontSize: '13px' }}><i className="fa fa-video-camera" style={{ marginRight: '8px' }} />No video saved yet</span>
              </div>
            )}
            {preview && (
              <>
                <label style={labelStyle}>New Selection <span style={{ color: '#fbbf24', fontWeight: 400 }}>(not saved yet)</span></label>
                <video src={preview} controls muted style={{ width: '100%', height: '160px', borderRadius: '12px', border: '1px dashed rgba(251,191,36,0.6)', objectFit: 'cover' }} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const emptyBannerForm = { text_de: '', text_en: '' }
const emptyIntroForm = {
  heading_de: '', heading_en: '',
  intro1_de: '', intro1_en: '',
  intro2_de: '', intro2_en: '',
}

export default function HomePageSettings() {
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgOk, setMsgOk] = useState(true)

  // Home Banner (video banner) state
  const [bannerForm, setBannerForm] = useState(emptyBannerForm)
  const [videoFile, setVideoFile] = useState(null)
  const [savedVideo, setSavedVideo] = useState('')
  const [preview, setPreview] = useState('')
  const [heroVideoFile, setHeroVideoFile] = useState(null)
  const [savedHeroVideo, setSavedHeroVideo] = useState('')
  const [heroPreview, setHeroPreview] = useState('')

  // Home Intro state
  const [introForm, setIntroForm] = useState(emptyIntroForm)

  useEffect(() => {
    Promise.all([adminApi.getVideoBanner(), adminApi.getHomeIntro()]).then(([bannerRes, introRes]) => {
      if (bannerRes.success && bannerRes.data) {
        setBannerForm(prev => ({ ...prev, ...bannerRes.data }))
        if (bannerRes.data.video) setSavedVideo(bannerRes.data.video)
        if (bannerRes.data.hero_video) setSavedHeroVideo(bannerRes.data.hero_video)
      }
      if (introRes.success && introRes.data) {
        setIntroForm(prev => ({ ...prev, ...introRes.data }))
      }
    }).finally(() => setLoaded(true))
  }, [])

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setVideoFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleHeroVideoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setHeroVideoFile(file)
    setHeroPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const fd = new FormData()
    fd.append('text_de', bannerForm.text_de ?? '')
    fd.append('text_en', bannerForm.text_en ?? '')
    if (videoFile) fd.append('video', videoFile)
    if (heroVideoFile) fd.append('hero_video', heroVideoFile)

    const [bannerRes, introRes] = await Promise.all([
      adminApi.updateVideoBanner(fd),
      adminApi.updateHomeIntro(introForm),
    ])

    const ok = bannerRes.success && introRes.success
    setMsgOk(ok)
    setMsg(ok ? 'Saved' : (bannerRes.message || introRes.message || 'Failed'))

    if (bannerRes.success) {
      if (bannerRes.data?.video) setSavedVideo(bannerRes.data.video)
      if (bannerRes.data?.hero_video) setSavedHeroVideo(bannerRes.data.hero_video)
      setVideoFile(null)
      setPreview('')
      setHeroVideoFile(null)
      setHeroPreview('')
    }

    setLoading(false)
    setTimeout(() => setMsg(''), 3000)
  }

  if (!loaded) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}><i className="fa fa-spinner fa-spin" style={{ fontSize: '28px' }} /></div>
  }

  return (
    <form onSubmit={handleSubmit}>
      <style>{`
        /* Dark, thin scrollbar for the intro textareas — no default white bar */
        .hi-textarea {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.15) transparent;
        }
        .hi-textarea::-webkit-scrollbar { width: 8px; }
        .hi-textarea::-webkit-scrollbar-track { background: transparent; }
        .hi-textarea::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.15);
          border-radius: 8px;
        }
        .hi-textarea::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.28); }
      `}</style>

      <div className="row">

        {/* 1. Top Hero Banner Video */}
        <VideoUploadCard
          title="Top Hero Banner Video"
          hint="Plays behind the header/logo at the very top of the homepage — MP4, WEBM, MOV, OGG — max 50MB"
          savedVideo={savedHeroVideo}
          preview={heroPreview}
          onFileChange={handleHeroVideoChange}
        />

        {/* 2. Home Intro */}
        <TextFieldPair icon="fa-header" label="Heading" name="heading" form={introForm} setForm={setIntroForm} placeholder="MICHAEL LEBER IMMOBILIEN" />
        <TextAreaFieldPair icon="fa-paragraph" label="Intro Paragraph 1" name="intro1" form={introForm} setForm={setIntroForm} placeholder="First intro paragraph..." />
        <TextAreaFieldPair icon="fa-paragraph" label="Intro Paragraph 2" name="intro2" form={introForm} setForm={setIntroForm} placeholder="Second intro paragraph..." />

        {/* 3. Video Section (overlay text + background video) */}
        <TextFieldPair icon="fa-align-left" label="Overlay Text" name="text" form={bannerForm} setForm={setBannerForm} placeholder="Exceptional properties for exceptional demands" />
        <VideoUploadCard
          title="Video Section Background"
          savedVideo={savedVideo}
          preview={preview}
          onFileChange={handleVideoChange}
        />

        {/* Submit — updates everything above in one go */}
        <div className="col-12">
          {msg && (
            <p style={{
              color: msgOk ? '#34d399' : '#f87171', fontSize: '13px', marginBottom: '14px',
              background: msgOk ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
              border: `1px solid ${msgOk ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              padding: '10px 14px', borderRadius: '8px',
            }}>
              <i className={`fa ${msgOk ? 'fa-check' : 'fa-exclamation-triangle'}`} style={{ marginRight: '8px' }} />{msg}
            </p>
          )}
          <div style={{ textAlign: 'right' }}>
            <button type="submit" disabled={loading} style={{
              background: '#2563eb', color: '#fff', border: 'none',
              padding: '12px 28px', borderRadius: '12px', fontWeight: '700',
              fontSize: '14px', cursor: 'pointer', opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 14px rgba(37,99,235,0.5)',
            }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

      </div>
    </form>
  )
}

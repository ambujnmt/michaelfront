'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import adminApi from '@/lib/adminApi'
import { API_URL as API } from '@/service/config'

const QuillEditor = dynamic(() => import('@/app/components/admin/QuillEditor'), { ssr: false })

const inputStyle = {
  width: '100%', padding: '12px 14px',
  background: '#0f1623', border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: '10px', color: '#f1f5f9', outline: 'none',
  fontSize: '14px', marginBottom: '16px',
}

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

const emptyForm = {
  title_de: '', title_en: '',
  subtitle_de: '', subtitle_en: '',
  heading_de: '', heading_en: '',
  content_de: '', content_en: '',
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

function EditorPair({ icon, label, name, form, setForm, placeholder }) {
  return (
    <div className="col-12 mb-4">
      <div style={cardStyle}>
        <h4 style={{ color: '#f1f5f9', marginBottom: '20px', fontSize: '16px', fontWeight: '700' }}>
          <i className={`fa ${icon}`} style={{ marginRight: '10px', color: '#60a5fa' }} />
          {label}
        </h4>
        <div className="row">
          <div className="col-12 mb-4">
            <label style={labelStyle}>{label}<span style={langTag('de')}>DE</span></label>
            <div className="cp-editor">
              <QuillEditor
                value={form[`${name}_de`]}
                onChange={val => setForm(f => ({ ...f, [`${name}_de`]: val }))}
                placeholder={placeholder}
              />
            </div>
          </div>
          <div className="col-12">
            <label style={labelStyle}>{label}<span style={langTag('en')}>EN</span></label>
            <div className="cp-editor">
              <QuillEditor
                value={form[`${name}_en`]}
                onChange={val => setForm(f => ({ ...f, [`${name}_en`]: val }))}
                placeholder={placeholder}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ContactPageSettings() {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [msg, setMsg] = useState('')

  const [imageFile, setImageFile] = useState(null)
  const [savedImage, setSavedImage] = useState('')
  const [preview, setPreview] = useState('')

  useEffect(() => {
    adminApi.getKontaktPage().then(res => {
      if (res.success && res.data) {
        setForm(prev => ({ ...prev, ...res.data }))
        if (res.data.image) setSavedImage(res.data.image)
      }
    }).finally(() => setLoaded(true))
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ''))
    if (imageFile) fd.append('image', imageFile)
    const res = await adminApi.updateKontaktPage(fd)
    setMsg(res.message || (res.success ? 'Saved' : 'Failed'))
    if (res.success) {
      if (res.data?.image) setSavedImage(res.data.image)
      setImageFile(null)
      setPreview('')
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
        /* Rich-text editors: tall, readable on the dark admin theme,
           spaces & line breaks kept visible. */
        .cp-editor .ql-toolbar {
          background: #131b2b;
          border-color: rgba(255,255,255,0.18);
          border-radius: 10px 10px 0 0;
        }
        .cp-editor .ql-toolbar .ql-stroke { stroke: #cbd5e1; }
        .cp-editor .ql-toolbar .ql-fill { fill: #cbd5e1; }
        .cp-editor .ql-toolbar .ql-picker-label { color: #cbd5e1; }
        .cp-editor .ql-container {
          border-color: rgba(255,255,255,0.18);
          border-radius: 0 0 10px 10px;
          font-size: 15px;
        }
        .cp-editor .ql-editor {
          min-height: 220px;
          background: #0f1623;
          color: #f1f5f9;
          line-height: 1.7;
          white-space: pre-wrap;
          tab-size: 4;
        }
        .cp-editor .ql-editor p { margin-bottom: 12px; }
        .cp-editor .ql-editor.ql-blank::before {
          color: #64748b;
          font-style: normal;
        }
      `}</style>
      <div className="row">

        <TextFieldPair icon="fa-align-left" label="Title" name="title" form={form} setForm={setForm} placeholder="Page title..." />
        <TextFieldPair icon="fa-align-left" label="Subtitle" name="subtitle" form={form} setForm={setForm} placeholder="Page subtitle..." />
        <TextFieldPair icon="fa-header" label="Office Heading" name="heading" form={form} setForm={setForm} placeholder="e.g. Our Office..." />
        <EditorPair icon="fa-paragraph" label="Office Paragraph" name="content" form={form} setForm={setForm} placeholder="Office description — add your highlight points here as a bullet list..." />

        {/* Office Image */}
        <div className="col-12 mb-4">
          <div style={cardStyle}>
            <h4 style={{ color: '#f1f5f9', marginBottom: '20px', fontSize: '16px', fontWeight: '700' }}>
              <i className="fa fa-image" style={{ marginRight: '10px', color: '#60a5fa' }} />
              Office Image
            </h4>
            <div className="row align-items-start">
              <div className="col-md-6">
                <label style={labelStyle}>Upload New Image</label>
                <input type="file" accept="image/*" style={inputStyle} onChange={handleImageChange} />
                <p style={{ color: '#64748b', fontSize: '12px', marginTop: '-10px' }}>JPG, PNG, WEBP — max 5MB</p>
              </div>
              <div className="col-md-6">
                <label style={labelStyle}>Currently Saved</label>
                <div style={{
                  width: '100%', height: '160px', borderRadius: '12px',
                  border: '1px solid rgba(52,211,153,0.35)',
                  background: savedImage ? `url(${API}${savedImage}) center/cover no-repeat` : '#0f1623',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '16px',
                }}>
                  {!savedImage && <span style={{ color: '#475569', fontSize: '13px' }}><i className="fa fa-image" style={{ marginRight: '8px' }} />No image saved yet</span>}
                </div>
                {preview && (
                  <>
                    <label style={labelStyle}>New Selection <span style={{ color: '#fbbf24', fontWeight: 400 }}>(not saved yet)</span></label>
                    <div style={{ width: '100%', height: '160px', borderRadius: '12px', border: '1px dashed rgba(251,191,36,0.6)', background: `url(${preview}) center/cover no-repeat` }} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="col-12">
          {msg && (
            <p style={{ color: '#34d399', fontSize: '13px', marginBottom: '14px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', padding: '10px 14px', borderRadius: '8px' }}>
              <i className="fa fa-check" style={{ marginRight: '8px' }} />{msg}
            </p>
          )}
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
    </form>
  )
}

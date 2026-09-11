'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import adminApi from '@/lib/adminApi'

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

const emptySection = { heading_de: '', heading_en: '', content_de: '', content_en: '' }
const emptyForm = { title_de: '', title_en: '', subtitle_de: '', subtitle_en: '', sections: [] }

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

function SectionCard({ index, section, onChange, onRemove }) {
  const update = (key, val) => onChange(index, { ...section, [key]: val })

  return (
    <div className="col-12 mb-4">
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4 style={{ color: '#f1f5f9', margin: 0, fontSize: '16px', fontWeight: '700' }}>
            <i className="fa fa-list-alt" style={{ marginRight: '10px', color: '#60a5fa' }} />
            Section {index + 1}
          </h4>
          <button type="button" onClick={() => onRemove(index)} style={{
            background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)',
            padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700',
          }}>
            <i className="fa fa-trash" style={{ marginRight: '6px' }} />Remove
          </button>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <label style={labelStyle}>Heading<span style={langTag('de')}>DE</span></label>
            <input
              type="text"
              style={inputStyle}
              placeholder="Section heading..."
              value={section.heading_de}
              onChange={e => update('heading_de', e.target.value)}
            />
          </div>
          <div className="col-lg-6">
            <label style={labelStyle}>Heading<span style={langTag('en')}>EN</span></label>
            <input
              type="text"
              style={inputStyle}
              placeholder="Section heading..."
              value={section.heading_en}
              onChange={e => update('heading_en', e.target.value)}
            />
          </div>

          <style>{`.privacy-section-quill .ql-editor { min-height: 200px; }`}</style>
          <div className="col-lg-6">
            <label style={labelStyle}>Content<span style={langTag('de')}>DE</span></label>
            <div className="privacy-section-quill" style={{ marginBottom: '16px' }}>
              <QuillEditor value={section.content_de} onChange={val => update('content_de', val)} placeholder="Section content..." />
            </div>
          </div>
          <div className="col-lg-6">
            <label style={labelStyle}>Content<span style={langTag('en')}>EN</span></label>
            <div className="privacy-section-quill" style={{ marginBottom: '16px' }}>
              <QuillEditor value={section.content_en} onChange={val => update('content_en', val)} placeholder="Section content..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PrivacyPageSettings() {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    adminApi.getPrivacyPage().then(res => {
      if (res.success && res.data) {
        setForm(prev => ({ ...prev, ...res.data, sections: Array.isArray(res.data.sections) ? res.data.sections : [] }))
      }
    }).finally(() => setLoaded(true))
  }, [])

  const addSection = () => setForm(f => ({ ...f, sections: [...f.sections, { ...emptySection }] }))

  const updateSection = (index, updated) => setForm(f => ({
    ...f, sections: f.sections.map((s, i) => i === index ? updated : s)
  }))

  const removeSection = (index) => setForm(f => ({
    ...f, sections: f.sections.filter((_, i) => i !== index)
  }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const res = await adminApi.updatePrivacyPage(form)
    setMsg(res.message || (res.success ? 'Saved' : 'Failed'))
    setLoading(false)
    setTimeout(() => setMsg(''), 3000)
  }

  if (!loaded) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}><i className="fa fa-spinner fa-spin" style={{ fontSize: '28px' }} /></div>
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">

        <TextFieldPair icon="fa-align-left" label="Title" name="title" form={form} setForm={setForm} placeholder="Page title..." />
        <TextFieldPair icon="fa-align-left" label="Subtitle" name="subtitle" form={form} setForm={setForm} placeholder="Page subtitle..." />

        {form.sections.map((section, i) => (
          <SectionCard key={i} index={i} section={section} onChange={updateSection} onRemove={removeSection} />
        ))}

        <div className="col-12 mb-4">
          <button type="button" onClick={addSection} style={{
            width: '100%', padding: '16px', borderRadius: '14px',
            border: '2px dashed rgba(96,165,250,0.35)', background: 'rgba(96,165,250,0.06)',
            color: '#60a5fa', fontWeight: '700', fontSize: '14px', cursor: 'pointer',
          }}>
            <i className="fa fa-plus" style={{ marginRight: '8px' }} />Add Section
          </button>
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

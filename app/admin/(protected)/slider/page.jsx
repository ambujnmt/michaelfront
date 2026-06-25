'use client'

import { useState, useEffect, useRef } from 'react'
import adminApi from '@/lib/adminApi'
import Swal from 'sweetalert2'

import { BASE_URL } from '@/service/config'

const thStyle = { padding: '14px 18px', color: '#94a3b8', fontWeight: '700', textAlign: 'left', fontSize: '12px', letterSpacing: '0.8px', textTransform: 'uppercase' }
const tdStyle = (extra = {}) => ({ padding: '15px 18px', fontSize: '14px', color: '#cbd5e1', ...extra })

function Label({ children }) {
  return <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 5px' }}>{children}</p>
}

const emptyForm = { title: '', subtitle: '', btn_text: '', btn_link: '', order_no: 0, status: 'Active' }

function SlideModal({ slide, mode, onClose, onSaved }) {
  const [form, setForm] = useState(slide ? { title: slide.title || '', subtitle: slide.subtitle || '', btn_text: slide.btn_text || '', btn_link: slide.btn_link || '', order_no: slide.order_no ?? 0, status: slide.status || 'Active' } : emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(slide?.image ? `${BASE_URL}${slide.image}` : null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setImageFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSave = async () => {
    setSaving(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (imageFile) fd.append('image', imageFile)
    const res = mode === 'add' ? await adminApi.createSlider(fd) : await adminApi.updateSlider(slide.id, fd)
    setSaving(false)
    if (res.success) { onSaved(); onClose() }
    else Swal.fire('Error', res.message || 'Failed', 'error')
  }

  const inp = (label, key, placeholder) => (
    <div style={{ marginBottom: '15px' }}>
      <Label>{label}</Label>
      <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        style={{ width: '100%', padding: '11px 14px', background: '#0f1623', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
        onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
    </div>
  )

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(4px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', boxSizing: 'border-box' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="hide-scroll" style={{ background: '#1e2a3a', borderRadius: '20px', width: '100%', maxWidth: '540px', maxHeight: '92vh', overflowY: 'auto', border: '1px solid rgba(99,179,237,0.25)', boxShadow: '0 32px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', borderRadius: '20px 20px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa fa-picture-o" style={{ color: '#60a5fa', fontSize: '13px' }} />
            </div>
            <h3 style={{ color: '#f1f5f9', margin: 0, fontSize: '16px', fontWeight: '700' }}>{mode === 'add' ? 'Add New Slide' : 'Edit Slide'}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = '#f87171' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8' }}>×</button>
        </div>
        {/* Body */}
        <div style={{ padding: '24px' }}>
          {/* Image upload */}
          <div style={{ marginBottom: '16px' }}>
            <Label>Slide Image</Label>
            <div onClick={() => fileRef.current.click()} style={{ border: '2px dashed rgba(96,165,250,0.3)', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(96,165,250,0.04)', marginTop: '6px' }}>
              {preview
                ? <img src={preview} alt="" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover' }} />
                : <div style={{ textAlign: 'center', color: '#475569', padding: '20px' }}>
                  <i className="fa fa-upload" style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }} />
                  <span style={{ fontSize: '13px' }}>Click to upload image</span>
                </div>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          </div>

          {inp('Title', 'title', 'Slide heading')}
          {inp('Subtitle', 'subtitle', 'Short description')}
          {inp('Button Text', 'btn_text', 'e.g. View Properties')}
          {inp('Button Link', 'btn_link', 'e.g. /immobilien')}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '4px' }}>
            <div>
              <Label>Order</Label>
              <input type="number" value={form.order_no} onChange={e => setForm({ ...form, order_no: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', background: '#0f1623', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <Label>Status</Label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', background: '#0f1623', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '22px' }}>
            <button onClick={onClose} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ padding: '10px 24px', background: saving ? 'rgba(37,99,235,0.4)' : '#2563eb', border: 'none', color: '#fff', borderRadius: '10px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: saving ? 'none' : '0 4px 14px rgba(37,99,235,0.5)' }}>
              {saving ? <><i className="fa fa-spinner fa-spin" />Saving...</> : <><i className="fa fa-check" />{mode === 'add' ? 'Add Slide' : 'Save Changes'}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SliderPage() {
  const [sliders, setSliders] = useState([])
  const [selected, setSelected] = useState(null)
  const [modal, setModal] = useState(null) // { mode: 'add'|'edit', slide: null|obj }

  const load = () => adminApi.getSliders().then(d => { if (d.success) setSliders(d.data) })
  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this slide?')) return
    await adminApi.deleteSlider(id)
    if (selected?.id === id) setSelected(null)
    setSliders(prev => prev.filter(s => s.id !== id))
  }

  const statusColor = { Active: '#4ade80', Inactive: '#94a3b8' }

  return (
    <>
      {modal && <SlideModal mode={modal.mode} slide={modal.slide} onClose={() => setModal(null)} onSaved={load} />}

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

        {/* Table */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px', fontWeight: '500' }}>{sliders.length} slides total</p>
            <button onClick={() => setModal({ mode: 'add', slide: null })}
              style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 18px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', boxShadow: '0 4px 12px rgba(37,99,235,0.4)' }}>
              <i className="fa fa-plus" /> Add Slide
            </button>
          </div>

          <div style={{ background: '#1a1f2e', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: '#141824' }}>
                  {['#', 'Image', 'Title', 'Subtitle', 'Order', 'Status', 'Actions'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sliders.length === 0 ? (
                  <tr><td colSpan="7" style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontSize: '15px' }}>
                    <i className="fa fa-picture-o" style={{ fontSize: '32px', display: 'block', marginBottom: '12px', color: '#334155' }} />
                    No slides yet
                  </td></tr>
                ) : sliders.map((s, i) => (
                  <tr key={s.id} onClick={() => setSelected(s)}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', background: selected?.id === s.id ? 'rgba(37,99,235,0.12)' : 'transparent', borderLeft: selected?.id === s.id ? '3px solid #2563eb' : '3px solid transparent', transition: 'all 0.15s' }}
                    onMouseEnter={e => { if (selected?.id !== s.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                    onMouseLeave={e => { if (selected?.id !== s.id) e.currentTarget.style.background = 'transparent' }}>
                    <td style={tdStyle({ color: '#64748b', fontWeight: '600' })}>{i + 1}</td>
                    <td style={tdStyle()}>
                      {s.image
                        ? <img src={`${BASE_URL}${s.image}`} alt="" style={{ width: '80px', height: '46px', objectFit: 'cover', borderRadius: '8px' }} />
                        : <div style={{ width: '80px', height: '46px', background: '#2a3547', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa fa-image" style={{ color: '#475569' }} /></div>}
                    </td>
                    <td style={tdStyle({ color: '#f1f5f9', fontWeight: '600' })}>{s.title || '—'}</td>
                    <td style={tdStyle({ color: '#94a3b8', fontSize: '13px', maxWidth: '180px' })}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.subtitle || '—'}</div>
                    </td>
                    <td style={tdStyle({ color: '#94a3b8' })}>{s.order_no}</td>
                    <td style={tdStyle()}>
                      <span style={{ background: statusColor[s.status] + '20', color: statusColor[s.status], border: `1px solid ${statusColor[s.status]}50`, padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>{s.status}</span>
                    </td>
                    <td style={tdStyle()}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={e => { e.stopPropagation(); setModal({ mode: 'edit', slide: s }) }}
                          style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.35)', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                          <i className="fa fa-edit" />
                        </button>
                        <button onClick={e => { e.stopPropagation(); handleDelete(s.id) }}
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.35)', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                          <i className="fa fa-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{ width: '300px', flexShrink: 0, background: '#1a1f2e', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ color: '#f1f5f9', margin: 0, fontSize: '15px', fontWeight: '700' }}>Slide Detail</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setModal({ mode: 'edit', slide: selected })}
                  style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa fa-edit" />
                </button>
                <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            </div>

            {selected.image
              ? <img src={`${BASE_URL}${selected.image}`} alt="" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '10px', marginBottom: '14px' }} />
              : <div style={{ width: '100%', height: '100px', background: '#2a3547', borderRadius: '10px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa fa-image" style={{ color: '#334155', fontSize: '28px' }} />
              </div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Title',       value: selected.title || '—' },
                { label: 'Subtitle',    value: selected.subtitle || '—' },
                { label: 'Button Text', value: selected.btn_text || '—' },
                { label: 'Button Link', value: selected.btn_link || '—' },
                { label: 'Order',       value: selected.order_no },
              ].map(({ label, value }) => (
                <div key={label}>
                  <Label>{label}</Label>
                  <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0, wordBreak: 'break-all' }}>{value}</p>
                </div>
              ))}
              <div>
                <Label>Status</Label>
                <span style={{ background: statusColor[selected.status] + '20', color: statusColor[selected.status], border: `1px solid ${statusColor[selected.status]}50`, padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>{selected.status}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

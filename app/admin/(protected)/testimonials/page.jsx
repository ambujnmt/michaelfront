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

function Stars({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <i key={n} className={`fa fa-star${n <= value ? '' : '-o'}`}
          onClick={() => onChange && onChange(n)}
          style={{ fontSize: '18px', color: n <= value ? '#facc15' : '#334155', cursor: onChange ? 'pointer' : 'default' }} />
      ))}
    </div>
  )
}

const emptyForm = { name: '', position: '', message: '', rating: 5, status: 'Active' }

function TestimonialModal({ item, mode, onClose, onSaved }) {
  const [form, setForm] = useState(item ? { name: item.name || '', position: item.position || '', message: item.message || '', rating: item.rating || 5, status: item.status || 'Active' } : emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(item?.image ? `${BASE_URL}${item.image}` : null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setImageFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.message.trim()) {
      Swal.fire('Validation', 'Name and message are required.', 'warning')
      return
    }
    setSaving(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (imageFile) fd.append('image', imageFile)
    const res = mode === 'add' ? await adminApi.createTestimonial(fd) : await adminApi.updateTestimonial(item.id, fd)
    setSaving(false)
    if (res.success) { onSaved(); onClose() }
    else Swal.fire('Error', res.message || 'Failed', 'error')
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(4px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', boxSizing: 'border-box' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="hide-scroll" style={{ background: '#1e2a3a', borderRadius: '20px', width: '100%', maxWidth: '520px', maxHeight: '92vh', overflowY: 'auto', border: '1px solid rgba(99,179,237,0.25)', boxShadow: '0 32px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', borderRadius: '20px 20px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', background: 'rgba(250,204,21,0.15)', border: '1px solid rgba(250,204,21,0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa fa-star" style={{ color: '#facc15', fontSize: '13px' }} />
            </div>
            <h3 style={{ color: '#f1f5f9', margin: 0, fontSize: '16px', fontWeight: '700' }}>{mode === 'add' ? 'Add Testimonial' : 'Edit Testimonial'}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = '#f87171' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8' }}>×</button>
        </div>
        {/* Body */}
        <div style={{ padding: '24px' }}>
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div onClick={() => fileRef.current.click()} style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
              {preview
                ? <img src={preview} alt="" style={{ width: '68px', height: '68px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(96,165,250,0.4)' }} />
                : <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: '#2a3547', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(96,165,250,0.3)' }}>
                  <i className="fa fa-user" style={{ color: '#475569', fontSize: '22px' }} />
                </div>}
              <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#2563eb', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa fa-camera" style={{ color: '#fff', fontSize: '9px' }} />
              </div>
            </div>
            <div>
              <p style={{ color: '#f1f5f9', fontWeight: '600', margin: '0 0 3px', fontSize: '14px' }}>Client Photo</p>
              <p style={{ color: '#64748b', margin: 0, fontSize: '12px' }}>Optional — click to upload</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <Label>Name *</Label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Client full name"
              style={{ width: '100%', padding: '11px 14px', background: '#0f1623', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <Label>Position / Role</Label>
            <input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} placeholder="e.g. Home Buyer, Wien"
              style={{ width: '100%', padding: '11px 14px', background: '#0f1623', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <Label>Review / Message *</Label>
            <textarea rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Client's review..."
              style={{ width: '100%', padding: '12px 14px', background: '#0f1623', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: '1.6' }}
              onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '4px' }}>
            <div>
              <Label>Rating</Label>
              <div style={{ marginTop: '8px' }}>
                <Stars value={form.rating} onChange={v => setForm({ ...form, rating: v })} />
              </div>
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
              {saving ? <><i className="fa fa-spinner fa-spin" />Saving...</> : <><i className="fa fa-check" />{mode === 'add' ? 'Add Testimonial' : 'Save Changes'}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsPage() {
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [modal, setModal] = useState(null)

  const load = () => adminApi.getTestimonials().then(d => { if (d.success) setItems(d.data) })
  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return
    await adminApi.deleteTestimonial(id)
    if (selected?.id === id) setSelected(null)
    setItems(prev => prev.filter(t => t.id !== id))
  }

  const statusColor = { Active: '#4ade80', Inactive: '#94a3b8' }

  return (
    <>
      {modal && <TestimonialModal mode={modal.mode} item={modal.item} onClose={() => setModal(null)} onSaved={load} />}

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

        {/* Table */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px', fontWeight: '500' }}>{items.length} testimonials total</p>
            <button onClick={() => setModal({ mode: 'add', item: null })}
              style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 18px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', boxShadow: '0 4px 12px rgba(37,99,235,0.4)' }}>
              <i className="fa fa-plus" /> Add Testimonial
            </button>
          </div>

          <div style={{ background: '#1a1f2e', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: '#141824' }}>
                  {['#', 'Photo', 'Name', 'Position', 'Rating', 'Status', 'Actions'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan="7" style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontSize: '15px' }}>
                    <i className="fa fa-star" style={{ fontSize: '32px', display: 'block', marginBottom: '12px', color: '#334155' }} />
                    No testimonials yet
                  </td></tr>
                ) : items.map((t, i) => (
                  <tr key={t.id} onClick={() => setSelected(t)}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', background: selected?.id === t.id ? 'rgba(37,99,235,0.12)' : 'transparent', borderLeft: selected?.id === t.id ? '3px solid #2563eb' : '3px solid transparent', transition: 'all 0.15s' }}
                    onMouseEnter={e => { if (selected?.id !== t.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                    onMouseLeave={e => { if (selected?.id !== t.id) e.currentTarget.style.background = 'transparent' }}>
                    <td style={tdStyle({ color: '#64748b', fontWeight: '600' })}>{i + 1}</td>
                    <td style={tdStyle()}>
                      {t.image
                        ? <img src={`${BASE_URL}${t.image}`} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                        : <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2a3547', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa fa-user" style={{ color: '#475569' }} /></div>}
                    </td>
                    <td style={tdStyle({ color: '#f1f5f9', fontWeight: '700' })}>{t.name}</td>
                    <td style={tdStyle({ color: '#94a3b8', fontSize: '13px' })}>{t.position || '—'}</td>
                    <td style={tdStyle()}><Stars value={t.rating || 5} /></td>
                    <td style={tdStyle()}>
                      <span style={{ background: statusColor[t.status] + '20', color: statusColor[t.status], border: `1px solid ${statusColor[t.status]}50`, padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>{t.status}</span>
                    </td>
                    <td style={tdStyle()}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={e => { e.stopPropagation(); setModal({ mode: 'edit', item: t }) }}
                          style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.35)', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                          <i className="fa fa-edit" />
                        </button>
                        <button onClick={e => { e.stopPropagation(); handleDelete(t.id) }}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h4 style={{ color: '#f1f5f9', margin: 0, fontSize: '15px', fontWeight: '700' }}>Testimonial Detail</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setModal({ mode: 'edit', item: selected })}
                  style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa fa-edit" />
                </button>
                <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              {selected.image
                ? <img src={`${BASE_URL}${selected.image}`} alt="" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                : <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#2a3547', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><i className="fa fa-user" style={{ color: '#475569', fontSize: '20px' }} /></div>}
              <div>
                <p style={{ color: '#f1f5f9', fontWeight: '700', margin: '0 0 3px', fontSize: '15px' }}>{selected.name}</p>
                <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>{selected.position || '—'}</p>
                <div style={{ marginTop: '5px' }}><Stars value={selected.rating || 5} /></div>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <Label>Review</Label>
              <div style={{ background: '#0f1623', borderRadius: '10px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.06)', marginTop: '6px' }}>
                <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '21px', margin: 0, fontStyle: 'italic' }}>"{selected.message}"</p>
              </div>
            </div>

            <div>
              <Label>Status</Label>
              <span style={{ background: (selected.status === 'Active' ? '#4ade80' : '#94a3b8') + '20', color: selected.status === 'Active' ? '#4ade80' : '#94a3b8', border: `1px solid ${selected.status === 'Active' ? '#4ade80' : '#94a3b8'}50`, padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'inline-block', marginTop: '6px' }}>{selected.status}</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

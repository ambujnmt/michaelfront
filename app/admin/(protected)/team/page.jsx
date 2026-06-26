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

const inputStyle = {
  width: '100%', padding: '11px 14px', background: '#0f1623',
  border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px',
  color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
}

const emptyForm = { name: '', position: '', bio: '', email: '', phone: '', status: 'Active', sort_order: 0 }

function TeamModal({ item, mode, onClose, onSaved }) {
  const [form, setForm] = useState(item ? {
    name: item.name || '', position: item.position || '', bio: item.bio || '',
    email: item.email || '', phone: item.phone || '',
    status: item.status || 'Active', sort_order: item.sort_order || 0,
  } : emptyForm)
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
    if (!form.name.trim()) { Swal.fire('Validation', 'Name is required.', 'warning'); return }
    setSaving(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (imageFile) fd.append('image', imageFile)
    const res = mode === 'add'
      ? await adminApi.createTeamMember(fd)
      : await adminApi.updateTeamMember(item.id, fd)
    setSaving(false)
    if (res.success) { onSaved(); onClose() }
    else Swal.fire('Error', res.message || 'Failed', 'error')
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(4px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', boxSizing: 'border-box' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="hide-scroll" style={{ background: '#1e2a3a', borderRadius: '20px', width: '100%', maxWidth: '540px', maxHeight: '92vh', overflowY: 'auto', border: '1px solid rgba(99,179,237,0.25)', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', borderRadius: '20px 20px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa fa-users" style={{ color: '#60a5fa', fontSize: '13px' }} />
            </div>
            <h3 style={{ color: '#f1f5f9', margin: 0, fontSize: '16px', fontWeight: '700' }}>
              {mode === 'add' ? 'Add Team Member' : 'Edit Team Member'}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = '#f87171' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8' }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '15px' }}>

          {/* Photo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div onClick={() => fileRef.current.click()} style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
              {preview
                ? <img src={preview} alt="" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(96,165,250,0.4)' }} />
                : <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#2a3547', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(96,165,250,0.3)' }}>
                    <i className="fa fa-user" style={{ color: '#475569', fontSize: '26px' }} />
                  </div>}
              <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#2563eb', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa fa-camera" style={{ color: '#fff', fontSize: '9px' }} />
              </div>
            </div>
            <div>
              <p style={{ color: '#f1f5f9', fontWeight: '600', margin: '0 0 3px', fontSize: '14px' }}>Photo</p>
              <p style={{ color: '#64748b', margin: 0, fontSize: '12px' }}>Click to upload (optional)</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          </div>

          <div>
            <Label>Name *</Label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
          </div>

          <div>
            <Label>Position / Role</Label>
            <input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} placeholder="e.g. Senior Agent" style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
          </div>

          <div>
            <Label>Bio</Label>
            <textarea rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Short description..."
              style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
              onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <Label>Email</Label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
            </div>
            <div>
              <Label>Phone</Label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+43 ..." style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <Label>Status</Label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <Label>Sort Order</Label>
              <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} placeholder="0" style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button onClick={onClose} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Cancel</button>
            <button onClick={handleSave} disabled={saving} style={{ padding: '10px 24px', background: saving ? 'rgba(37,99,235,0.4)' : '#2563eb', border: 'none', color: '#fff', borderRadius: '10px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: saving ? 'none' : '0 4px 14px rgba(37,99,235,0.5)' }}>
              {saving ? <><i className="fa fa-spinner fa-spin" /> Saving...</> : <><i className="fa fa-check" /> {mode === 'add' ? 'Add Member' : 'Save Changes'}</>}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function TeamPage() {
  const [items, setItems] = useState([])
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)

  const load = () => adminApi.getTeam().then(d => { if (d.success) setItems(d.data) })
  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: 'Delete member?', text: 'This cannot be undone.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Delete', cancelButtonText: 'Cancel' })
    if (!result.isConfirmed) return
    await adminApi.deleteTeamMember(id)
    if (selected?.id === id) setSelected(null)
    setItems(prev => prev.filter(t => t.id !== id))
  }

  const statusColor = { Active: '#4ade80', Inactive: '#94a3b8' }

  return (
    <>
      {modal && <TeamModal mode={modal.mode} item={modal.item} onClose={() => setModal(null)} onSaved={load} />}

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

        {/* Table */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px', fontWeight: '500' }}>{items.length} team members</p>
            <button onClick={() => setModal({ mode: 'add', item: null })}
              style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 18px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', boxShadow: '0 4px 12px rgba(37,99,235,0.4)' }}>
              <i className="fa fa-plus" /> Add Member
            </button>
          </div>

          <div style={{ background: '#1a1f2e', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: '#141824' }}>
                  {['#', 'Photo', 'Name', 'Position', 'Email', 'Status', 'Actions'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan="7" style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontSize: '15px' }}>
                    <i className="fa fa-users" style={{ fontSize: '32px', display: 'block', marginBottom: '12px', color: '#334155' }} />
                    No team members yet
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
                    <td style={tdStyle({ color: '#64748b', fontSize: '13px' })}>{t.email || '—'}</td>
                    <td style={tdStyle()}>
                      <span style={{ background: (statusColor[t.status] || '#94a3b8') + '20', color: statusColor[t.status] || '#94a3b8', border: `1px solid ${statusColor[t.status] || '#94a3b8'}50`, padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>{t.status}</span>
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
          <div style={{ width: '280px', flexShrink: 0, background: '#1a1f2e', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h4 style={{ color: '#f1f5f9', margin: 0, fontSize: '15px', fontWeight: '700' }}>Member Detail</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setModal({ mode: 'edit', item: selected })}
                  style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa fa-edit" />
                </button>
                <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              {selected.image
                ? <img src={`${BASE_URL}${selected.image}`} alt="" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(96,165,250,0.3)', marginBottom: '10px' }} />
                : <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#2a3547', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}><i className="fa fa-user" style={{ color: '#475569', fontSize: '28px' }} /></div>}
              <p style={{ color: '#f1f5f9', fontWeight: '700', margin: '0 0 3px', fontSize: '16px' }}>{selected.name}</p>
              <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>{selected.position || '—'}</p>
            </div>

            {selected.bio && (
              <div style={{ marginBottom: '12px' }}>
                <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 5px' }}>Bio</p>
                <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{selected.bio}</p>
              </div>
            )}

            {selected.email && (
              <div style={{ marginBottom: '8px' }}>
                <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 4px' }}>Email</p>
                <p style={{ color: '#60a5fa', fontSize: '13px', margin: 0 }}>{selected.email}</p>
              </div>
            )}

            {selected.phone && (
              <div style={{ marginBottom: '12px' }}>
                <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 4px' }}>Phone</p>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>{selected.phone}</p>
              </div>
            )}

            <span style={{ background: (statusColor[selected.status] || '#94a3b8') + '20', color: statusColor[selected.status] || '#94a3b8', border: `1px solid ${statusColor[selected.status] || '#94a3b8'}50`, padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'inline-block' }}>{selected.status}</span>
          </div>
        )}

      </div>
    </>
  )
}

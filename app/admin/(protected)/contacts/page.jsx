'use client'

import { useEffect, useState } from 'react'
import adminApi from '@/lib/adminApi'

const statusColor = { New: '#60a5fa', Replied: '#34d399', Closed: '#94a3b8' }
const thStyle = { padding: '14px 18px', color: '#94a3b8', fontWeight: '700', textAlign: 'left', fontSize: '12px', letterSpacing: '0.8px', textTransform: 'uppercase' }
const tdStyle = (extra = {}) => ({ padding: '15px 18px', fontSize: '14px', color: '#cbd5e1', ...extra })

function Label({ children }) {
  return <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 5px' }}>{children}</p>
}

// ── Mail Modal ──────────────────────────────────────────────
const slideDown = `@keyframes slideDownC { from { opacity:0; transform:translateY(-30px); } to { opacity:1; transform:translateY(0); } }`

function MailModal({ contact, onClose }) {
  const [subject,  setSubject]  = useState('Your Message – Michael Leber Immobilien')
  const [message,  setMessage]  = useState('')
  const [sending,  setSending]  = useState(false)
  const [result,   setResult]   = useState(null)
  const [errMsg,   setErrMsg]   = useState('')

  const handleSend = async () => {
    if (!message.trim()) return
    setSending(true); setResult(null); setErrMsg('')
    try {
      const res = await adminApi.sendMail({ to: contact.email, toName: contact.name, subject, message })
      if (res.success) setResult('ok')
      else { setResult('err'); setErrMsg(res.message || 'Failed') }
    } catch (e) {
      setResult('err'); setErrMsg(e.name === 'AbortError' ? 'Timeout — check server' : e.message)
    }
    setSending(false)
  }

  return (
    <>
      <style>{slideDown}</style>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', boxSizing: 'border-box' }}
        onClick={e => e.target === e.currentTarget && onClose()}>
        <div style={{ background: '#1e2a3a', borderRadius: '20px', width: '100%', maxWidth: '520px', border: '1px solid rgba(99,179,237,0.25)', boxShadow: '0 32px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)', animation: 'slideDownC 0.22s ease forwards' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', borderRadius: '20px 20px 0 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '34px', height: '34px', background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa fa-paper-plane" style={{ color: '#60a5fa', fontSize: '13px' }} />
              </div>
              <h3 style={{ color: '#f1f5f9', margin: 0, fontSize: '16px', fontWeight: '700' }}>Send Email</h3>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = '#f87171' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8' }}>×</button>
          </div>
          {/* Body */}
          <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <Label>To</Label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0f1623', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '11px 14px' }}>
                <i className="fa fa-user-circle" style={{ color: '#475569', fontSize: '16px' }} />
                <div>
                  <p style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: '600', margin: 0 }}>{contact.name}</p>
                  <p style={{ color: '#60a5fa', fontSize: '13px', margin: 0 }}>{contact.email}</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <Label>Subject</Label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', background: '#0f1623', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Label>Message</Label>
              <textarea rows={2} placeholder="Type your message here..." value={message} onChange={e => setMessage(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', background: '#0f1623', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: '22px' }}
                onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
            </div>
            {result === 'ok' && (
              <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.35)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa fa-check-circle" style={{ color: '#34d399', fontSize: '16px' }} />
                <p style={{ color: '#34d399', fontSize: '13px', fontWeight: '600', margin: 0 }}>Email sent successfully!</p>
              </div>
            )}
            {result === 'err' && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <i className="fa fa-exclamation-circle" style={{ color: '#f87171', fontSize: '16px', marginTop: '1px', flexShrink: 0 }} />
                <p style={{ color: '#f87171', fontSize: '13px', fontWeight: '600', margin: 0 }}>{errMsg || 'Failed to send'}</p>
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={onClose} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Cancel</button>
              <button onClick={handleSend} disabled={sending || !message.trim()} style={{ padding: '10px 24px', background: sending || !message.trim() ? 'rgba(37,99,235,0.4)' : '#2563eb', border: 'none', color: '#fff', borderRadius: '10px', cursor: sending || !message.trim() ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: sending || !message.trim() ? 'none' : '0 4px 14px rgba(37,99,235,0.5)' }}>
                {sending ? <><i className="fa fa-spinner fa-spin" />Sending...</> : <><i className="fa fa-paper-plane" />Send Email</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Pagination Component ────────────────────────────────────
function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
        style={{ padding: '7px 13px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: page === 1 ? 'transparent' : '#1a1f2e', color: page === 1 ? '#334155' : '#94a3b8', cursor: page === 1 ? 'default' : 'pointer', fontSize: '13px' }}>
        <i className="fa fa-chevron-left" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
        <button key={n} onClick={() => setPage(n)}
          style={{ padding: '7px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', border: n === page ? '1px solid #2563eb' : '1px solid rgba(255,255,255,0.1)', background: n === page ? '#2563eb' : '#1a1f2e', color: n === page ? '#fff' : '#94a3b8', cursor: 'pointer' }}>{n}</button>
      ))}
      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
        style={{ padding: '7px 13px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: page === totalPages ? 'transparent' : '#1a1f2e', color: page === totalPages ? '#334155' : '#94a3b8', cursor: page === totalPages ? 'default' : 'pointer', fontSize: '13px' }}>
        <i className="fa fa-chevron-right" />
      </button>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────
export default function Contacts() {
  const [contacts,   setContacts]   = useState([])
  const [selected,   setSelected]   = useState(null)
  const [mailTarget, setMailTarget] = useState(null)
  const [search,     setSearch]     = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const fetchContacts = () =>
    adminApi.getContacts().then(d => { if (d.success) setContacts(d.data) })

  useEffect(() => { fetchContacts() }, [])

  const updateStatus = async (id, status) => {
    await adminApi.updateContactStatus(id, status)
    setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    if (selected?.id === id) setSelected(s => ({ ...s, status }))
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this contact?')) return
    await adminApi.deleteContact(id)
    if (selected?.id === id) setSelected(null)
    setContacts(prev => prev.filter(c => c.id !== id))
  }

  const filtered = contacts.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !q || c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'All' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <>
      {mailTarget && <MailModal contact={mailTarget} onClose={() => setMailTarget(null)} />}

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

        {/* Table */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Toolbar */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <i className="fa fa-search" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '13px' }} />
              <input type="text" placeholder="Search by name, email or phone..." value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                style={{ width: '100%', padding: '10px 14px 10px 36px', background: '#141824', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
              style={{ padding: '10px 14px', background: '#141824', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', cursor: 'pointer', outline: 'none' }}>
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Replied">Replied</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div style={{ background: '#1a1f2e', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: '#141824' }}>
                  {['#', 'Name', 'Email', 'Phone', 'Status', 'Actions'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontSize: '15px' }}>
                      <i className="fa fa-comment" style={{ fontSize: '32px', display: 'block', marginBottom: '12px', color: '#334155' }} />
                      {search || statusFilter !== 'All' ? 'No matching contacts found' : 'No contacts yet'}
                    </td>
                  </tr>
                ) : paginated.map((c, i) => (
                  <tr key={c.id}
                    onClick={() => setSelected(c)}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', background: selected?.id === c.id ? 'rgba(37,99,235,0.12)' : 'transparent', borderLeft: selected?.id === c.id ? '3px solid #2563eb' : '3px solid transparent', transition: 'all 0.15s' }}
                    onMouseEnter={e => { if (selected?.id !== c.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                    onMouseLeave={e => { if (selected?.id !== c.id) e.currentTarget.style.background = 'transparent' }}
                  >
                    <td style={tdStyle({ color: '#64748b', fontWeight: '600' })}>{(page - 1) * PER_PAGE + i + 1}</td>
                    <td style={tdStyle({ color: '#f1f5f9', fontWeight: '700' })}>{c.name}</td>
                    <td style={tdStyle({ color: '#94a3b8', fontSize: '13px' })}>{c.email}</td>
                    <td style={tdStyle({ color: '#94a3b8', fontSize: '13px' })}>{c.phone || '—'}</td>
                    <td style={tdStyle()}>
                      <span style={{ background: statusColor[c.status] + '20', color: statusColor[c.status], border: `1px solid ${statusColor[c.status]}50`, padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={tdStyle()}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={e => { e.stopPropagation(); setMailTarget(c) }} title="Send Email"
                          style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.35)', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                          <i className="fa fa-paper-plane" />
                        </button>
                        <button onClick={e => { e.stopPropagation(); handleDelete(c.id) }} title="Delete"
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

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>{filtered.length} / {contacts.length} contacts</p>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{ width: '340px', flexShrink: 0, background: '#1a1f2e', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h4 style={{ color: '#f1f5f9', margin: 0, fontSize: '15px', fontWeight: '700' }}>Contact Detail</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setMailTarget(selected)} style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa fa-paper-plane" />
                </button>
                <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {[
                { label: 'Name',  value: selected.name,          icon: 'fa-user',     style: { color: '#f1f5f9', fontWeight: '600' } },
                { label: 'Email', value: selected.email,         icon: 'fa-envelope', style: { color: '#94a3b8' } },
                { label: 'Phone', value: selected.phone || '—',  icon: 'fa-phone',    style: { color: '#94a3b8' } },
              ].map(({ label, value, icon, style }) => (
                <div key={label}>
                  <Label>{label}</Label>
                  <p style={{ fontSize: '14px', margin: 0, ...style }}>
                    <i className={`fa ${icon}`} style={{ color: '#475569', marginRight: '8px', width: '14px' }} />{value}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Label>Message</Label>
              <div style={{ background: '#0f1623', borderRadius: '10px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.06)', marginTop: '6px' }}>
                <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '21px', margin: 0 }}>{selected.message}</p>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <Label>Status</Label>
              <select value={selected.status} onChange={e => updateStatus(selected.id, e.target.value)}
                style={{ width: '100%', marginTop: '6px', padding: '9px 12px', borderRadius: '10px', background: statusColor[selected.status] + '20', color: statusColor[selected.status], border: `1px solid ${statusColor[selected.status]}50`, fontSize: '13px', fontWeight: '700', cursor: 'pointer', outline: 'none' }}>
                <option value="New">New</option>
                <option value="Replied">Replied</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {selected.created_at && (
              <p style={{ color: '#475569', fontSize: '12px', margin: 0 }}>
                <i className="fa fa-clock-o" style={{ marginRight: '6px' }} />
                {new Date(selected.created_at).toLocaleString('de-AT')}
              </p>
            )}
          </div>
        )}
      </div>
    </>
  )
}

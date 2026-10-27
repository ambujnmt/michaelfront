'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import adminApi from '@/lib/adminApi'
import Swal from 'sweetalert2'

import { API_URL as API } from '@/service/config'

const statusColor = { Active: '#34d399', Sold: '#94a3b8', Pending: '#fbbf24' }
const thStyle = { padding: '14px 18px', color: '#94a3b8', fontWeight: '700', textAlign: 'left', fontSize: '12px', letterSpacing: '0.8px', textTransform: 'uppercase' }
const tdStyle = (extra = {}) => ({ padding: '15px 18px', fontSize: '14px', color: '#cbd5e1', ...extra })
const typeLabel = { villa: 'Villa', apartment: 'Apartment' }

const isPremium = (p) => p.show_in_premium == 1
const PER_PAGE = 20

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

function Thumb({ p }) {
  return p.image
    ? <img src={`${API}${p.image}`} alt={p.title} style={{ width: '72px', height: '48px', objectFit: 'cover', borderRadius: '6px', display: 'block', flexShrink: 0 }} />
    : <div style={{ width: '72px', height: '48px', background: '#1e293b', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <i className="fa fa-image" style={{ color: '#334155', fontSize: '18px' }} />
      </div>
}

function TitleBlock({ p }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '14px' }}>{p.title}</div>
      {p.location && (
        <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
          <i className="fa fa-map-marker" style={{ marginRight: '6px', color: '#60a5fa' }} />{p.location}
        </div>
      )}
    </div>
  )
}

// ── Add modal: every property, with an Add / Remove button each ──
function AddModal({ properties, busyId, onToggle, onClose }) {
  const [search, setSearch] = useState('')
  const q = search.toLowerCase()
  const list = properties.filter(p => !q || p.title?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q))

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', width: '100%', maxWidth: '720px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ margin: 0, color: '#f1f5f9', fontSize: '17px', fontWeight: '700' }}>Add Premium Properties</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>
            <i className="fa fa-times" />
          </button>
        </div>

        <div style={{ padding: '16px 22px 0' }}>
          <div style={{ position: 'relative' }}>
            <i className="fa fa-search" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '13px' }} />
            <input type="text" placeholder="Search by title or location..." value={search} onChange={e => setSearch(e.target.value)} autoFocus
              style={{ width: '100%', padding: '10px 14px 10px 36px', background: '#141824', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ padding: '12px 22px 22px', maxHeight: '60vh', overflowY: 'auto' }}>
          {list.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No properties found</div>
          ) : list.map(p => {
            const added = isPremium(p)
            const busy = busyId === p.id
            return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Thumb p={p} />
                <div style={{ flex: 1, minWidth: 0 }}><TitleBlock p={p} /></div>
                <button onClick={() => onToggle(p, !added)} disabled={busy}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px', whiteSpace: 'nowrap',
                    padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '700',
                    cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.6 : 1,
                    background: added ? 'rgba(52,211,153,0.12)' : '#2563eb',
                    color: added ? '#34d399' : '#fff',
                    border: added ? '1px solid rgba(52,211,153,0.4)' : '1px solid #2563eb',
                  }}>
                  <i className={`fa ${added ? 'fa-check' : 'fa-plus'}`} />{added ? 'Added' : 'Add'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function PremiumPage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [busyId, setBusyId] = useState(null)
  const [page, setPage] = useState(1)

  const fetchProperties = async () => {
    const res = await adminApi.getProperties()
    if (res.success) setProperties(res.data)
    setLoading(false)
  }

  useEffect(() => { fetchProperties() }, [])

  const setPremium = async (p, value) => {
    setBusyId(p.id)
    const res = await adminApi.updatePremium(p.id, value)
    if (res.success) {
      setProperties(prev => prev.map(x => x.id === p.id ? { ...x, show_in_premium: value ? 1 : 0 } : x))
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Failed to update', background: '#1a1f2e', color: '#f1f5f9', confirmButtonColor: '#2563eb' })
    }
    setBusyId(null)
  }

  const handleRemove = async (p) => {
    const ok = await Swal.fire({
      icon: 'warning', title: 'Remove from Premium?', text: `"${p.title}" will no longer appear in More Premium Properties.`,
      showCancelButton: true, confirmButtonText: 'Remove', confirmButtonColor: '#ef4444', cancelButtonColor: '#334155',
      background: '#1a1f2e', color: '#f1f5f9',
    })
    if (ok.isConfirmed) setPremium(p, false)
  }

  const premium = properties.filter(isPremium)
  const totalPages = Math.ceil(premium.length / PER_PAGE)
  const paginated = premium.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // Removing the last row on the last page would leave an empty page.
  useEffect(() => {
    if (page > 1 && page > totalPages) setPage(Math.max(1, totalPages))
  }, [page, totalPages])

  return (
    <>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
          These properties appear in the <strong style={{ color: '#cbd5e1' }}>More Premium Properties</strong> slider on property detail pages.
        </p>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#2563eb', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.5)', whiteSpace: 'nowrap' }}>
          <i className="fa fa-plus" />Add Premium
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#1a1f2e', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: '#141824' }}>
              {['#', 'Property', 'Type', 'Status', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading...</td></tr>
            ) : premium.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontSize: '15px' }}>
                <i className="fa fa-diamond" style={{ fontSize: '32px', display: 'block', marginBottom: '12px', color: '#334155' }} />
                No premium properties yet. Click "Add Premium" to add some.
              </td></tr>
            ) : paginated.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={tdStyle({ color: '#64748b', fontWeight: '600' })}>{(page - 1) * PER_PAGE + i + 1}</td>
                <td style={tdStyle()}>
                  <Thumb p={p} />
                  <div style={{ marginTop: '8px' }}>
                    <Link href={`/immobilien/${p.slug}`} target="_blank" style={{ textDecoration: 'none' }}><TitleBlock p={p} /></Link>
                  </div>
                </td>
                <td style={tdStyle()}>{typeLabel[p.property_type || 'villa'] || p.property_type}</td>
                <td style={tdStyle()}>
                  <span style={{ background: statusColor[p.status] + '20', color: statusColor[p.status], border: `1px solid ${statusColor[p.status]}50`, padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>{p.status}</span>
                </td>
                <td style={tdStyle()}>
                  <button onClick={() => handleRemove(p)} disabled={busyId === p.id}
                    style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.4)', padding: '8px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', opacity: busyId === p.id ? 0.6 : 1 }}>
                    <i className="fa fa-trash" />Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>{premium.length} premium properties</p>
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>

      {showModal && (
        <AddModal properties={properties} busyId={busyId} onToggle={setPremium} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}

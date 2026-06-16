'use client'

import { useEffect, useState } from 'react'
import adminApi from '@/lib/adminApi'
import Swal from 'sweetalert2'

const thStyle = { padding: '14px 18px', color: '#94a3b8', fontWeight: '700', textAlign: 'left', fontSize: '12px', letterSpacing: '0.8px', textTransform: 'uppercase' }
const tdStyle = (extra = {}) => ({ padding: '15px 18px', fontSize: '14px', color: '#cbd5e1', ...extra })

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchSubscribers = () => {
    setLoading(true)
    adminApi.getSubscribers().then(res => {
      if (res.success) setSubscribers(res.data)
      setLoading(false)
    })
  }

  useEffect(() => { fetchSubscribers() }, [])

  const handleDelete = async (id, email) => {
    const result = await Swal.fire({
      title: 'Remove Subscriber?',
      text: `Remove ${email} from the list?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      background: '#1a1f2e',
      color: '#f1f5f9',
    })
    if (!result.isConfirmed) return
    const res = await adminApi.deleteSubscriber(id)
    if (res.success) fetchSubscribers()
  }

  const filtered = subscribers.filter(s =>
    !search || s.email.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (iso) => new Date(iso).toLocaleDateString('de-AT', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })

  return (
    <>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
          <i className="fa fa-search" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '13px' }} />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px 10px 36px',
              background: '#141824', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#1a1f2e', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: '#141824' }}>
              {['#', 'Email', 'Subscribed On', 'Action'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontSize: '15px' }}>
                  <i className="fa fa-bell-slash" style={{ fontSize: '32px', display: 'block', marginBottom: '12px', color: '#334155' }} />
                  {search ? 'No matching subscribers' : 'No subscribers yet'}
                </td>
              </tr>
            ) : filtered.map((s, i) => (
              <tr key={s.id}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={tdStyle({ color: '#64748b', fontWeight: '600' })}>{i + 1}</td>
                <td style={tdStyle({ color: '#f1f5f9', fontWeight: '600' })}>
                  <i className="fa fa-envelope" style={{ marginRight: '8px', color: '#60a5fa' }} />
                  {s.email}
                </td>
                <td style={tdStyle({ color: '#94a3b8' })}>{formatDate(s.created_at)}</td>
                <td style={tdStyle()}>
                  <button onClick={() => handleDelete(s.id, s.email)} style={{
                    background: 'rgba(239,68,68,0.15)', color: '#f87171',
                    border: '1px solid rgba(239,68,68,0.35)',
                    padding: '7px 14px', borderRadius: '8px',
                    cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                  }}>
                    <i className="fa fa-trash" style={{ marginRight: '5px' }} />Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Count */}
      <p style={{ color: '#64748b', margin: '12px 0 0 4px', fontSize: '13px' }}>
        {filtered.length} / {subscribers.length} subscribers
      </p>
    </>
  )
}

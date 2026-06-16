'use client'

import { useEffect, useState } from 'react'
import adminApi from '@/lib/adminApi'

const statusColor = { New: '#60a5fa', Replied: '#34d399', Closed: '#94a3b8' }
const thStyle = { padding: '14px 18px', color: '#94a3b8', fontWeight: '700', textAlign: 'left', fontSize: '12px', letterSpacing: '0.8px', textTransform: 'uppercase' }
const tdStyle = (extra = {}) => ({ padding: '15px 18px', fontSize: '14px', color: '#cbd5e1', ...extra })

export default function Inquiries() {

  const [inquiries, setInquiries] = useState([])

  const fetchInquiries = () => {
    adminApi.getInquiries()
      .then(data => { if (data.success) setInquiries(data.data) })
  }

  useEffect(() => { fetchInquiries() }, [])

  const updateStatus = async (id, status) => {
    await adminApi.updateInquiryStatus(id, status)
    fetchInquiries()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this inquiry?')) return
    await adminApi.deleteInquiry(id)
    fetchInquiries()
  }

  return (
    <>
      <div style={{ marginBottom: '22px' }}>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px', fontWeight: '500' }}>{inquiries.length} inquiries total</p>
      </div>

      <div style={{ background: '#1a1f2e', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: '#141824' }}>
              {['#', 'Name', 'Email', 'Phone', 'Message', 'Status', 'Actions'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontSize: '15px' }}>
                  <i className="fa fa-envelope" style={{ fontSize: '32px', display: 'block', marginBottom: '12px', color: '#334155' }} />
                  No inquiries yet
                </td>
              </tr>
            ) : inquiries.map((inq, i) => (
              <tr key={inq.id}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={tdStyle({ color: '#64748b', fontWeight: '600' })}>{i + 1}</td>
                <td style={tdStyle({ color: '#f1f5f9', fontWeight: '700' })}>{inq.name}</td>
                <td style={tdStyle({ color: '#94a3b8' })}>{inq.email}</td>
                <td style={tdStyle({ color: '#94a3b8' })}>{inq.phone || '—'}</td>
                <td style={tdStyle({ maxWidth: '200px' })}>
                  <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {inq.message}
                  </span>
                </td>
                <td style={tdStyle()}>
                  <select value={inq.status} onChange={e => updateStatus(inq.id, e.target.value)} style={{
                    background: statusColor[inq.status] + '20',
                    color: statusColor[inq.status],
                    border: `1px solid ${statusColor[inq.status]}50`,
                    borderRadius: '20px', padding: '6px 12px',
                    fontSize: '12px', fontWeight: '700', cursor: 'pointer', outline: 'none',
                  }}>
                    <option value="New">New</option>
                    <option value="Replied">Replied</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td style={tdStyle()}>
                  <button onClick={() => handleDelete(inq.id)} style={{
                    background: 'rgba(239,68,68,0.15)', color: '#f87171',
                    border: '1px solid rgba(239,68,68,0.35)',
                    padding: '7px 14px', borderRadius: '8px',
                    cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                  }}>
                    <i className="fa fa-trash" style={{ marginRight: '5px' }} />Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

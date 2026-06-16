'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import adminApi from '@/lib/adminApi'
import Swal from 'sweetalert2'

const statusColor = { Active: '#34d399', Sold: '#94a3b8', Pending: '#fbbf24' }

const thStyle = { padding: '14px 18px', color: '#94a3b8', fontWeight: '700', textAlign: 'left', fontSize: '12px', letterSpacing: '0.8px', textTransform: 'uppercase' }
const tdStyle = (extra = {}) => ({ padding: '15px 18px', fontSize: '14px', color: '#cbd5e1', ...extra })

export default function Properties() {
  const router = useRouter()
  const [properties, setProperties] = useState([])
  const [flash, setFlash] = useState(null)
  const flashRef = useRef(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const showFlash = (type, msg) => {
    setFlash({ type, msg })
    setTimeout(() => flashRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    setTimeout(() => setFlash(null), 4000)
  }

  const fetchProperties = () => {
    adminApi.getProperties().then(data => { if (data.success) setProperties(data.data) })
  }

  useEffect(() => { fetchProperties() }, [])

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Property?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      background: '#1a1f2e',
      color: '#f1f5f9',
    })
    if (!result.isConfirmed) return
    const res = await adminApi.deleteProperty(id)
    if (res.success) {
      showFlash('success', 'Property deleted successfully!')
      fetchProperties()
    } else {
      showFlash('error', res.message || 'Failed to delete property')
    }
  }

  const filtered = properties.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.title?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'All' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleSearchChange = (val) => { setSearch(val); setPage(1) }
  const handleStatusChange = (val) => { setStatusFilter(val); setPage(1) }

  return (
    <>
      {/* Flash Message */}
      {flash && (
        <div ref={flashRef} style={{
          background: flash.type === 'success' ? 'rgba(52,211,153,0.12)' : 'rgba(239,68,68,0.12)',
          border: `1px solid ${flash.type === 'success' ? 'rgba(52,211,153,0.4)' : 'rgba(239,68,68,0.4)'}`,
          color: flash.type === 'success' ? '#34d399' : '#f87171',
          padding: '13px 18px', borderRadius: '12px', marginBottom: '18px',
          fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <i className={`fa fa-${flash.type === 'success' ? 'check-circle' : 'exclamation-circle'}`} />
          {flash.msg}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
        {/* Search + Status */}
        <div style={{ display: 'flex', gap: '10px', flex: 1, flexWrap: 'wrap' }}>
          {/* Search input */}
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <i className="fa fa-search" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '13px' }} />
            <input
              type="text"
              placeholder="Search by title or location..."
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px 10px 36px',
                background: '#141824', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => handleStatusChange(e.target.value)}
            style={{
              padding: '10px 14px', background: '#141824',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Sold">Sold</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => router.push('/admin/properties/create')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#2563eb', color: '#fff', border: 'none',
              padding: '11px 22px', borderRadius: '12px',
              fontWeight: '700', fontSize: '14px', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37,99,235,0.5)', whiteSpace: 'nowrap',
            }}>
            <i className="fa fa-plus" />
            Add Property
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#1a1f2e', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: '#141824' }}>
              {['#', 'Title', 'Location', 'Price', 'Size', 'Status', 'Actions'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontSize: '15px' }}>
                  <i className="fa fa-search" style={{ fontSize: '32px', display: 'block', marginBottom: '12px', color: '#334155' }} />
                  {search || statusFilter !== 'All' ? 'No matching properties found' : 'No properties found'}
                </td>
              </tr>
            ) : paginated.map((p, i) => (
              <tr key={p.id}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={tdStyle({ color: '#64748b', fontWeight: '600' })}>{i + 1}</td>
                <td style={tdStyle({ color: '#f1f5f9', fontWeight: '700' })}>{p.title}</td>
                <td style={tdStyle()}>
                  <i className="fa fa-map-marker" style={{ marginRight: '7px', color: '#60a5fa' }} />
                  {p.location}
                </td>
                <td style={tdStyle({ color: '#f1f5f9', fontWeight: '700' })}>€ {Number(p.price).toLocaleString()}</td>
                <td style={tdStyle()}>{p.size} m²</td>
                <td style={tdStyle()}>
                  <span style={{
                    background: statusColor[p.status] + '20',
                    color: statusColor[p.status],
                    border: `1px solid ${statusColor[p.status]}50`,
                    padding: '5px 14px', borderRadius: '20px',
                    fontSize: '12px', fontWeight: '700',
                  }}>
                    {p.status}
                  </span>
                </td>
                <td style={tdStyle()}>
                  <button onClick={() => router.push(`/admin/properties/edit/${p.id}`)} style={{
                    background: 'rgba(96,165,250,0.15)', color: '#60a5fa',
                    border: '1px solid rgba(96,165,250,0.35)',
                    padding: '7px 14px', borderRadius: '8px',
                    cursor: 'pointer', fontSize: '13px', marginRight: '8px', fontWeight: '600',
                  }}>
                    <i className="fa fa-pencil" style={{ marginRight: '5px' }} />Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={{
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

      {/* Footer: count + pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>
          {filtered.length} / {properties.length} properties
        </p>

        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: '7px 13px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                background: page === 1 ? 'transparent' : '#1a1f2e',
                color: page === 1 ? '#334155' : '#94a3b8',
                cursor: page === 1 ? 'default' : 'pointer', fontSize: '13px',
              }}
            >
              <i className="fa fa-chevron-left" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                style={{
                  padding: '7px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                  border: n === page ? '1px solid #2563eb' : '1px solid rgba(255,255,255,0.1)',
                  background: n === page ? '#2563eb' : '#1a1f2e',
                  color: n === page ? '#fff' : '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: '7px 13px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                background: page === totalPages ? 'transparent' : '#1a1f2e',
                color: page === totalPages ? '#334155' : '#94a3b8',
                cursor: page === totalPages ? 'default' : 'pointer', fontSize: '13px',
              }}
            >
              <i className="fa fa-chevron-right" />
            </button>
          </div>
        )}
      </div>
    </>
  )
}

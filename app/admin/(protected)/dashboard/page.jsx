'use client'

import { useEffect, useState } from 'react'
import adminApi from '@/lib/adminApi'

const statCards = (s) => [
  { label: 'Total Properties', value: s.totalProperties, icon: 'fa-building', bg: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', shadow: 'rgba(59,130,246,0.4)' },
  { label: 'Total Inquiries',  value: s.totalInquiries,  icon: 'fa-envelope', bg: 'linear-gradient(135deg,#10b981,#047857)', shadow: 'rgba(16,185,129,0.4)' },
  { label: 'New Inquiries',    value: s.newInquiries,    icon: 'fa-bell',     bg: 'linear-gradient(135deg,#f59e0b,#b45309)', shadow: 'rgba(245,158,11,0.4)' },
]

const quickLinks = [
  { label: 'Manage Properties', path: '/admin/properties', icon: 'fa-building', color: '#60a5fa', bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.35)' },
  { label: 'View Inquiries',    path: '/admin/inquiries',  icon: 'fa-envelope', color: '#34d399', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.35)' },
  { label: 'Settings',          path: '/admin/settings',   icon: 'fa-cog',      color: '#fbbf24', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.35)' },
]

export default function Dashboard() {

  const [stats, setStats] = useState({ totalProperties: 0, totalInquiries: 0, newInquiries: 0 })

  useEffect(() => {
    adminApi.getStats()
      .then(data => { if (data.success) setStats(data.data) })
      .catch(() => {})
  }, [])

  return (
    <>
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '28px' }}>
        {statCards(stats).map((c) => (
          <div key={c.label} style={{
            background: c.bg, borderRadius: '18px', padding: '28px',
            boxShadow: `0 8px 24px ${c.shadow}`, color: '#fff',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: '0 0 12px', fontSize: '14px', color: 'rgba(255,255,255,0.85)', fontWeight: '500' }}>{c.label}</p>
                <h2 style={{ margin: 0, fontSize: '48px', fontWeight: '800', lineHeight: 1, color: '#fff' }}>{c.value}</h2>
              </div>
              <div style={{
                width: '50px', height: '50px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className={`fa ${c.icon}`} style={{ fontSize: '22px', color: '#fff' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{ background: '#1a1f2e', borderRadius: '18px', padding: '28px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 style={{ color: '#f1f5f9', marginBottom: '20px', fontSize: '16px', fontWeight: '700' }}>Quick Links</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
          {quickLinks.map((item) => (
            <a key={item.label} href={item.path} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              background: item.bg, borderRadius: '14px', padding: '20px',
              color: item.color, fontWeight: '600', fontSize: '14px',
              textDecoration: 'none', border: `1px solid ${item.border}`,
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${item.border}` }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{
                width: '42px', height: '42px', borderRadius: '10px',
                background: item.bg, border: `1px solid ${item.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className={`fa ${item.icon}`} style={{ color: item.color, fontSize: '17px' }} />
              </div>
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}

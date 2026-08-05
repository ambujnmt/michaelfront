'use client'

import { usePathname } from 'next/navigation'

const pageTitles = {
  '/admin/dashboard':  'Dashboard',
  '/admin/properties': 'Properties',
  '/admin/inquiries':  'Inquiries',
  '/admin/settings':   'Settings',
  '/admin/subscribers':'Subscribers',
}

export default function AdminHeader({ admin, onToggle }) {
  const pathname = usePathname()

  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 20px',
      marginBottom: '28px',
      background: '#1a1f2e',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    }}>

      {/* Left: Toggle + Welcome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggle}
          style={{
            background: 'none', border: 'none',
            cursor: 'pointer', padding: '6px',
            display: 'flex', flexDirection: 'column', gap: '5px',
          }}
        >
          <span style={{ display: 'block', width: '22px', height: '2px', background: '#94a3b8', borderRadius: '2px' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: '#94a3b8', borderRadius: '2px' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: '#94a3b8', borderRadius: '2px' }} />
        </button>

        <div>
          <h2 style={{ color: '#fff', fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>Welcome Back</h2>
        </div>
      </div>

      {/* Right: Admin info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: '#f1f5f9', fontWeight: '600', margin: 0, fontSize: '14px' }}>{admin?.name}</p>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '12px' }}>{admin?.email}</p>
        </div>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'linear-gradient(135deg,#3b82f6,#2563eb)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: '700', fontSize: '18px',
          boxShadow: '0 4px 14px rgba(37,99,235,0.5)',
        }}>
          {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
        </div>
      </div>

    </div>
  )
}

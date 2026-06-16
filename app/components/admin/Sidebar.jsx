'use client'

import { useRouter, usePathname } from 'next/navigation'
import Swal from 'sweetalert2'

const menuItems = [
  { label: 'Dashboard',   path: '/admin/dashboard',   icon: 'fa-tachometer' },
  { label: 'Properties',  path: '/admin/properties',  icon: 'fa-building' },
  { label: 'Inquiries',   path: '/admin/inquiries',   icon: 'fa-envelope' },
  { label: 'Subscribers', path: '/admin/subscribers', icon: 'fa-bell' },
  { label: 'Settings',    path: '/admin/settings',    icon: 'fa-cog' },
]

export default function Sidebar() {
  const router   = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminData')
        router.push('/admin/login')
      }
    })
  }

  return (
    <div style={{
      width: '260px', height: '100vh', flexShrink: 0,
      background: '#1a1f2e',
      borderRight: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', flexDirection: 'column',
      padding: '28px 16px',
    }}>

      {/* Logo */}
      <div style={{ marginBottom: '40px', paddingLeft: '10px' }}>
        <img src="/assets/img/logo.png" alt="logo" style={{ width: '130px' }} />
      </div>

      {/* Label */}
      <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '10px', paddingLeft: '14px' }}>
        NAVIGATION
      </p>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <li key={item.label}
                onClick={() => router.push(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', borderRadius: '12px', marginBottom: '4px',
                  background: isActive ? '#2563eb' : 'transparent',
                  color: isActive ? '#ffffff' : '#a0aec0',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '14px', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a0aec0' } }}
              >
                <i className={`fa ${item.icon}`} style={{ width: '18px', textAlign: 'center', fontSize: '15px', opacity: isActive ? 1 : 0.8 }} />
                {item.label}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <button onClick={handleLogout} style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        width: '100%', padding: '13px 16px', borderRadius: '12px',
        background: 'rgba(239,68,68,0.15)',
        border: '1px solid rgba(239,68,68,0.4)',
        color: '#fc8181', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
        transition: 'all 0.2s',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.28)'; e.currentTarget.style.color = '#fff' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#fc8181' }}
      >
        <i className="fa fa-sign-out" style={{ fontSize: '15px' }} />
        Logout
      </button>

    </div>
  )
}

'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Swal from 'sweetalert2'

const menuItems = [
  { label: 'Dashboard',    path: '/admin/dashboard',    icon: 'fa-tachometer' },
  { label: 'Properties',   path: '/admin/properties',   icon: 'fa-building' },
  { label: 'Inquiries',    path: '/admin/inquiries',    icon: 'fa-envelope' },
  { label: 'Contacts',     path: '/admin/contacts',     icon: 'fa-comment' },
  { label: 'Slider',       path: '/admin/slider',       icon: 'fa-picture-o' },
  { label: 'Testimonials', path: '/admin/testimonials', icon: 'fa-star' },
  { label: 'Blog',         path: '/admin/blog',         icon: 'fa-pencil-square-o' },
  { label: 'Team',         path: '/admin/team',         icon: 'fa-users' },
  { label: 'Subscribers',  path: '/admin/subscribers',  icon: 'fa-bell' },
  { label: 'Settings',     path: '/admin/settings',     icon: 'fa-cog' },
]

export default function Sidebar({ onNavigate }) {
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
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* Logo area */}
      <div style={{
        padding: '28px 24px 22px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <img src="/assets/img/logo.png" alt="logo" style={{ width: '120px', display: 'block' }} />
      </div>

      {/* Nav */}
      <nav className="hide-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '16px 12px' }}>

        <p style={{ color: '#4a5f7a', fontSize: '10px', fontWeight: '800', letterSpacing: '1.8px', margin: '0 0 10px 10px' }}>
          MENU
        </p>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <li key={item.label} style={{ marginBottom: '2px' }}>
                <Link
                  href={item.path}
                  onClick={() => !isActive && onNavigate?.()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '11px 14px', borderRadius: '10px',
                    background: isActive ? 'rgba(37,99,235,0.18)' : 'transparent',
                    color: isActive ? '#60a5fa' : '#8ea3ba',
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '13.5px', textDecoration: 'none',
                    borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                    transition: 'all 0.18s',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                      e.currentTarget.style.color = '#94a3b8'
                      e.currentTarget.style.borderLeft = '3px solid rgba(59,130,246,0.3)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = '#8ea3ba'
                      e.currentTarget.style.borderLeft = '3px solid transparent'
                    }
                  }}
                >
                  {/* Icon box */}
                  <span style={{
                    width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                    background: isActive ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isActive ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.06)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <i className={`fa ${item.icon}`} style={{ fontSize: '13px', color: isActive ? '#60a5fa' : '#6b85a0' }} />
                  </span>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px' }}>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          width: '100%', padding: '11px 14px', borderRadius: '10px',
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          color: '#f87171', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer',
          transition: 'all 0.18s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = '#f87171' }}
        >
          <span style={{
            width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="fa fa-sign-out" style={{ fontSize: '13px', color: '#f87171' }} />
          </span>
          Logout
        </button>
      </div>

    </div>
  )
}

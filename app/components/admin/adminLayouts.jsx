'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import AdminHeader from './Header'

export default function AdminLayout({ children }) {

  const router = useRouter()
  const [admin,   setAdmin]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token     = localStorage.getItem('adminToken')
    const adminData = localStorage.getItem('adminData')
    if (!token) {
      router.push('/admin/login')
    } else {
      setAdmin(JSON.parse(adminData))
      setLoading(false)
    }
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0f1623', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#94a3b8', fontSize: '15px' }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ height: '100vh', background: '#0f1623', display: 'flex', overflow: 'hidden' }}>

      {/* Sidebar — fixed */}
      <div style={{ flexShrink: 0, height: '100vh' }}>
        <Sidebar />
      </div>

      {/* Right side */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

        {/* Header — fixed */}
        <div style={{ flexShrink: 0, padding: '14px 36px 0', background: '#0f1623' }}>
          <AdminHeader admin={admin} />
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 36px 36px' }}>
          {children}
        </div>

      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import AdminHeader from './Header'

export default function AdminLayout({ children }) {

  const router   = useRouter()
  const pathname = usePathname()
  const [admin,       setAdmin]       = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [navProgress, setNavProgress] = useState(false)
  const [prevPath,    setPrevPath]    = useState(null)

  // Show progress bar when pathname changes (navigation in progress → done)
  useEffect(() => {
    if (prevPath !== null && prevPath !== pathname) setNavProgress(false)
    setPrevPath(pathname)
  }, [pathname])

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
    <div style={{ height: '100vh', background: '#0f1623', display: 'flex', overflow: 'hidden', position: 'relative', zIndex: 0 }}>
      {/* Top navigation progress bar */}
      {navProgress && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', zIndex: 99999, background: 'rgba(37,99,235,0.15)' }}>
          <style>{`
            @keyframes nav-slide { 0%{width:0%} 60%{width:75%} 100%{width:92%} }
            .nav-bar { height: 3px; background: linear-gradient(90deg,#2563eb,#60a5fa); animation: nav-slide 2s ease-out forwards; border-radius: 0 2px 2px 0; }
          `}</style>
          <div className="nav-bar" />
        </div>
      )}
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none !important; }
        .hide-scroll { -ms-overflow-style: none !important; scrollbar-width: none !important; }

        /* Quill dark theme */
        .ql-toolbar.ql-snow {
          background: #141824;
          border: 1px solid rgba(255,255,255,0.12) !important;
          border-bottom: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 10px 10px 0 0;
          padding: 10px 12px;
        }
        .ql-container.ql-snow {
          background: #0f1623;
          border: 1px solid rgba(255,255,255,0.12) !important;
          border-top: none !important;
          border-radius: 0 0 10px 10px;
          font-size: 15px;
          color: #e2e8f0;
        }
        .ql-editor {
          min-height: 320px;
          color: #e2e8f0 !important;
          line-height: 1.8;
          padding: 16px 18px;
        }
        .ql-editor * {
          color: inherit !important;
        }
        .ql-editor.ql-blank::before {
          color: #475569 !important;
          font-style: normal;
          font-size: 14px;
        }
        .ql-toolbar .ql-stroke { stroke: #94a3b8 !important; }
        .ql-toolbar .ql-fill   { fill:   #94a3b8 !important; }
        .ql-toolbar .ql-picker-label { color: #94a3b8 !important; }
        .ql-toolbar button:hover .ql-stroke,
        .ql-toolbar button.ql-active .ql-stroke { stroke: #60a5fa !important; }
        .ql-toolbar button:hover .ql-fill,
        .ql-toolbar button.ql-active .ql-fill   { fill:   #60a5fa !important; }
        .ql-toolbar button:hover .ql-picker-label,
        .ql-toolbar .ql-picker-label:hover      { color:  #60a5fa !important; }
        .ql-picker-options {
          background: #1e2a3a !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
          border-radius: 8px !important;
          color: #e2e8f0 !important;
        }
        .ql-picker-item:hover { color: #60a5fa !important; }
        .ql-editor h1, .ql-editor h2, .ql-editor h3 { color: #f1f5f9 !important; }
        .ql-editor p, .ql-editor li, .ql-editor span { color: #e2e8f0 !important; }
        .ql-editor blockquote {
          border-left: 3px solid #2563eb;
          padding-left: 14px;
          color: #94a3b8;
        }
        .ql-editor a { color: #60a5fa; }
        .ql-snow .ql-tooltip {
          background: #1e2a3a;
          border: 1px solid rgba(255,255,255,0.15);
          color: #e2e8f0;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }
        .ql-snow .ql-tooltip input[type=text] {
          background: #0f1623;
          border: 1px solid rgba(255,255,255,0.12);
          color: #e2e8f0;
          border-radius: 6px;
        }
        .ql-snow .ql-tooltip a.ql-action,
        .ql-snow .ql-tooltip a.ql-remove { color: #60a5fa; }

        /* Input / Select / Textarea focus */
        input:focus, textarea:focus, select:focus {
          outline: none !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.2) !important;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        input, textarea, select {
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        /* Text selection highlight */
        input::selection, textarea::selection {
          background: rgba(59,130,246,0.45);
          color: #ffffff;
        }
        input::-moz-selection, textarea::-moz-selection {
          background: rgba(59,130,246,0.45);
          color: #ffffff;
        }
      `}</style>

      {/* Sidebar — slides in/out */}
      <div style={{
        flexShrink: 0, height: '100vh',
        width: sidebarOpen ? '260px' : '0px',
        overflow: 'hidden',
        transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <Sidebar onNavigate={() => setNavProgress(true)} />
      </div>

      {/* Right side */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', minWidth: 0 }}>

        {/* Header */}
        <div style={{ flexShrink: 0, padding: '14px 20px 0', background: '#0f1623' }}>
          <AdminHeader admin={admin} onToggle={() => setSidebarOpen(o => !o)} sidebarOpen={sidebarOpen} />
        </div>

        {/* Scrollable content */}
        <div className="hide-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 36px' }}>
          {children}
        </div>

      </div>
    </div>
  )
}

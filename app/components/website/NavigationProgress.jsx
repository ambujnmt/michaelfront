'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function NavigationProgress() {
  const pathname = usePathname()
  const [active, setActive] = useState(false)
  const prevPath = useRef(pathname)
  const timer = useRef(null)

  useEffect(() => {
    if (prevPath.current !== pathname) {
      setActive(false)
      clearTimeout(timer.current)
    }
    prevPath.current = pathname
  }, [pathname])

  useEffect(() => {
    const links = document.querySelectorAll('a[href]')
    const handler = (e) => {
      const href = e.currentTarget.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return
      if (href !== pathname) {
        setActive(true)
        timer.current = setTimeout(() => setActive(false), 4000)
      }
    }
    links.forEach(l => l.addEventListener('click', handler))
    return () => {
      links.forEach(l => l.removeEventListener('click', handler))
      clearTimeout(timer.current)
    }
  }, [pathname])

  if (!active) return null

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', zIndex: 99999 }}>
      <style>{`
        @keyframes nav-progress { 0%{width:0%} 60%{width:80%} 100%{width:95%} }
        .nav-progress-bar { height:3px; background:#1a1a1a; animation:nav-progress 2.5s ease-out forwards; }
      `}</style>
      <div className="nav-progress-bar" />
    </div>
  )
}

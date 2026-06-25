'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import websiteApi from './websiteApi'

const defaultInfo = {
  site_name: 'Michael Leber Immobilien',
  email: 'office@michaelleber.at',
  phone: '+43 664 547 5915',
  address: 'Musterstraße 1, 1010 Wien, Österreich',
  opening_hours: 'Mo – Fr: 09:00 – 18:00',
}

const SiteInfoContext = createContext(defaultInfo)

const CACHE_KEY = 'site_info_v1'

export function SiteInfoProvider({ children }) {
  const [siteInfo, setSiteInfo] = useState(defaultInfo)

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      if (cached) {
        setSiteInfo({ ...defaultInfo, ...JSON.parse(cached) })
        return
      }
    } catch {}
    websiteApi.getSiteInfo().then(res => {
      if (res.success && res.data) {
        const merged = {
          ...defaultInfo,
          ...Object.fromEntries(Object.entries(res.data).filter(([, v]) => v)),
        }
        setSiteInfo(merged)
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(merged)) } catch {}
      }
    }).catch(() => {})
  }, [])

  return (
    <SiteInfoContext.Provider value={siteInfo}>
      {children}
    </SiteInfoContext.Provider>
  )
}

export const useSiteInfo = () => useContext(SiteInfoContext)

'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import websiteApi from './websiteApi'

const defaultInfo = {
  site_name: 'Michael Leber Immobilien',
  email: 'office@michaelleber.at',
  phone: '+43 664 547 5915',
  address: 'Musterstraße 1, 1010 Wien, Österreich',
  opening_hours: 'Mo – Fr: 09:00 – 18:00',
  newsletter_bg: '',
  facebook: '',
  instagram: '',
  linkedin: '',
  youtube: '',
  twitter: '',
}

const SiteInfoContext = createContext(defaultInfo)

export function SiteInfoProvider({ children }) {
  const [siteInfo, setSiteInfo] = useState(defaultInfo)

  useEffect(() => {
    // Always fetch fresh — this data (especially newsletter_bg) can change
    // anytime from the admin panel, so we don't want a stale cached copy
    // sitting around for the whole browser session.
    websiteApi.getSiteInfo().then(res => {
      if (res.success && res.data) {
        const merged = {
          ...defaultInfo,
          ...Object.fromEntries(Object.entries(res.data).filter(([, v]) => v)),
        }
        setSiteInfo(merged)
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
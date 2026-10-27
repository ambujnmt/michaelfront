'use client'

import { LanguageProvider } from '@/lib/LanguageContext'
import { SiteInfoProvider } from '@/lib/SiteInfoContext'
import NavigationProgress from './NavigationProgress'

export default function WebsiteLayout({ children }) {
  return (
    <LanguageProvider>
      <SiteInfoProvider>
        <NavigationProgress />
        {/* Site-wide (DE + EN): text wraps only between whole words — never
            mid-word, never with auto-hyphenation, even for long German
            compounds. !important beats inline styles carried by content pasted
            into the admin editor. Links are the only exception, so a long
            URL/email can't push the page sideways on mobile. */}
        <style>{`
          body, body * {
            word-break: normal !important;
            overflow-wrap: normal !important;
            word-wrap: normal !important;
            -webkit-hyphens: none !important;
            hyphens: none !important;
          }
          body a { overflow-wrap: anywhere !important; }
        `}</style>
        {children}
      </SiteInfoProvider>
    </LanguageProvider>
  )
}

'use client'

import { LanguageProvider } from '@/lib/LanguageContext'
import { SiteInfoProvider } from '@/lib/SiteInfoContext'
import NavigationProgress from './NavigationProgress'

export default function WebsiteLayout({ children }) {
  return (
    <LanguageProvider>
      <SiteInfoProvider>
        <NavigationProgress />
        {children}
      </SiteInfoProvider>
    </LanguageProvider>
  )
}

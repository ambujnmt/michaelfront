'use client'

import { LanguageProvider } from '@/lib/LanguageContext'

export default function WebsiteLayout({ children }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  )
}

'use client'

import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext({ lang: 'de', setLang: () => {} })

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('de')
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)

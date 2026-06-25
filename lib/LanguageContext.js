'use client'

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const LanguageContext = createContext({ lang: 'de', setLang: () => {} })

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('de')

  useEffect(() => {
    const saved = localStorage.getItem('lang')
    if (saved === 'en' || saved === 'de') setLang(saved)
  }, [])

  const handleSetLang = useCallback((l) => {
    setLang(l)
    localStorage.setItem('lang', l)
  }, [])

  const value = useMemo(() => ({ lang, setLang: handleSetLang }), [lang, handleSetLang])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)

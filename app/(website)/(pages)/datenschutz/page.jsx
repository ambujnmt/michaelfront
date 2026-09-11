'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'
import websiteApi from '@/lib/websiteApi'

const icons = ['fa-shield', 'fa-database', 'fa-user', 'fa-envelope']

export default function Datenschutz() {
  const router = useRouter()
  const { lang } = useLanguage()
  const tr = translations.dataProtection[lang]

  const [privacyPage, setPrivacyPage] = useState(null)

  useEffect(() => {
    websiteApi.getPrivacyPage()
      .then(res => { if (res.success) setPrivacyPage(res.data) })
      .catch(() => {})
  }, [])

  const pick = (dbVal, fallback) => (dbVal && dbVal.trim()) ? dbVal : fallback
  const stripEmptyBlocks = (html) => (html || '').replace(/<(p|li)>(\s|&nbsp;|<br\s*\/?>)*<\/\1>/gi, '')

  const titleText    = pick(privacyPage?.[`title_${lang}`], tr.bannerTitle)
  const subtitleText = pick(privacyPage?.[`subtitle_${lang}`], tr.bannerSub)

  const dbSections = (privacyPage?.sections || []).filter(s => s[`heading_${lang}`]?.trim() || s[`content_${lang}`]?.trim())

  const sections = dbSections.length > 0
    ? dbSections.map(s => ({ title: s[`heading_${lang}`], html: stripEmptyBlocks(s[`content_${lang}`]) }))
    : [
        { title: tr.sec1Title, html: `<p>${tr.sec1Text}</p>` },
        { title: tr.sec2Title, html: `<p>${tr.sec2Text}</p>` },
        { title: tr.sec3Title, html: `<p>${tr.sec3Text}</p>` },
        { title: tr.sec4Title, html: `<p>${tr.sec4Text}</p>` },
      ]

  return (
    <>
      {/* Page Heading — centered banner (matches /kontakt) */}
      <section className="inner-page-banner head-sec" style={{ padding: '50px 0px 50px 0px' }}>
        <div className="container text-center page-banner-inner">
          <button onClick={() => router.back()} className="btn btn1 page-banner-back" style={{ fontSize: '13px', padding: '8px 20px', flexShrink: 0 }}>
            <i className="fa fa-arrow-left" style={{ marginRight: '6px' }}></i>
            {lang === 'de' ? 'Zurück' : 'Back'}
          </button>
          <h1 style={{ margin: '0 0 8px' }}>{titleText}</h1>
          <h4 style={{ margin: 0 }}>{subtitleText}</h4>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding" style={{paddingBottom: '90px' }}>
        <div className="container">

          {/* Cards */}
          <style>{`
            .privacy-card-text * { max-width: 100%; overflow-wrap: break-word; white-space: normal; }
            .privacy-card-text p { margin: 0; }
            .privacy-card-text p + p { margin-top: 10px; }
          `}</style>
          <div className="row g-4">
            {sections.map((sec, i) => (
              <div key={i} className="col-12">
                <div className="imp-card">
                  <div className="imp-card-icon">
                    <i className={`fa ${icons[i % icons.length]}`}></i>
                  </div>
                  <h4>{sec.title}</h4>
                  <div className="privacy-card-text" dangerouslySetInnerHTML={{ __html: sec.html }} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}

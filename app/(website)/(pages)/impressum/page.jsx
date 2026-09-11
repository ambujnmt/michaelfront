'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import { useSiteInfo } from '@/lib/SiteInfoContext'
import translations from '@/lib/translations'
import websiteApi from '@/lib/websiteApi'

const sectionIcons = ['fa-briefcase', 'fa-gavel', 'fa-info-circle', 'fa-file-text']

export default function Impressum() {
  const router = useRouter()
  const { lang } = useLanguage()
  const { site_name, address, email, phone } = useSiteInfo()
  const tr = translations.impressum[lang]

  const [impressumPage, setImpressumPage] = useState(null)

  useEffect(() => {
    websiteApi.getImpressumPage()
      .then(res => { if (res.success) setImpressumPage(res.data) })
      .catch(() => {})
  }, [])

  const pick = (dbVal, fallback) => (dbVal && dbVal.trim()) ? dbVal : fallback
  const stripEmptyBlocks = (html) => (html || '').replace(/<(p|li)>(\s|&nbsp;|<br\s*\/?>)*<\/\1>/gi, '')

  const titleText    = pick(impressumPage?.[`title_${lang}`], tr.bannerTitle)
  const subtitleText = pick(impressumPage?.[`subtitle_${lang}`], tr.bannerSub)

  const dbSections = (impressumPage?.sections || []).filter(s => s[`heading_${lang}`]?.trim() || s[`content_${lang}`]?.trim())

  const extraSections = dbSections.map(s => ({ title: s[`heading_${lang}`], html: stripEmptyBlocks(s[`content_${lang}`]) }))

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

        {/* Cards Row */}
        <style>{`
          .impressum-card-text * { max-width: 100%; overflow-wrap: break-word; white-space: normal; }
          .impressum-card-text p { margin: 0; }
          .impressum-card-text p + p { margin-top: 10px; }
          .impressum-card-text ul { list-style: none; margin: 10px 0 0; padding: 0; }
          .impressum-card-text ul li {
            position: relative;
            padding-left: 26px;
            margin-bottom: 8px;
            color: rgb(68, 68, 68);
          }
          .impressum-card-text ul li::before {
            content: "\\f00c";
            font-family: "FontAwesome";
            position: absolute;
            left: 0;
            top: 1px;
            font-size: 13px;
            color: #888;
          }
        `}</style>
        <div className="row g-4">

          {/* Card 1 — Company Info (from Settings → Website Info) */}
          <div className="col-lg-6">
            <div className="imp-card">
              <div className="imp-card-icon">
                <i className="fa fa-building"></i>
              </div>
              <h4>{tr.sec1Title}</h4>
              <p><strong>{site_name}</strong></p>
              <p>{address}</p>
            </div>
          </div>

          {/* Card 2 — Contact (from Settings → Website Info) */}
          <div className="col-lg-6">
            <div className="imp-card">
              <div className="imp-card-icon">
                <i className="fa fa-phone"></i>
              </div>
              <h4>{tr.sec2Title}</h4>
              <p><i className="fa fa-phone me-2" style={{ color: '#888', fontSize: '13px' }}></i>{phone}</p>
              <p><i className="fa fa-envelope me-2" style={{ color: '#888', fontSize: '13px' }}></i>{email}</p>
            </div>
          </div>

          {/* Cards 3+ — dynamic sections from admin */}
          {extraSections.map((sec, i) => (
            <div key={i} className="col-lg-6">
              <div className="imp-card">
                <div className="imp-card-icon">
                  <i className={`fa ${sectionIcons[i % sectionIcons.length]}`}></i>
                </div>
                <h4>{sec.title}</h4>
                <div className="impressum-card-text" dangerouslySetInnerHTML={{ __html: sec.html }} />
              </div>
            </div>
          ))}

        </div>

        </div>
      </section>
    </>
  )
}

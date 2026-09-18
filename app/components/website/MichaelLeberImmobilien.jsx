'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'
import websiteApi from '@/lib/websiteApi'

export default function MichaelLeberImmobilien() {
  const { lang } = useLanguage()
  const tr = translations.home[lang] || translations.home['de']
  const [homeIntro, setHomeIntro] = useState(null)

  useEffect(() => {
    websiteApi.getHomeIntro().then(res => {
      if (res.success) setHomeIntro(res.data)
    })
  }, [])

  // "MICHAEL LEBER IMMOBILIEN" heading + intro text — editable in the
  // admin panel (Home Intro); falls back to the static translation
  // until the admin data has loaded or if a field is left empty.
  const mlHeading = homeIntro?.[`heading_${lang}`] || tr.mlHeading
  const mlIntro1 = homeIntro?.[`intro1_${lang}`] || tr.mlIntro1
  const mlIntro2 = homeIntro?.[`intro2_${lang}`] || tr.mlIntro2

  return (
    <section className="p4-sec1 p5-sec1">
      <style>{`
        /* "MICHAEL LEBER IMMOBILIEN" styled like the "IMMOBILIEN" banner heading */
        .ml-heading {
          font-family: var(--head-font);
          font-weight: 700;
          font-size: 40px;
          line-height: 60px;
          letter-spacing: 5%;
          color: #000;
          text-transform: uppercase;
          margin-bottom: 18px;
        }
      `}</style>

      <div className="container">
        <div className="row">
          <div className="col-lg-10 col-md-10 mx-auto">
            <div className="head-sec text-center" style={{ width: '100%', margin: '0 auto', padding: '0 15px' }}>
              <h2 className="ml-heading">{mlHeading}</h2>
              <p style={{ marginBottom: '12px', color: '#666', lineHeight: 1.75, textAlign: 'justify' }}>{mlIntro1}</p>
              <p style={{ margin: 0, color: '#666', lineHeight: 1.75, textAlign: 'justify' }}>{mlIntro2}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

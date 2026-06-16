'use client'

import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'

export default function Impressum() {
  const { lang } = useLanguage()
  const tr = translations.impressum[lang]

  return (
    <>
      <section className="inner-page-banner head-sec">
        <div className="container">
          <h1>{tr.bannerTitle}</h1>
          <p>{tr.bannerSub}</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="col-lg-8 mx-auto">

            <div className="mb-4">
              <h4>{tr.sec1Title}</h4>
              <p><strong>Michael Leber Immobilien</strong></p>
              <p>Musterstraße 1, 1010 Wien, Österreich</p>
            </div>

            <div className="mb-4">
              <h4>{tr.sec2Title}</h4>
              <p>{tr.sec2Phone}</p>
              <p>{tr.sec2Email}</p>
            </div>

            <div className="mb-4">
              <h4>{tr.sec3Title}</h4>
              <p>{tr.sec3Line1}</p>
              <p>{tr.sec3Line2}</p>
            </div>

            <div className="mb-4">
              <h4>{tr.sec4Title}</h4>
              <p>{tr.sec4Text}</p>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

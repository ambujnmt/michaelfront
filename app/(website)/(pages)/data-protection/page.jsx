'use client'

import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'

export default function DataProtection() {
  const { lang } = useLanguage()
  const tr = translations.dataProtection[lang]

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
          <div className="col-lg-10 mx-auto">

            <div className="mb-5">
              <h4>{tr.sec1Title}</h4>
              <p>{tr.sec1Text}</p>
            </div>

            <div className="mb-5">
              <h4>{tr.sec2Title}</h4>
              <p>{tr.sec2Text}</p>
            </div>

            <div className="mb-5">
              <h4>{tr.sec3Title}</h4>
              <p>{tr.sec3Text}</p>
            </div>

            <div className="mb-5">
              <h4>{tr.sec4Title}</h4>
              <p>{tr.sec4Text}</p>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

'use client'

import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'

export default function About() {
  const { lang } = useLanguage()
  const tr = translations.about[lang]

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
          <div className="row align-items-center">

            <div className="col-lg-6 mb-4">
              <img src="/assets/img/img4.png" alt="About" className="img-fluid" />
            </div>

            <div className="col-lg-6 mb-4 head-sec">
              <h2>{tr.heading}</h2>
              <p>{tr.p1}</p>
              <p>{tr.p2}</p>
              <ul className="mt-3">
                <li>{tr.li1}</li>
                <li>{tr.li2}</li>
                <li>{tr.li3}</li>
              </ul>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

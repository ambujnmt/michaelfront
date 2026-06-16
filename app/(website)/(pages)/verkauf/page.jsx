'use client'

import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'

const prices = ['€ 450.000', '€ 780.000', '€ 620.000']

export default function Verkauf() {
  const { lang } = useLanguage()
  const tr = translations.verkauf[lang]

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
          <div className="row">
            {tr.listings.map((item, i) => (
              <div key={i} className="col-lg-4 col-md-6 mb-4">
                <div className="property-card">
                  <img src="/assets/img/img1.png" alt="Property" className="img-fluid w-100" />
                  <div className="p-3">
                    <h5>{item.title}</h5>
                    <p className="text-muted">{item.detail}</p>
                    <h6>{prices[i]}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

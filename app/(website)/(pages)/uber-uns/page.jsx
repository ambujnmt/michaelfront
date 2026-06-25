'use client'

import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'

export default function UberUns() {
  const router = useRouter()
  const { lang } = useLanguage()
  const tr = translations.about[lang]

  return (
    <>
      <section className="inner-page-banner head-sec">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h1 style={{ margin: 0 }}>{tr.bannerTitle}</h1>
            <button onClick={() => router.back()} className="btn btn1" style={{ fontSize: '13px', padding: '8px 20px', flexShrink: 0 }}>
              <i className="fa fa-arrow-left" style={{ marginRight: '6px' }}></i>
              {lang === 'de' ? 'Zurück' : 'Back'}
            </button>
          </div>
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

'use client'

import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'

export default function Datenschutzrichtlinie() {
  const router = useRouter()
  const { lang } = useLanguage()
  const tr = translations.policy[lang]

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

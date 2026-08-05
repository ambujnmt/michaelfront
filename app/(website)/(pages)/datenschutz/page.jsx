'use client'

import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'

const icons = ['fa-shield', 'fa-database', 'fa-user', 'fa-envelope']

export default function Datenschutz() {
  const router = useRouter()
  const { lang } = useLanguage()
  const tr = translations.dataProtection[lang]

  const sections = [
    { title: tr.sec1Title, text: tr.sec1Text },
    { title: tr.sec2Title, text: tr.sec2Text },
    { title: tr.sec3Title, text: tr.sec3Text },
    { title: tr.sec4Title, text: tr.sec4Text },
  ]

  return (
    <section style={{ padding: '40px 0 100px' }}>
      <div className="container">

        {/* Page Heading */}
        <div className="row mb-5">
          <div className="col-12">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '38px', fontWeight: '700', textTransform: 'uppercase', margin: 0, fontFamily: 'var(--head-font)' }}>
                {tr.bannerTitle}
              </h1>
              <button onClick={() => router.back()} className="btn btn1" style={{ fontSize: '13px', padding: '8px 20px', flexShrink: 0 }}>
                <i className="fa fa-arrow-left" style={{ marginRight: '6px' }}></i>
                {lang === 'de' ? 'Zurück' : 'Back'}
              </button>
            </div>
            <p style={{ color: '#666', fontSize: '16px', margin: 0, fontFamily: 'var(--pera-font)' }}>{tr.bannerSub}</p>
          </div>
        </div>

        {/* Cards */}
        <div className="row g-4">
          {sections.map((sec, i) => (
            <div key={i} className="col-12">
              <div className="imp-card">
                <div className="imp-card-icon">
                  <i className={`fa ${icons[i]}`}></i>
                </div>
                <h4>{sec.title}</h4>
                <p>{sec.text}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

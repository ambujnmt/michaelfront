'use client'

import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import { useSiteInfo } from '@/lib/SiteInfoContext'
import translations from '@/lib/translations'

export default function Impressum() {
  const router = useRouter()
  const { lang } = useLanguage()
  const { site_name, address, email, phone } = useSiteInfo()
  const tr = translations.impressum[lang]

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

        {/* Cards Row */}
        <div className="row g-4">

          {/* Card 1 — Company Info */}
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

          {/* Card 2 — Contact */}
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

          {/* Card 3 — Trade */}
          <div className="col-lg-6">
            <div className="imp-card">
              <div className="imp-card-icon">
                <i className="fa fa-briefcase"></i>
              </div>
              <h4>{tr.sec3Title}</h4>
              <p><i className="fa fa-check me-2" style={{ color: '#888', fontSize: '13px' }}></i>{tr.sec3Line1}</p>
              <p><i className="fa fa-check me-2" style={{ color: '#888', fontSize: '13px' }}></i>{tr.sec3Line2}</p>
            </div>
          </div>

          {/* Card 4 — EU Dispute */}
          <div className="col-lg-6">
            <div className="imp-card">
              <div className="imp-card-icon">
                <i className="fa fa-gavel"></i>
              </div>
              <h4>{tr.sec4Title}</h4>
              <p>{tr.sec4Text}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

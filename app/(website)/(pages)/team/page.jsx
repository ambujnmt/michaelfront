'use client'

import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'

const members = ['Michael Leber', 'Anna Müller', 'Thomas Bauer', 'Sophie Wagner']

export default function Team() {
  const { lang } = useLanguage()
  const tr = translations.team[lang]

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
            {members.map((name, i) => (
              <div key={i} className="col-lg-3 col-md-6 mb-4 text-center">
                <div className="team-card p-4">
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: '#eee',
                      margin: '0 auto 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '36px',
                    }}
                  >
                    👤
                  </div>
                  <h5>{name}</h5>
                  <p className="text-muted">{tr.roles[i]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

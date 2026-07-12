'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'
import websiteApi from '@/lib/websiteApi'
import { API_URL as API } from '@/service/config'

export default function UberUns() {
  const router = useRouter()
  const { lang } = useLanguage()
  const tr = translations.about[lang]
  const trTeam = translations.team[lang]

  const [members, setMembers] = useState([])
  const [teamLoading, setTeamLoading] = useState(true)

  useEffect(() => {
    websiteApi.getTeam()
      .then(res => { if (res.success) setMembers(res.data) })
      .catch(() => {})
      .finally(() => setTeamLoading(false))
  }, [])

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

      {/* ── Team section — appended right below About content ── */}
      <section className="section-padding pt-0">
        <div className="container">
          <div className="head-sec text-center mb-4">
            <h3 style={{ margin: 0 }}>{trTeam.bannerTitle}</h3>
            <p>{trTeam.bannerSub}</p>
          </div>

          {teamLoading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              <i className="fa fa-spinner fa-spin" style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }} />
              {lang === 'de' ? 'Laden...' : 'Loading...'}
            </div>
          ) : members.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              <i className="fa fa-users" style={{ fontSize: '40px', display: 'block', marginBottom: '14px', opacity: 0.3 }} />
              <p>{lang === 'de' ? 'Keine Teammitglieder gefunden.' : 'No team members found.'}</p>
            </div>
          ) : (
            <div className="row">
              {members.map((m) => (
                <div key={m.id} className="col-lg-3 col-md-6 mb-4 text-center">
                  <div
                    className="team-card p-4"
                    style={{
                      background: '#fff',
                      border: '1px solid #ece6db',
                      borderRadius: '10px',
                      padding: '32px 20px',
                      height: '100%',
                      transition: 'box-shadow 0.25s ease, transform 0.25s ease',
                    }}
                  >
                    {m.image
                      ? <img
                          src={`${API}${m.image}`}
                          alt={m.name}
                          style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 18px', display: 'block', border: '3px solid #ece6db' }}
                        />
                      : <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#f2efe9', margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>
                          👤
                        </div>
                    }

                    {m.name && <h5 style={{ marginBottom: '4px', color: '#1a1a1a', fontWeight: 600 }}>{m.name}</h5>}
                    {m.position && <p style={{ fontSize: '13px', color: '#8a8a8a', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.position}</p>}
                    {m.bio && <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6', marginBottom: '14px' }}>{m.bio}</p>}

                    <div style={{ borderTop: '1px solid #ece6db', paddingTop: '14px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {m.phone && (
                        <a
                          href={`tel:${m.phone}`}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#444', fontSize: '13px', textDecoration: 'none' }}
                        >
                          <i className="fa fa-phone" style={{ fontSize: '13px', color: '#444' }} />
                          <span>{m.phone}</span>
                        </a>
                      )}
                      {m.email && (
                        <a
                          href={`mailto:${m.email}`}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#444', fontSize: '13px', textDecoration: 'none', wordBreak: 'break-all' }}
                        >
                          <i className="fa fa-envelope" style={{ fontSize: '13px', color: '#444' }} />
                          <span>{m.email}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
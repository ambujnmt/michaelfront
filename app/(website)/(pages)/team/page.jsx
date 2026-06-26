'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'
import websiteApi from '@/lib/websiteApi'
import { API_URL as API } from '@/service/config'

export default function Team() {
  const router = useRouter()
  const { lang } = useLanguage()
  const tr = translations.team[lang]
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    websiteApi.getTeam()
      .then(res => { if (res.success) setMembers(res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
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
          {loading ? (
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
                  <div className="team-card p-4">
                    {m.image
                      ? <img
                          src={`${API}${m.image}`}
                          alt={m.name}
                          style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px', display: 'block', border: '3px solid #e8e0d5' }}
                        />
                      : <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#eee', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>
                          👤
                        </div>
                    }
                    <h5 style={{ marginBottom: '4px' }}>{m.name}</h5>
                    {m.position && <p className="text-muted" style={{ fontSize: '13px', marginBottom: '8px' }}>{m.position}</p>}
                    {m.bio && <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6', marginBottom: '10px' }}>{m.bio}</p>}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '8px' }}>
                      {m.email && (
                        <a href={`mailto:${m.email}`} style={{ color: '#8a6b3f', fontSize: '16px' }}>
                          <i className="fa fa-envelope" />
                        </a>
                      )}
                      {m.phone && (
                        <a href={`tel:${m.phone}`} style={{ color: '#8a6b3f', fontSize: '16px' }}>
                          <i className="fa fa-phone" />
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

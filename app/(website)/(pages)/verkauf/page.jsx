'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'
import websiteApi from '@/lib/websiteApi'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function Verkauf() {
  const router = useRouter()
  const { lang } = useLanguage()
  const tr = translations.verkauf[lang]

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    websiteApi.getSalesProperties()
      .then(res => { if (res.success) setProperties(res.data) })
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
          ) : properties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              <i className="fa fa-home" style={{ fontSize: '40px', display: 'block', marginBottom: '14px', opacity: 0.4 }} />
              <p>{lang === 'de' ? 'Derzeit keine Objekte verfügbar.' : 'No properties available at the moment.'}</p>
            </div>
          ) : (
            <div className="row">
              {properties.map((p) => (
                <div key={p.id} className="col-lg-4 col-md-6 mb-4">
                  <Link href={`/immobilien/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="property-card" style={{ cursor: 'pointer' }}>
                      <img
                        src={p.image ? `${API}${p.image}` : '/assets/img/img1.png'}
                        alt={p.title}
                        className="img-fluid w-100"
                        style={{ height: '220px', objectFit: 'cover' }}
                      />
                      <div className="p-3">
                        <h5 style={{ marginBottom: '6px' }}>{p.title}</h5>
                        <p className="text-muted" style={{ fontSize: '13px', marginBottom: '8px' }}>
                          {[p.rooms && `${p.rooms} ${lang === 'de' ? 'Zimmer' : 'Rooms'}`, p.size && `${p.size} m²`, p.location].filter(Boolean).join(' · ')}
                        </p>
                        <h6 style={{ color: '#222', fontWeight: '700' }}>€ {Number(p.price).toLocaleString()}</h6>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

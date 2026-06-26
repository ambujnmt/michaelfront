'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'
import websiteApi from '@/lib/websiteApi'

import { API_URL as API } from '@/service/config'

const PER_PAGE = 20

export default function Verkauf() {
  const router = useRouter()
  const { lang } = useLanguage()
  const tr = translations.verkauf[lang]

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    websiteApi.getSalesProperties()
      .then(res => { if (res.success) setProperties(res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalPages = Math.ceil(properties.length / PER_PAGE)
  const paginated  = properties.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const goToPage = (n) => {
    setPage(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
            <div className="text-center" style={{ padding: '0px 20px', marginBottom: '40px' }}>
              <div style={{
                display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
                background: '#f9f7f4', borderRadius: '16px', padding: '60px 80px',
                border: '1px solid #e8e0d5',
              }}>
                <i className="fa fa-building-o" style={{ fontSize: '64px', color: '#c8b89a', marginBottom: '20px' }} />
                <h4 style={{ color: '#5a4a3a', marginBottom: '10px', fontWeight: '600' }}>
                  {lang === 'de' ? 'Keine Objekte verfügbar' : 'No Properties Available'}
                </h4>
                <p style={{ color: '#999', fontSize: '14px', marginBottom: '0', maxWidth: '300px' }}>
                  {lang === 'de'
                    ? 'Derzeit sind keine Verkaufsobjekte verfügbar.'
                    : 'There are currently no properties available for sale.'}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="row">
                {paginated.map((p) => (
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '40px 0 20px' }}>
                  <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    style={{
                      padding: '8px 14px', border: '1px solid #ccc', background: 'transparent',
                      cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1,
                      borderRadius: '4px', fontSize: '14px',
                    }}
                  >
                    <i className="fa fa-chevron-left" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      onClick={() => goToPage(n)}
                      style={{
                        padding: '8px 14px', border: '1px solid',
                        borderColor: page === n ? '#8a6b3f' : '#ccc',
                        background: page === n ? '#8a6b3f' : 'transparent',
                        color: page === n ? '#fff' : 'inherit',
                        cursor: 'pointer', borderRadius: '4px', fontSize: '14px',
                        fontWeight: page === n ? '700' : '400',
                      }}
                    >
                      {n}
                    </button>
                  ))}

                  <button
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    style={{
                      padding: '8px 14px', border: '1px solid #ccc', background: 'transparent',
                      cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1,
                      borderRadius: '4px', fontSize: '14px',
                    }}
                  >
                    <i className="fa fa-chevron-right" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}

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

  const typeLabel = (type) => {
    const t = type || 'villa'
    if (lang === 'de') {
      if (t === 'villa') return 'Haus'
      if (t === 'apartment') return 'Wohnung'
      if (t === 'various') return 'Grundstück'
      return t
    }
    if (t === 'villa') return 'House'
    if (t === 'apartment') return 'Apartment'
    if (t === 'various') return 'Land'
    return t
  }

  return (
    <>
      <style>{`
        .sale-card {
          position: relative;
          background: #fff;
          border-radius: 14px;
          overflow: hidden;
          height: 100%;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        }
        .sale-card-img-wrap {
          position: relative;
          overflow: hidden;
          height: 230px;
        }
        .sale-card-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .sale-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%);
        }
        .sale-card-price-badge {
          position: absolute;
          bottom: 14px;
          left: 16px;
          color: #fff;
          font-size: 19px;
          font-weight: 800;
          letter-spacing: 0.3px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        .sale-card-arrow {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateX(6px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .sale-card:hover .sale-card-arrow {
          opacity: 1;
          transform: translateX(0);
        }
        .sale-card-body {
          padding: 18px 20px 20px;
        }
        .sale-card-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sale-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          padding-top: 12px;
          margin-top: 4px;
          border-top: 1px solid #f0ece3;
        }
        .sale-card-meta span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          color: #7a7264;
        }
        .sale-card-meta i {
          color: #8a6b3f;
          font-size: 13px;
        }
        .sale-card-location {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #999;
          margin-bottom: 2px;
        }
        .sale-card-type-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: rgba(138, 107, 63, 0.92);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 20px;
        }
      `}</style>

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
                      <div className="sale-card">
                        <div className="sale-card-img-wrap">
                          <img
                            src={p.image ? `${API}${p.image}` : '/assets/img/img1.png'}
                            alt={p.title || 'Property'}
                          />
                          <div className="sale-card-overlay" />
                          <div className="sale-card-type-badge">{typeLabel(p.property_type)}</div>
                          {p.price && (
                            <div className="sale-card-price-badge">
                              € {Number(p.price).toLocaleString()}
                            </div>
                          )}
                          <div className="sale-card-arrow">
                            <i className="fa fa-arrow-right" style={{ fontSize: '13px', color: '#8a6b3f' }} />
                          </div>
                        </div>

                        <div className="sale-card-body">
                          {p.title && <div className="sale-card-title">{p.title}</div>}

                          {p.location && (
                            <div className="sale-card-location">
                              <i className="fa fa-map-marker" style={{ color: '#c8b89a' }} />
                              {p.location}
                            </div>
                          )}

                          {(() => {
                            const type = p.property_type || 'villa'
                            const isLand = type === 'various'
                            const isHouse = type === 'villa'

                            if (isLand) {
                              return p.plot_size ? (
                                <div className="sale-card-meta">
                                  <span><i className="fa fa-map-o" />{p.plot_size} m² {lang === 'de' ? 'Grundstück' : 'Plot'}</span>
                                </div>
                              ) : null
                            }

                            const hasAny = p.size || (isHouse && p.plot_size) || p.outdoor_area || p.rooms || p.bedrooms || p.bathrooms
                            if (!hasAny) return null

                            return (
                              <div className="sale-card-meta">
                                {p.size && (
                                  <span><i className="fa fa-arrows-alt" />{p.size} m² {lang === 'de' ? 'Wohnfläche' : 'Living'}</span>
                                )}
                                {isHouse && p.plot_size && (
                                  <span><i className="fa fa-map-o" />{p.plot_size} m² {lang === 'de' ? 'Grundstück' : 'Plot'}</span>
                                )}
                                {p.outdoor_area && (
                                  <span><i className="fa fa-tree" />{p.outdoor_area} m² {lang === 'de' ? 'Freifläche' : 'Outdoor'}</span>
                                )}
                                {p.rooms && (
                                  <span><i className="fa fa-th-large" />{p.rooms} {lang === 'de' ? 'Zimmer' : 'Rooms'}</span>
                                )}
                                {p.bedrooms && (
                                  <span><i className="fa fa-bed" />{p.bedrooms} {lang === 'de' ? 'Schlafzimmer' : 'Bedrooms'}</span>
                                )}
                                {p.bathrooms && (
                                  <span><i className="fa fa-bath" />{p.bathrooms} {lang === 'de' ? 'Bäder' : 'Bathrooms'}</span>
                                )}
                              </div>
                            )
                          })()}
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
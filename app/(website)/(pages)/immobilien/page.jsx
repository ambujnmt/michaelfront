'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'
import websiteApi from '@/lib/websiteApi'
import Newsletter from '@/app/components/website/Newsletter'

import { API_URL as API } from '@/service/config'

const PER_PAGE = 20

export default function Immobilien() {
  const router = useRouter()
  const { lang } = useLanguage()
  const tr = translations.property[lang]
  const trHome = translations.home[lang] || translations.home['de']
  const [properties, setProperties] = useState([])
  const [loading, setLoading]       = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    websiteApi.getProperties().then(res => {
      if (res.success) setProperties(res.data)
      setLoading(false)
    })
  }, [])

  // Reset to page 1 when tab changes
  useEffect(() => { setPage(1) }, [activeFilter])

  const tabs = [
    { key: 'all',       label: lang === 'de' ? 'ALLE' : 'ALL' },
    { key: 'villa',     label: tr.filter1 },
    { key: 'apartment', label: tr.filter2 },
    { key: 'various',   label: tr.filter3 },
  ]

  const filtered = activeFilter === 'all'
    ? properties
    : properties.filter(p => (p.property_type || 'villa') === activeFilter)

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const goToPage = (n) => {
    setPage(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>

      {/* Banner */}
      <section className="inner-page-banner head-sec" style={{ paddingTop: '50px' }}>
        <div className="container text-center">
          <h6 style={{ margin: '0 0 8px' }}>{trHome.sec2Sub}</h6>
          <h3 style={{ margin: 0 }}>{trHome.sec2Title}</h3>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="">
        <div className="container">
          <div className="filter-wrap p-a15 our-gallery filter-gallery2">
            <ul className="masonry-filter link-style text-uppercase center-block m-t0">
              {tabs.map(tab => (
                <li key={tab.key} className={activeFilter === tab.key ? 'active' : ''}>
                  <a href="#" onClick={e => { e.preventDefault(); setActiveFilter(tab.key) }}>
                    {tab.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#999', fontSize: '15px' }}>
            Loading...
          </div>
        )}

        {!loading && (
          <div className="container">
            <div className="row portfolio-wrap">
              {paginated.length === 0 ? (
                <div className="col-12 text-center" style={{ padding: '0px 20px', marginBottom: '40px' }}>
                  <div style={{
                    display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
                    background: '#f9f7f4', borderRadius: '16px', padding: '60px 80px',
                    border: '1px solid #e8e0d5',
                  }}>
                    <i className="fa fa-building-o" style={{ fontSize: '64px', color: '#c8b89a', marginBottom: '20px' }} />
                    <h4 style={{ color: '#5a4a3a', marginBottom: '10px', fontWeight: '600' }}>
                      {lang === 'de' ? 'Keine Immobilien gefunden' : 'No Properties Found'}
                    </h4>
                    <p style={{ color: '#999', fontSize: '14px', marginBottom: '24px', maxWidth: '300px' }}>
                      {lang === 'de'
                        ? 'In dieser Kategorie sind derzeit keine Objekte verfügbar.'
                        : 'There are currently no properties available in this category.'}
                    </p>
                    <button
                      className="btn btn1"
                      style={{ fontSize: '13px', padding: '10px 28px' }}
                      onClick={() => setActiveFilter('all')}
                    >
                      {lang === 'de' ? 'Alle anzeigen' : 'View All'}
                    </button>
                  </div>
                </div>
              ) : paginated.map((p) => (
                <div key={p.id} className="masonry-item col-lg-6 col-md-6 col-12">
                  <div className="flip-container">
                    <div className="wt-box">

                      <div className="wt-thum-bx">
                        <img
                          src={p.image ? `${API}${p.image}` : '/assets/img/p3-slider-img2.png'}
                          alt={p.title}
                        />
                        <div className="text-center">
                          <h2>{p.title}</h2>
                        </div>
                      </div>

                      <div className="wt-info text-center flip-col-start">
                        <div className="wt-info-text p-a30">
                          <h3>{p.title}</h3>
                          <h4>{p.location}</h4>
                          <div className="row">
                            <div className="col-lg-3 col-md-3 col-6">
                              <div className="flip-col1">
                                <img src="/assets/img/icon1.png" alt="rooms" />
                                <p>{p.rooms}</p>
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-3 col-6">
                              <div className="flip-col1">
                                <img src="/assets/img/icon2.png" alt="baths" />
                                <p>{p.bathrooms}</p>
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-3 col-6">
                              <div className="flip-col1">
                                <img src="/assets/img/icon3.png" alt="size" />
                                <p>{p.size} m²</p>
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-3 col-6">
                              <div className="flip-col1">
                                <img src="/assets/img/icon4.png" alt="bedrooms" />
                                <p>{p.bedrooms}</p>
                              </div>
                            </div>
                          </div>
                          <h5>€ {Number(p.price).toLocaleString()}</h5>
                          <Link href={`/immobilien/${p.slug}`} className="flip-col-btn">{tr.btnText}</Link>
                        </div>
                      </div>

                    </div>
                  </div>
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

          </div>
        )}
      </section>

      <Newsletter />

    </>
  )
}

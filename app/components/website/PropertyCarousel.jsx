'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'
import websiteApi from '@/lib/websiteApi'
import { API_URL as API } from '@/service/config'

function Loader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px 0' }}>
      <div style={{
        width: '48px', height: '48px',
        border: '4px solid #e0e0e0',
        borderTop: '4px solid #8a6b3f',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function PropertyCarousel() {
  const { lang } = useLanguage()
  const tr = translations.home[lang] || translations.home['de']
  const [properties, setProperties] = useState([])
  const [activeFilter, setActiveFilter] = useState('villa')
  const [loading, setLoading] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    websiteApi.getProperties().then(res => {
      if (res.success) setProperties(res.data)
    })
  }, [])

  const handleFilterChange = (key) => {
    if (key === activeFilter) return
    setLoading(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setActiveFilter(key)
      setLoading(false)
    }, 600)
  }

  if (properties.length === 0) return null

  const filtered = properties
    .filter(p => (p.property_type || 'villa') === activeFilter)
    .slice(0, 4)

  const tabs = [
    { key: 'villa',     label: tr.filter1 },
    { key: 'apartment', label: tr.filter2 },
    { key: 'various',   label: tr.filter3 },
  ]

  return (
    <section className="p4-sec1 p5-sec1">

      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12 head-sec text-center">
            <h6>{tr.sec2Sub}</h6>
            <h3>{tr.sec2Title}</h3>
          </div>
        </div>
        <div className="filter-wrap p-a15 our-gallery">
          <ul className="masonry-filter link-style text-uppercase center-block m-t0">
            {tabs.map(tab => (
              <li key={tab.key} className={activeFilter === tab.key ? 'active' : ''}>
                <a href="#" onClick={e => { e.preventDefault(); handleFilterChange(tab.key) }}>
                  {tab.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {loading ? <Loader /> : (
        <div className="container">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
              <p>{lang === 'de' ? 'Keine Immobilien gefunden.' : 'No properties found.'}</p>
            </div>
          ) : (
            <div className="row">
              {filtered.map(p => (
                <div className="col-lg-6 col-md-6 col-12 mb-4" key={p.id}>
                  <div className="flip-container" style={{ borderRadius: '2px', overflow: 'hidden' }}>
                    <div className="wt-box">

                      {/* FRONT */}
                      <div className="wt-thum-bx">
                        <img
                          src={p.image ? `${API}${p.image}` : '/assets/img/p6-villa-img1.png'}
                          alt={p.title}
                          style={{ borderRadius: '5px' }}
                        />
                        <div className="text-center">
                          <h2>{p.title}</h2>
                        </div>
                      </div>

                      {/* BACK */}
                      <div className="wt-info text-center flip-col-start" style={{ borderRadius: '5px' }}>
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
                          <Link href={`/immobilien/${p.slug}`} className="flip-col-btn">
                            {tr.viewBtn}
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="col-lg-12 col-md-12 text-center p-5-btn">
        <a href="/immobilien">
          <button type="button" className="btn btn1">
            {lang === 'de' ? 'Mehr anzeigen' : 'Show More'}
          </button>
        </a>
      </div>

    </section>
  )
}

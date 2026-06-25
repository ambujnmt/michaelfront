'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'
import websiteApi from '@/lib/websiteApi'
import Newsletter from '@/app/components/website/Newsletter'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const TYPE_MAP = {
  villa:     'filter1',
  apartment: 'filter2',
  various:   'filter3',
}

export default function Immobilien() {
  const router = useRouter()
  const { lang } = useLanguage()
  const tr = translations.property[lang]
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    websiteApi.getProperties().then(res => {
      if (res.success) setProperties(res.data)
      setLoading(false)
    })
  }, [])

  const tabs = [
    { key: 'all',       label: lang === 'de' ? 'ALLE' : 'ALL' },
    { key: 'villa',     label: tr.filter1 },
    { key: 'apartment', label: tr.filter2 },
    { key: 'various',   label: tr.filter3 },
  ]

  const filtered = activeFilter === 'all'
    ? properties
    : properties.filter(p => (p.property_type || 'villa') === activeFilter)

  return (
    <>

      {/* Banner */}
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

      {/* Properties Grid */}
      <section className="">
        <div className="container">

          <div className="filter-wrap p-a15 our-gallery filter-gallery2">
            <ul className="masonry-filter link-style text-uppercase center-block m-t0">
              {tabs.map(tab => (
                <li key={tab.key} className={activeFilter === tab.key ? 'active' : ''}>
                  <a
                    href="#"
                    onClick={e => { e.preventDefault(); setActiveFilter(tab.key) }}
                  >
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
              {filtered.length === 0 ? (
                <div className="col-12 text-center" style={{ padding: '60px', color: '#999' }}>
                  {lang === 'de' ? 'Keine Immobilien gefunden.' : 'No properties found.'}
                </div>
              ) : filtered.map((p) => (
                <div key={p.id} className={`masonry-item col-lg-6 col-md-6 col-12`}>
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
          </div>
        )}
      </section>

      <Newsletter />

    </>
  )
}

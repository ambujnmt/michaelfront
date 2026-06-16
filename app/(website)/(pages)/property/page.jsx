'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'
import websiteApi from '@/lib/websiteApi'
import Newsletter from '@/app/components/website/Newsletter'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function Property() {
  const { lang } = useLanguage()
  const tr = translations.property[lang]
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    websiteApi.getProperties().then(res => {
      if (res.success) setProperties(res.data)
      setLoading(false)
    })
  }, [])

  return (
    <>

      {/* Banner */}
      <section className="inner-page-banner head-sec">
        <div className="container">
          <h1>{tr.bannerTitle}</h1>
          <p>{tr.bannerSub}</p>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="p4-sec1">
        <div className="container">

          {/* Filter Tabs */}
          <div className="row">
            <div className="col-lg-12 col-md-12 head-sec text-center">
              <h6>UNSERE IMMOBILIEN</h6>
              <h3>VERFÜGBARE EIGENSCHAFTEN</h3>
            </div>
          </div>
          <div className="filter-wrap p-a15 our-gallery filter-gallery2">
            <ul className="masonry-filter link-style text-uppercase center-block m-t0">
              <li className="active"><a data-filter=".cat-filter-1" href="#" onClick={e => e.preventDefault()}>{tr.filter1}</a></li>
              <li><a data-filter=".cat-filter-2" href="#" onClick={e => e.preventDefault()}>{tr.filter2}</a></li>
              <li><a data-filter=".cat-filter-3" href="#" onClick={e => e.preventDefault()}>{tr.filter3}</a></li>
            </ul>
          </div>

        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#999', fontSize: '15px' }}>
            Loading...
          </div>
        )}

        {/* Flip Cards Grid */}
        {!loading && (
          <div className="container">
            <div className="row portfolio-wrap">
              {properties.length === 0 ? (
                <div className="col-12 text-center" style={{ padding: '60px', color: '#999' }}>
                  No properties found.
                </div>
              ) : properties.map((p) => (
                <div key={p.id} className="masonry-item cat-filter-1 col-lg-6 col-md-6 col-12">
                  <div className="flip-container">
                    <div className="wt-box">

                      {/* Front — Image + Title */}
                      <div className="wt-thum-bx">
                        <img
                          src={p.image ? `${API}${p.image}` : '/assets/img/p3-slider-img2.png'}
                          alt={p.title}
                        />
                        <div className="text-center">
                          <h2>{p.title}</h2>
                        </div>
                      </div>

                      {/* Back — Details */}
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
                          <Link href={`/property/${p.slug}`} className="flip-col-btn">{tr.btnText}</Link>
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

'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'
import websiteApi from '@/lib/websiteApi'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

function OwlSlider({ tr, properties }) {
  useEffect(() => {
    let retryTimer = null
    const tryInit = () => {
      if (typeof window === 'undefined') return
      const jq = window.jQuery
      if (!jq || !jq.fn || !jq.fn.owlCarousel) { retryTimer = setTimeout(tryInit, 300); return }
      const $el = jq('.home-carousel-1')
      if (!$el.length) return
      $el.owlCarousel({
        loop: true,
        margin: 30,
        nav: false,
        dots: true,
        responsive: { 0: { items: 1 }, 768: { items: 2 }, 1200: { items: 3 } },
      })
    }
    const timer = setTimeout(tryInit, 300)
    return () => {
      clearTimeout(timer)
      clearTimeout(retryTimer)
      if (typeof window !== 'undefined' && window.jQuery) {
        const $el = window.jQuery('.home-carousel-1')
        if ($el.length && $el.hasClass('owl-loaded')) {
          $el.trigger('destroy.owl.carousel').removeClass('owl-loaded owl-drag')
        }
      }
    }
  }, [])

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="owl-carousel home-carousel-1 m-b30">
            {properties.map((p) => (
              <div className="item villa-dtl-col2" key={p.id}>
                <div className="masonry-item cat-filter-1">
                  <div className="wt-box">
                    <img
                      src={p.image ? `${API}${p.image}` : '/assets/img/p7-villa1.png'}
                      alt={p.title}
                    />
                    <div className="villa-dtl-col">
                      <h5>{p.title}</h5>
                      <p>{p.location}</p>
                      <span>{tr.areaLabel} {p.size} m²</span>
                      <span>{tr.roomsLabel} {p.rooms}</span>
                      <span>{tr.bathsLabel} {p.bathrooms}</span>
                      <h6>€ {Number(p.price).toLocaleString()}</h6>
                      <a href={`/property/${p.slug}`}>
                        <button type="button" className="btn btn1">{tr.viewBtn}</button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PropertyCarousel() {
  const { lang } = useLanguage()
  const tr = translations.home[lang]
  const [properties, setProperties] = useState([])

  useEffect(() => {
    websiteApi.getProperties().then(res => {
      if (res.success) setProperties(res.data)
    })
  }, [])

  if (properties.length === 0) return null

  return (
    <section className="p4-sec1 p7-sec3 p8-sec2">

      {/* Filter Tabs */}
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12 head-sec text-center">
            <h6>{tr.sec2Sub}</h6>
            <h3>{tr.sec2Title}</h3>
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

      {/* key={lang} — language change par slider fresh remount hoga */}
      <OwlSlider key={lang} tr={tr} properties={properties} />

    </section>
  )
}

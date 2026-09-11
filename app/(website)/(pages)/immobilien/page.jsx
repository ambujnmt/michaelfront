'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'
import websiteApi from '@/lib/websiteApi'
import { localizeProperties } from '@/lib/propertyI18n'
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
  const paginated  = localizeProperties(filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), lang)

  const goToPage = (n) => {
    setPage(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>

      {/* Banner */}
      <section className="inner-page-banner head-sec imm-banner" style={{ padding: '50px 0 0px' }}>
        <div className="container text-center">
          {/* <h6 style={{ margin: '0 0 8px' }}>{trHome.sec2Sub}</h6> */}
          <h1 style={{ margin: 0 }}>{trHome.sec2Sub}</h1>
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
                <div key={p.id} className="masonry-item col-lg-6 col-md-6 col-12" style={{ marginBottom: '30px' }}>
                  <PropertyCard p={p} tr={tr} />
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

/* ---------------------------------------------------------------------- */
/* Single property card: stable photo, no filter, no flip, no icons.      */
/* Details slide up as a light overlay on hover / tap.                    */
/* Field set adapts to property_type — Land/Plot shows only Land Area,    */
/* House also shows Land Area, everyone else skips it. Kept identical to  */
/* the homepage card so both areas look consistent.                      */
/* ---------------------------------------------------------------------- */
function PropertyCard({ p, tr }) {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)
  const type = p.property_type || 'villa'
  const isLand = type === 'various'
  const isHouse = type === 'villa'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push(`/immobilien/${p.slug}`)} // whole card opens the detail page
      style={{
        position: 'relative',
        borderRadius: '5px',
        overflow: 'hidden',
        cursor: 'pointer',
        // wider / shorter crop than before (was a tall portrait crop)
        aspectRatio: '4 / 3',
      }}
    >
      {/* PHOTO — always visible, never rotates, no dark filter */}
      <img
        src={p.image ? `${API}${p.image}` : '/assets/img/p3-slider-img2.png'}
        alt={p.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
        }}
      />

      {/* Title bar — sits on the photo at all times */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '14px 18px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)',
          opacity: hovered ? 0 : 1,
          transition: 'opacity 0.25s ease',
        }}
      >
        <h4 style={{ color: '#fff', margin: 0, fontWeight: 600 }}>{p.title}</h4>
      </div>

      {/* DETAILS OVERLAY — appears on hover, photo still visible underneath */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '20px 24px',
          background: 'rgba(255,255,255,0.92)', // light panel, not a black block
          backdropFilter: 'blur(2px)',
          transform: hovered ? 'translateY(0%)' : 'translateY(100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        <h4 style={{ margin: '0 0 2px', color: '#1a1a1a', fontWeight: 600 }}>{p.title}</h4>
        <p style={{ margin: '0 0 10px', color: '#555', fontSize: '14px' }}>{p.location}</p>

        {/* text labels instead of blurry icons — field set depends on property type */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '12px',
            fontSize: '13px',
            color: '#333',
          }}
        >
          {isLand ? (
            <span><strong>{p.plot_size ?? '-'}</strong> m² {tr.plotAreaLabel || 'Grundstück'}</span>
          ) : (
            <>
              <span><strong>{p.size}</strong> m² {tr.livingAreaLabel || 'Wohnfläche'}</span>
              {isHouse && (
                <span><strong>{p.plot_size ?? '-'}</strong> m² {tr.plotAreaLabel || 'Grundstück'}</span>
              )}
              <span><strong>{p.outdoor_area ?? '-'}</strong> m² {tr.outdoorAreaLabel || 'Freifläche'}</span>
              <span><strong>{p.rooms}</strong> {tr.roomsLabel || 'Zimmer'}</span>
              <span><strong>{p.bedrooms}</strong> {tr.bedroomsLabel || 'Schlafzimmer'}</span>
              <span><strong>{p.bathrooms}</strong> {tr.bathroomsLabel || 'Bäder'}</span>
            </>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h5 style={{ margin: 0, color: '#1a1a1a' }}>€ {Number(p.price).toLocaleString('de-DE')}</h5>
          <Link
            href={`/immobilien/${p.slug}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: '8px 16px',
              background: '#8a6b3f',
              color: '#fff',
              borderRadius: '3px',
              fontSize: '13px',
              textDecoration: 'none',
            }}
          >
            {tr.btnText}
          </Link>
        </div>
      </div>
    </div>
  )
}
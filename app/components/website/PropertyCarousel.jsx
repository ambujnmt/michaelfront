'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'
import websiteApi from '@/lib/websiteApi'
import { localizeProperties } from '@/lib/propertyI18n'
import { API_URL as API } from '@/service/config'

export default function PropertyCarousel() {
  const { lang } = useLanguage()
  const tr = translations.home[lang] || translations.home['de']
  const [properties, setProperties] = useState([])
  const [homeIntro, setHomeIntro] = useState(null)

  useEffect(() => {
    websiteApi.getProperties().then(res => {
      if (res.success) setProperties(res.data)
    })
    websiteApi.getHomeIntro().then(res => {
      if (res.success) setHomeIntro(res.data)
    })
  }, [])

  if (properties.length === 0) return null

  // Homepage teaser: the 3 highlighted (most recent) properties.
  // The API returns them ordered newest-first.
  const featured = localizeProperties(properties.slice(0, 3), lang)

  // "MICHAEL LEBER IMMOBILIEN" heading + intro text — editable in the
  // admin panel (Home Intro); falls back to the static translation
  // until the admin data has loaded or if a field is left empty.
  const mlHeading = homeIntro?.[`heading_${lang}`] || tr.mlHeading
  const mlIntro1 = homeIntro?.[`intro1_${lang}`] || tr.mlIntro1
  const mlIntro2 = homeIntro?.[`intro2_${lang}`] || tr.mlIntro2

  return (
    <section className="p4-sec1 p5-sec1">
      <style>{`
        /* "MICHAEL LEBER IMMOBILIEN" styled like the "IMMOBILIEN" banner heading */
        .ml-heading {
          font-family: var(--head-font);
          font-weight: 700;
          font-size: 40px;
          line-height: 60px;
          letter-spacing: 5%;
          color: #000;
          text-transform: uppercase;
          margin-bottom: 18px;
        }
      `}</style>

      <div className="container">
        <div className="head-sec text-center" style={{ width: '100%', margin: '0 auto 44px', padding: '0 15px' }}>
          <h2 className="ml-heading">{mlHeading}</h2>
          <p style={{ marginBottom: '12px', color: '#666', lineHeight: 1.75 }}>{mlIntro1}</p>
          <p style={{ margin: 0, color: '#666', lineHeight: 1.75 }}>{mlIntro2}</p>
        </div>
      </div>

      <div className="container">
        <section className="inner-page-banner head-sec" style={{ padding: '22px 0 30px' }}>
          <div className="container text-center">
            <h1 style={{ margin: 0 }}>{tr.sec2Sub}</h1>
          </div>
        </section>
      </div>

      <div className="container">
        <div className="row">
          {featured.map(p => (
            <div className="col-lg-4 col-md-6 col-12" style={{ marginBottom: '30px' }} key={p.id}>
              <PropertyCard p={p} tr={tr} />
            </div>
          ))}
        </div>
      </div>

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

/* ---------------------------------------------------------------------- */
/* Single property card: stable photo, no filter, no flip, no icons.      */
/* Details slide up as a light overlay on hover / tap.                    */
/* Field set adapts to property_type — Land/Plot shows only Land Area,    */
/* House also shows Land Area, everyone else skips it.                    */
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
        src={p.image ? `${API}${p.image}` : '/assets/img/p6-villa-img1.png'}
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
            {tr.viewBtn}
          </Link>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'
import websiteApi from '@/lib/websiteApi'
import { API_URL as API } from '@/service/config'

export default function UberUns() {
  const router = useRouter()
  const { lang } = useLanguage()
  const tr = translations.about[lang]
  const trTeam = translations.team[lang]

  const [members, setMembers] = useState([])
  const [teamLoading, setTeamLoading] = useState(true)
  const [about, setAbout] = useState(null)

  useEffect(() => {
    websiteApi.getTeam()
      .then(res => { if (res.success) setMembers(res.data) })
      .catch(() => {})
      .finally(() => setTeamLoading(false))

    websiteApi.getAbout()
      .then(res => { if (res.success) setAbout(res.data) })
      .catch(() => {})
  }, [])

  // Falls back to the static translation until an admin saves content for this field
  const pick = (dbVal, fallback) => (dbVal && dbVal.trim()) ? dbVal : fallback

  // Quill leaves a trailing empty <p><br></p> / <li><br></li> behind — strip those
  // so an empty bullet/paragraph doesn't render with nothing next to it.
  const stripEmptyBlocks = (html) => html.replace(/<(p|li)>(\s|&nbsp;|<br\s*\/?>)*<\/\1>/gi, '')

  const fallbackContent = `<p>${tr.p1}</p><p>${tr.p2}</p><ul>${[tr.li1, tr.li2, tr.li3].map(l => `<li>${l.replace(/^✔\s*/, '')}</li>`).join('')}</ul>`

  const titleText    = pick(about?.[`title_${lang}`], tr.bannerTitle)
  const contentHtml  = stripEmptyBlocks(pick(about?.[`content_${lang}`], fallbackContent))
  const aboutImage   = about?.image ? `${API}${about.image}` : '/assets/img/img4.png'

  return (
    <>
      <section className="inner-page-banner head-sec" style={{ padding: '50px 0px 50px 0px' }}>
        <div className="container text-center page-banner-inner">
          <button onClick={() => router.back()} className="btn btn1 page-banner-back" style={{ fontSize: '13px', padding: '8px 20px', flexShrink: 0 }}>
            <i className="fa fa-arrow-left" style={{ marginRight: '6px' }}></i>
            {lang === 'de' ? 'Zurück' : 'Back'}
          </button>
          <h1 style={{ margin: 0 }}>{titleText}</h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <style>{`
            .about-img-full {
              width: 100%;
              height: 420px;
              object-fit: cover;
              border-radius: 10px;
              border: 1px solid #ece6db;
              margin-bottom: 40px;
            }
            @media (max-width: 767px) {
              .about-img-full { height: 240px; margin-bottom: 28px; }
            }
            .about-content { max-width: 100%; text-align: justify; }
            .about-content * {
              max-width: 100%;
              white-space: normal;
              /* Never break in the middle of a word — only wrap at spaces. */
              overflow-wrap: normal;
              word-break: normal;
              hyphens: none;
            }
            .about-content p { margin-bottom: 16px; }
            .about-content ul { list-style: none; margin: 16px 0 0; padding: 0; text-align: left; }
            .about-content ul li {
              position: relative;
              padding-left: 28px;
              margin-bottom: 10px;
              color: rgb(68, 68, 68);
            }
            .about-content ul li::before {
              content: "\\f058";
              font-family: "FontAwesome";
              position: absolute;
              left: 0;
              top: 0;
              font-size: 16px;
              color: rgb(68, 68, 68);
            }
          `}</style>

          <div className="row">
            <div className="col-12">
              <img src={aboutImage} alt="About" className="about-img-full" />
            </div>

            <div className="col-12 head-sec">
              <div className="about-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Team section — appended right below About content ── */}
      <section className="section-padding pt-0">
        <div className="container">
          <div className="head-sec-page text-center m-5">
            <h1 style={{ margin: 0 }}>{trTeam.bannerTitle}</h1>
            <p>{trTeam.bannerSub}</p>
          </div>

          {teamLoading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              <i className="fa fa-spinner fa-spin" style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }} />
              {lang === 'de' ? 'Laden...' : 'Loading...'}
            </div>
          ) : members.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              <i className="fa fa-users" style={{ fontSize: '40px', display: 'block', marginBottom: '14px', opacity: 0.3 }} />
              <p>{lang === 'de' ? 'Keine Teammitglieder gefunden.' : 'No team members found.'}</p>
            </div>
          ) : (
            <div className="row justify-content-center">
              {members.map((m) => (
                <div key={m.id} className="col-lg-3 col-md-6 mb-4 text-center">
                  <div
                    className="team-card"
                    style={{
                      background: '#fff',
                      border: '1px solid #ece6db',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      height: '100%',
                      transition: 'box-shadow 0.25s ease, transform 0.25s ease',
                    }}
                  >
                    {m.image
                      ? <img
                          src={`${API}${m.image}`}
                          alt={m[`name_${lang}`] || m.name}
                          style={{ width: '100%', height: '320px', borderRadius: '5px', objectFit: 'cover', display: 'block' }}
                        />
                      : <div style={{ width: '100%', height: '320px', borderRadius: '5px', background: '#f2efe9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
                          👤
                        </div>
                    }

                    <div style={{ padding: '20px' }}>
                      {(() => {
                        const nm = m[`name_${lang}`] || m.name
                        return nm ? <h5 style={{ marginBottom: '4px', color: '#1a1a1a', fontWeight: 600 }}>{nm}</h5> : null
                      })()}
                      {(() => {
                        const pos = m[`position_${lang}`] || m.position
                        return pos ? <p style={{ fontSize: '13px', color: '#8a8a8a', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{pos}</p> : null
                      })()}
                      {(() => {
                        const bio = m[`bio_${lang}`] || m.bio
                        return bio ? <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.6', marginBottom: '14px' }}>{bio}</p> : null
                      })()}

                      <div style={{ borderTop: '1px solid #ece6db', paddingTop: '14px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {m.phone && (
                          <a
                            href={`tel:${m.phone}`}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#444', fontSize: '13px', textDecoration: 'none' }}
                          >
                            <i className="fa fa-phone" style={{ fontSize: '13px', color: '#444' }} />
                            <span>{m.phone}</span>
                          </a>
                        )}
                        {m.email && (
                          <a
                            href={`mailto:${m.email}`}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#444', fontSize: '13px', textDecoration: 'none', wordBreak: 'break-all' }}
                          >
                            <i className="fa fa-envelope" style={{ fontSize: '13px', color: '#444' }} />
                            <span>{m.email}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
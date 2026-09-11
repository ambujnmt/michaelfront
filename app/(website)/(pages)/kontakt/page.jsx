'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import { useSiteInfo } from '@/lib/SiteInfoContext'
import websiteApi from '@/lib/websiteApi'
import allTranslations from '@/lib/translations'
import { API_URL as API } from '@/service/config'

export default function Kontakt() {

  const router = useRouter()
  const { lang } = useLanguage()
  const siteInfo = useSiteInfo()
  const t = allTranslations.kontakt[lang]

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const [kontaktPage, setKontaktPage] = useState(null)

  useEffect(() => {
    websiteApi.getKontaktPage()
      .then(res => { if (res.success) setKontaktPage(res.data) })
      .catch(() => {})
  }, [])

  // Falls back to the static translation/defaults until an admin saves content for this field
  const pick = (dbVal, fallback) => (dbVal && dbVal.trim()) ? dbVal : fallback
  const stripEmptyBlocks = (html) => html.replace(/<(p|li)>(\s|&nbsp;|<br\s*\/?>)*<\/\1>/gi, '')

  const defaultOfficeHeading = t.officeHeading || (lang === 'de' ? 'Unser Büro' : 'Our Office')
  const defaultOfficeP1 = t.officeP1 || (lang === 'de'
    ? 'Lorem Ipsum ist einfach ein Blindtext der Druck- und Satzindustrie. Willkommen in unserem Büro — wir freuen uns, Sie persönlich kennenzulernen.'
    : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Welcome to our office — we look forward to meeting you in person.')
  const defaultOfficeP2 = t.officeP2 || (lang === 'de'
    ? 'Unser Team steht Ihnen bei all Ihren Immobilienanliegen jederzeit gerne zur Seite.'
    : 'Our team is always happy to help with all your property needs.')
  const defaultOfficeLi = [
    t.officeLi1 || (lang === 'de' ? 'Persönliche Beratung vor Ort' : 'Personal on-site consultation'),
    t.officeLi2 || (lang === 'de' ? 'Erfahrenes Maklerteam' : 'Experienced broker team'),
    t.officeLi3 || (lang === 'de' ? 'Individuelle Betreuung' : 'Individual support'),
  ]
  const fallbackContent = `<p>${defaultOfficeP1}</p><p>${defaultOfficeP2}</p><ul>${defaultOfficeLi.map(l => `<li>${l}</li>`).join('')}</ul>`

  const titleText    = pick(kontaktPage?.[`title_${lang}`], t.bannerTitle)
  const subtitleText = pick(kontaktPage?.[`subtitle_${lang}`], t.bannerSubtitle)
  const headingText  = pick(kontaktPage?.[`heading_${lang}`], defaultOfficeHeading)
  const contentHtml  = stripEmptyBlocks(pick(kontaktPage?.[`content_${lang}`], fallbackContent))
  const officeImage  = kontaktPage?.image ? `${API}${kontaktPage.image}` : '/assets/img/p5-right-img.png'

  const showFlash = (type, msg) => {
    if (type === 'success') setSuccess(msg)
    else setError(msg)
    setTimeout(() => { setSuccess(''); setError('') }, 4000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')
    setError('')

    try {
      const data = await websiteApi.submitContact(form)
      if (data.success) {
        showFlash('success', t.successMsg)
        setForm({ name: '', email: '', phone: '', message: '' })
      } else {
        showFlash('error', data.message || t.errorMsg)
      }
    } catch {
      showFlash('error', t.errorMsg)
    }

    setLoading(false)
  }

  return (
    <>
      {/* Page Heading — single banner, no nested duplicate */}
      <section className="inner-page-banner head-sec" style={{ padding: '50px 0px 50px 0px' }}>
        <div className="container text-center page-banner-inner">
          <button onClick={() => router.back()} className="btn btn1 page-banner-back" style={{ fontSize: '13px', padding: '8px 20px', flexShrink: 0 }}>
            <i className="fa fa-arrow-left" style={{ marginRight: '6px' }}></i>
            {lang === 'de' ? 'Zurück' : 'Back'}
          </button>
          <h1 style={{ margin: '0 0 8px' }}>{titleText}</h1>
          <h4 style={{ margin: 0 }}>{subtitleText}</h4>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container">

          {/* Office Photo full-width, content below (matches /unternehmen) */}
          <style>{`
            .kontakt-img-full {
              width: 100%;
              height: 420px;
              object-fit: cover;
              border-radius: 10px;
              border: 1px solid #ece6db;
              margin-bottom: 40px;
            }
            @media (max-width: 767px) {
              .kontakt-img-full { height: 240px; margin-bottom: 28px; }
            }
            .kontakt-content { max-width: 100%; }
            .kontakt-content * {
              max-width: 100%;
              white-space: normal;
              overflow-wrap: normal;
              word-wrap: normal;
              word-break: normal;
              hyphens: none;
            }
            .kontakt-content p { margin-bottom: 16px; }
            .kontakt-content ul { list-style: none; margin: 16px 0 0; padding: 0; }
            .kontakt-content ul li {
              position: relative;
              padding-left: 28px;
              margin-bottom: 10px;
              color: rgb(68, 68, 68);
            }
            .kontakt-content ul li::before {
              content: "\\f058";
              font-family: "FontAwesome";
              position: absolute;
              left: 0;
              top: 0;
              font-size: 16px;
              color: rgb(68, 68, 68);
            }
          `}</style>
          <div className="row mb-5">
            <div className="col-12">
              <img src={officeImage} alt="Office" className="kontakt-img-full" />
            </div>
            <div className="col-12 head-sec">
              <h2>{headingText}</h2>
              <div className="kontakt-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
            </div>
          </div>

          <div className="row g-5">

            {/* Form Column */}
            <div className="col-lg-7">
              <h3 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '28px', textTransform: 'uppercase', letterSpacing: '0.03em', fontFamily: 'var(--head-font)' }}>
                {t.formTitle}
              </h3>
              <form className="home-1-form" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={t.namePlaceholder}
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <input
                        type="tel"
                        className="form-control"
                        placeholder={t.phonePlaceholder}
                        value={form.phone}
                        onChange={e => {
                          const cleaned = e.target.value.replace(/[^\d+\s()-]/g, '')
                          let digits = 0
                          let limited = ''
                          for (const ch of cleaned) {
                            if (/\d/.test(ch)) {
                              if (digits >= 15) continue
                              digits++
                            }
                            limited += ch
                          }
                          setForm({ ...form, phone: limited })
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group mb-4">
                      <input
                        type="email"
                        className="form-control"
                        placeholder={t.emailPlaceholder}
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group mb-4">
                      <textarea
                        rows="6"
                        className="form-control"
                        placeholder={t.messagePlaceholder}
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {(success || error) && (
                    <div className="col-12 mb-3">
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '13px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: '600',
                        background: success ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                        border: `1px solid ${success ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
                        color: success ? '#16a34a' : '#dc2626',
                      }}>
                        <i className={`fa ${success ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
                        {success || error}
                      </div>
                    </div>
                  )}

                  <div className="col-12 mb-5">
                    <button type="submit" className="btn btn1" disabled={loading}
                      style={{ padding: '14px 40px', fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {loading ? t.sendingBtn : t.sendBtn}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Contact Info Column */}
            <div className="col-lg-5">
              <h3 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '28px', textTransform: 'uppercase', letterSpacing: '0.03em', fontFamily: 'var(--head-font)' }}>
                {t.contactTitle}
              </h3>

              <div className="kontakt-info-block">
                <div className="kontakt-info-item">
                  <div className="kontakt-icon">
                    <i className="fa fa-map-marker"></i>
                  </div>
                  <div>
                    {siteInfo.site_name && <p style={{ fontWeight: '600', marginBottom: '2px' }}>{siteInfo.site_name}</p>}
                    {siteInfo.address && <p style={{ color: '#666', margin: 0 }}>{siteInfo.address}</p>}
                  </div>
                </div>

                {siteInfo.phone && (
                  <div className="kontakt-info-item">
                    <div className="kontakt-icon">
                      <i className="fa fa-phone"></i>
                    </div>
                    <div>
                      <p style={{ margin: 0 }}>{siteInfo.phone}</p>
                    </div>
                  </div>
                )}

                {siteInfo.email && (
                  <div className="kontakt-info-item">
                    <div className="kontakt-icon">
                      <i className="fa fa-envelope"></i>
                    </div>
                    <div>
                      <p style={{ margin: 0 }}>{siteInfo.email}</p>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  )
}
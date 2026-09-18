'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'
import websiteApi from '@/lib/websiteApi'

import { API_URL as API } from '@/service/config'

export default function Verkauf() {
  const router = useRouter()
  const { lang } = useLanguage()
  const tr = translations.verkauf[lang]
  const t = translations.kontakt[lang]

  const [content, setContent] = useState(null)

  // Same contact form as the Kontakt page
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    websiteApi.getVerkaufPage()
      .then(res => { if (res.success) setContent(res.data) })
      .catch(() => {})
  }, [])

  const showFlash = (type, msg) => {
    if (type === 'success') setSuccess(msg)
    else setError(msg)
    setTimeout(() => { setSuccess(''); setError('') }, 4000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
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

    setSending(false)
  }

  // Falls back to the static translation until an admin saves content.
  const pick = (dbVal, fallback) => (dbVal && String(dbVal).trim()) ? dbVal : fallback

  // Quill leaves a trailing empty <p><br></p> behind — strip those so an
  // empty block doesn't render as a gap.
  const stripEmptyBlocks = (html) => html.replace(/<(p|li)>(\s|&nbsp;|<br\s*\/?>)*<\/\1>/gi, '')

  // True only when the HTML carries real text (not just <p></p>, <br>, &nbsp;).
  const hasText = (html) =>
    !!html && String(html).replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').trim().length > 0
  const pickHtml = (dbVal, fallback) => (hasText(dbVal) ? dbVal : fallback)

  const splitAt = tr.photoAfter + 1
  const fallbackTop    = tr.paragraphs.slice(0, splitAt).map(p => `<p>${p}</p>`).join('')
  const fallbackBottom = tr.paragraphs.slice(splitAt).map(p => `<p>${p}</p>`).join('')

  const heading    = pick(content?.[`heading_${lang}`], tr.heading)
  const title      = pick(content?.[`title_${lang}`], heading)
  // Only shown when the admin has actually set a subtitle — no static fallback.
  const subtitle   = content?.[`subtitle_${lang}`]?.trim() || ''
  const textTop    = stripEmptyBlocks(pickHtml(content?.[`text_top_${lang}`], fallbackTop))
  const textBottom = stripEmptyBlocks(pickHtml(content?.[`text_bottom_${lang}`], fallbackBottom))
  const photoNote  = pick(content?.[`photo_note_${lang}`], tr.photoNote)
  const photoImage = content?.image ? `${API}${content.image}` : ''

  return (
    <>
      <style>{`
        /* ── Verkauf intro (client text + photo placeholder) ──────────────
           Centered, readable single column that matches the premium
           editorial feel used across the site. */
        .verkauf-sec .verkauf-body {
          max-width: 100%;
          width: 100%;
          margin: 0 auto;
          /* Long German compounds must be able to wrap in the narrower
             column beside the photo — hyphenate at proper syllable
             points (needs lang="de"/"en" on the element), and hard-break
             as a last resort so nothing ever overflows / clips. */
          -webkit-hyphens: auto;
          hyphens: auto;
          overflow-wrap: break-word;
          word-wrap: break-word;
        }
        .verkauf-sec .verkauf-body::after {
          content: "";
          display: block;
          clear: both;
        }
        .verkauf-sec .verkauf-body p {
          margin-bottom: 18px;
        }
        .verkauf-sec .verkauf-body p:last-child {
          margin-bottom: 0;
        }
        /* Rich-text (admin Quill) blocks */
        .verkauf-rte ul,
        .verkauf-rte ol {
          margin: 0 0 18px;
          padding-left: 22px;
        }
        .verkauf-rte li {
          margin-bottom: 8px;
        }
        .verkauf-rte h1,
        .verkauf-rte h2,
        .verkauf-rte h3 {
          font-family: var(--head-font);
          color: #000;
          margin: 6px 0 14px;
          line-height: 1.3;
        }
        .verkauf-rte a {
          color: #8a6b3f;
          text-decoration: underline;
        }
        .verkauf-rte img {
          max-width: 100%;
          height: auto;
        }
        .verkauf-rte-below {
          margin-top: 18px;
        }

        /* Photo — full width, its own block between the two text blocks. */
        .verkauf-photo {
          width: 100%;
          margin: 24px 0;
        }
        .verkauf-photo img {
          display: block;
          width: 100%;
          height: 480px;
          object-fit: cover;
          border-radius: 4px;
        }
        .verkauf-photo-box {
          position: relative;
          width: 100%;
          height: 480px;
          background: #f7f4ee;
          border: 1px solid #e8e0d5;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #c3b393;
        }
        .verkauf-photo-box i {
          font-size: 40px;
        }
        .verkauf-photo-box span {
          font-family: var(--head-font);
          font-size: 13px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .verkauf-photo figcaption {
          margin-top: 10px;
          font-family: var(--head-font);
          font-size: 13px;
          line-height: 20px;
          color: #a9a093;
          text-align: center;
        }
        @media (max-width: 767px) {
          .verkauf-photo img,
          .verkauf-photo-box {
            height: 260px;
          }
        }
      `}</style>

      <section className="inner-page-banner head-sec" style={{ padding: '50px 0px 50px 0px' }}>
        <div className="container text-center page-banner-inner">
          <button
            onClick={() => router.back()}
            className="btn btn1 page-banner-back"
            style={{ fontSize: '13px', padding: '8px 20px', flexShrink: 0 }}
          >
            <i className="fa fa-arrow-left" style={{ marginRight: '6px' }}></i>
            {lang === 'de' ? 'Zurück' : 'Back'}
          </button>
          <h1 style={{ margin: 0 }}>{title}</h1>
          {subtitle ? <h4 style={{ margin: '8px 0 0' }}>{subtitle}</h4> : null}
        </div>
      </section>

      {/* ── Client text + photo ── */}
      <section className="section-padding verkauf-sec">
        <div className="container">
          <div className="row">
            <div className="col-12 verkauf-body" lang={lang}>
              <div
                className="verkauf-rte"
                dangerouslySetInnerHTML={{ __html: textTop }}
              />

              <figure className="verkauf-photo">
                {photoImage ? (
                  <img src={photoImage} alt={heading} />
                ) : (
                  <div className="verkauf-photo-box">
                    <i className="fa fa-camera" aria-hidden="true" />
                    <span>{lang === 'de' ? 'Foto' : 'Photo'}</span>
                  </div>
                )}
                {!photoImage && photoNote ? <figcaption>{photoNote}</figcaption> : null}
              </figure>

              <div
                className="verkauf-rte verkauf-rte-below"
                dangerouslySetInnerHTML={{ __html: textBottom }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact form (same as the Kontakt page) ── */}
      <section className="section-padding" style={{ paddingTop: '100px' }}>
        <div className="container">
          <div className="row">

            <div className="col-12">
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
                    <button type="submit" className="btn btn1" disabled={sending}
                      style={{ padding: '14px 40px', fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {sending ? t.sendingBtn : t.sendBtn}
                    </button>
                  </div>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>

    </>
  )
}

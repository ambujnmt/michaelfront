'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import { useSiteInfo } from '@/lib/SiteInfoContext'
import websiteApi from '@/lib/websiteApi'
import allTranslations from '@/lib/translations'

export default function Kontakt() {

  const router = useRouter()
  const { lang } = useLanguage()
  const siteInfo = useSiteInfo()
  const t = allTranslations.kontakt[lang]

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

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
      <section className="inner-page-banner head-sec">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h1 style={{ margin: 0 }}>{t.bannerTitle}</h1>
            <button onClick={() => router.back()} className="btn btn1" style={{ fontSize: '13px', padding: '8px 20px', flexShrink: 0 }}>
              <i className="fa fa-arrow-left" style={{ marginRight: '6px' }}></i>
              {lang === 'de' ? 'Zurück' : 'Back'}
            </button>
          </div>
          <p style={{ color: '#666', fontSize: '16px', margin: 0, fontFamily: 'var(--pera-font)' }}>{t.bannerSubtitle}</p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container">
          <div className="row g-5">

            {/* Form Column */}
            <div className="col-lg-7">
              <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '28px', textTransform: 'uppercase', letterSpacing: '0.03em', fontFamily: 'var(--head-font)' }}>
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
                        type="text"
                        className="form-control"
                        placeholder={t.phonePlaceholder}
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
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

                  <div className="col-12">
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
              <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '28px', textTransform: 'uppercase', letterSpacing: '0.03em', fontFamily: 'var(--head-font)' }}>
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

                {siteInfo.opening_hours && (
                  <div className="kontakt-info-item">
                    <div className="kontakt-icon">
                      <i className="fa fa-clock-o"></i>
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', marginBottom: '2px' }}>{lang === 'de' ? 'Öffnungszeiten' : 'Opening Hours'}</p>
                      <p style={{ color: '#666', margin: 0 }}>{siteInfo.opening_hours}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Office Photo + Paragraph */}
              <div style={{ marginTop: '32px' }}>
                <img
                  src="/assets/img/p5-right-img.png"
                  alt="Office"
                  className="img-fluid w-100"
                  style={{ borderRadius: '10px', height: '220px', objectFit: 'cover', border: '1px solid #ece6db' }}
                />
                <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.7', marginTop: '16px' }}>
                  {t.officeText || (lang === 'de'
                    ? 'Lorem Ipsum ist einfach ein Blindtext der Druck- und Satzindustrie. Willkommen in unserem Büro — wir freuen uns, Sie persönlich kennenzulernen und Ihnen bei all Ihren Immobilienanliegen zur Seite zu stehen.'
                    : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Welcome to our office — we look forward to meeting you in person and helping with all your property needs.')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
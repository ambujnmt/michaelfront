'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import { useSiteInfo } from '@/lib/SiteInfoContext'
import translations from '@/lib/translations'
import websiteApi from '@/lib/websiteApi'

export default function Suchagent() {
  const router = useRouter()
  const { lang } = useLanguage()
  const { site_name, address, email: siteEmail, phone, opening_hours } = useSiteInfo()
  const tr = translations.suchagent[lang]

  const [form, setForm] = useState({ type: '', location: '', size: '', price: '', email: '', phone: '' })
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email.trim()) return
    setStatus('loading')
    try {
      const message = `Typ: ${form.type || '—'} | Standort: ${form.location || '—'} | Min. Größe: ${form.size || '—'} m² | Max. Preis: ${form.price || '—'} €`
      const res = await websiteApi.submitInquiry({ name: '—', email: form.email, phone: '', message })
      setStatus(res.success ? 'success' : 'error')
      if (res.success) setForm({ type: '', location: '', size: '', price: '', email: '', phone: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section style={{ padding: '40px 0 100px' }}>
      <div className="container">

        {/* Page Heading */}
        <div className="row mb-5">
          <div className="col-12">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '38px', fontWeight: '700', textTransform: 'uppercase', margin: 0, fontFamily: 'var(--head-font)' }}>
                {tr.bannerTitle}
              </h1>
              <button onClick={() => router.back()} className="btn btn1" style={{ fontSize: '13px', padding: '8px 20px', flexShrink: 0 }}>
                <i className="fa fa-arrow-left" style={{ marginRight: '6px' }}></i>
                {lang === 'de' ? 'Zurück' : 'Back'}
              </button>
            </div>
            <p style={{ color: '#666', fontSize: '16px', margin: 0, fontFamily: 'var(--pera-font)' }}>{tr.bannerSub}</p>
          </div>
        </div>

        {/* Form + Office Detail */}
        <div className="row g-5">
          <div className="col-lg-8">

            <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.03em', fontFamily: 'var(--head-font)' }}>
              {tr.formTitle}
            </h3>
            <p style={{ color: '#666', fontSize: '15px', marginBottom: '32px', fontFamily: 'var(--pera-font)' }}>{tr.formDesc}</p>

            <form className="home-1-form" onSubmit={handleSubmit}>
              <div className="row">

                <div className="col-md-6">
                  <div className="form-group mb-4">
                    <label className="suchagent-label">{tr.locationLabel}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={tr.locationPlaceholder}
                      value={form.location}
                      onChange={e => setForm({ ...form, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-4">
                    <label className="suchagent-label">{tr.sizeLabel}</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder={tr.sizePlaceholder}
                      value={form.size}
                      onChange={e => setForm({ ...form, size: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-4">
                    <label className="suchagent-label">{tr.priceLabel}</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder={tr.pricePlaceholder}
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-4">
                    <label className="suchagent-label">{lang === 'de' ? 'Telefonnummer' : 'Phone Number'}</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder={lang === 'de' ? 'z.B. +43 664 000 0000' : 'e.g. +43 664 000 0000'}
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-group mb-4">
                    <label className="suchagent-label">{tr.emailLabel}</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder={tr.emailPlaceholder}
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {status === 'success' && (
                  <div className="col-12 mb-3">
                    <p style={{ color: 'green', fontSize: '14px', margin: 0 }}>
                      {lang === 'de' ? 'Suchagent erfolgreich aktiviert! Wir melden uns bald.' : 'Search agent activated! We will be in touch.'}
                    </p>
                  </div>
                )}
                {status === 'error' && (
                  <div className="col-12 mb-3">
                    <p style={{ color: 'red', fontSize: '14px', margin: 0 }}>
                      {lang === 'de' ? 'Fehler. Bitte versuche es erneut.' : 'Error. Please try again.'}
                    </p>
                  </div>
                )}

                <div className="col-12">
                  <button type="submit" className="btn btn1" disabled={status === 'loading'}
                    style={{ padding: '14px 40px', fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {status === 'loading' ? '...' : tr.btnText}
                  </button>
                </div>

              </div>
            </form>
          </div>

          {/* Office Detail */}
          <div className="col-lg-4">
            <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '28px', textTransform: 'uppercase', letterSpacing: '0.03em', fontFamily: 'var(--head-font)' }}>
              {lang === 'de' ? 'Unser Büro' : 'Our Office'}
            </h3>

            <div className="kontakt-info-block">
              <div className="kontakt-info-item">
                <div className="kontakt-icon">
                  <i className="fa fa-map-marker"></i>
                </div>
                <div>
                  {site_name && <p style={{ fontWeight: '600', marginBottom: '2px' }}>{site_name}</p>}
                  {address && <p style={{ color: '#666', margin: 0 }}>{address}</p>}
                </div>
              </div>

              {phone && (
                <div className="kontakt-info-item">
                  <div className="kontakt-icon">
                    <i className="fa fa-phone"></i>
                  </div>
                  <div>
                    <p style={{ margin: 0 }}>{phone}</p>
                  </div>
                </div>
              )}

              {siteEmail && (
                <div className="kontakt-info-item">
                  <div className="kontakt-icon">
                    <i className="fa fa-envelope"></i>
                  </div>
                  <div>
                    <p style={{ margin: 0 }}>{siteEmail}</p>
                  </div>
                </div>
              )}

              {opening_hours && (
                <div className="kontakt-info-item">
                  <div className="kontakt-icon">
                    <i className="fa fa-clock-o"></i>
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', marginBottom: '2px' }}>{lang === 'de' ? 'Öffnungszeiten' : 'Opening Hours'}</p>
                    <p style={{ color: '#666', margin: 0 }}>{opening_hours}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

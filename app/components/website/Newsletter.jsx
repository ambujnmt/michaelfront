'use client'

import { useState } from 'react'
import websiteApi from '@/lib/websiteApi'
import { useLanguage } from '@/lib/LanguageContext'
import { useSiteInfo } from '@/lib/SiteInfoContext'
import { API_URL as API } from '@/service/config'

export default function Newsletter() {
  const { lang } = useLanguage()
  const siteInfo = useSiteInfo()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // 'success' | 'error' | 'duplicate' | null
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setStatus(null)
    try {
      const res = await websiteApi.subscribe(email)
      if (res.success) {
        setStatus('success')
        setEmail('')
      } else if (res.message && res.message.toLowerCase().includes('already')) {
        setStatus('duplicate')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
    setTimeout(() => setStatus(null), 4000)
  }

  const labels = {
    de: {
      title: 'Newsletter abonnieren',
      placeholder: 'Geben Sie Ihre E-Mail-Adresse ein',
      btn: 'Abonnieren',
      sending: 'Senden...',
      success: 'Erfolgreich abonniert!',
      duplicate: 'Diese E-Mail ist bereits registriert.',
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    },
    en: {
      title: 'Subscribe to Newsletter',
      placeholder: 'Enter your e-mail address',
      btn: 'Subscribe',
      sending: 'Sending...',
      success: 'Successfully subscribed!',
      duplicate: 'This email is already registered.',
      error: 'An error occurred. Please try again.',
    },
  }

  const t = labels[lang] || labels.de

  return (
    <section
      className="newsletter-sec"
      style={siteInfo.newsletter_bg ? {
        backgroundImage: `url(${API}${siteInfo.newsletter_bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      } : undefined}
    >
      <div className="container-fluid p-0">
        <div className="col-lg-8 col-md-10 col-12 mx-auto">
          <div className="head-sec text-center">
            <h1>{t.title}</h1>

            <form className="newsletter-input" onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control"
                placeholder={t.placeholder}
                value={email}
                onChange={e => { setEmail(e.target.value); setStatus(null) }}
                disabled={loading}
                required
              />
              <button type="submit" className="btn news-btn" disabled={loading}>
                {loading ? t.sending : t.btn}
              </button>
            </form>

            {status && status !== 'loading' && (() => {
              const cfg = {
                success:   { icon: 'fa-check-circle',       bg: '#16a34a', border: '#22c55e', msg: t.success },
                duplicate: { icon: 'fa-exclamation-circle', bg: '#d97706', border: '#f59e0b', msg: t.duplicate },
                error:     { icon: 'fa-times-circle',        bg: '#dc2626', border: '#ef4444', msg: t.error },
              }[status]
              return cfg ? (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  margin: '18px auto 0', maxWidth: '440px', padding: '13px 20px', borderRadius: '10px',
                  background: cfg.bg, border: `1px solid ${cfg.border}`, color: '#ffffff',
                  fontSize: '14px', fontWeight: '700', boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
                }}>
                  <i className={`fa ${cfg.icon}`} style={{ fontSize: '16px', color: '#ffffff' }} />{cfg.msg}
                </div>
              ) : null
            })()}
          </div>
        </div>
      </div>
    </section>
  )
}

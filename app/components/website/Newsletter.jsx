'use client'

import { useState } from 'react'
import websiteApi from '@/lib/websiteApi'
import { useLanguage } from '@/lib/LanguageContext'

export default function Newsletter() {
  const { lang } = useLanguage()
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
    <section className="newsletter-sec">
      <div className="container-fluid p-0">
        <div className="col-lg-8 col-md-10 col-12 mx-auto">
          <div className="head-sec text-center">
            <h3>{t.title}</h3>

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
                success:   { icon: 'fa-check-circle',       color: '#16a34a', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.4)',  msg: t.success },
                duplicate: { icon: 'fa-exclamation-circle', color: '#b45309', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)', msg: t.duplicate },
                error:     { icon: 'fa-times-circle',        color: '#dc2626', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.4)',  msg: t.error },
              }[status]
              return cfg ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '14px', padding: '10px 18px', borderRadius: '8px', background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontSize: '13px', fontWeight: '600' }}>
                  <i className={`fa ${cfg.icon}`} />{cfg.msg}
                </div>
              ) : null
            })()}
          </div>
        </div>
      </div>
    </section>
  )
}

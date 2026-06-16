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
      } else if (res.message === 'Email already subscribed') {
        setStatus('duplicate')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
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

            {status === 'success' ? (
              <div style={{ color: '#34d399', fontWeight: '600', fontSize: '15px', marginTop: '12px' }}>
                <i className="fa fa-check-circle" style={{ marginRight: '8px' }} />
                {t.success}
              </div>
            ) : (
              <form className="newsletter-input" onSubmit={handleSubmit}>
                <input
                  type="email"
                  className="form-control"
                  placeholder={t.placeholder}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn news-btn" disabled={loading}>
                  {loading ? t.sending : t.btn}
                </button>
              </form>
            )}

            {(status === 'error' || status === 'duplicate') && (
              <p style={{ color: '#f87171', fontSize: '13px', marginTop: '10px' }}>
                {status === 'duplicate' ? t.duplicate : t.error}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

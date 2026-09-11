'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'
import websiteApi from '@/lib/websiteApi'
import { API_URL as API } from '@/service/config'
import HomeHeader from '../components/website/HomeHeader'
import HomeFooter from '../components/website/HomeFooter'
import PropertyCarousel from '../components/website/PropertyCarousel'
import Newsletter from '../components/website/Newsletter'

const MODAL_STORAGE_KEY = 'newsletterModalLastShown'
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000

function NewsletterModal({ onClose }) {
  const { lang } = useLanguage()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // 'success' | 'error' | 'duplicate' | null
  const [loading, setLoading] = useState(false)

  const labels = {
    de: {
      title: 'Newsletter abonnieren',
      desc: 'Bleiben Sie über neue Immobilien und Angebote informiert.',
      placeholder: 'Ihre E-Mail-Adresse',
      btn: 'Abonnieren',
      sending: 'Senden...',
      success: 'Erfolgreich abonniert!',
      duplicate: 'Diese E-Mail ist bereits registriert.',
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    },
    en: {
      title: 'Subscribe to our Newsletter',
      desc: 'Stay updated on new properties and offers.',
      placeholder: 'Your email address',
      btn: 'Subscribe',
      sending: 'Sending...',
      success: 'Successfully subscribed!',
      duplicate: 'This email is already registered.',
      error: 'An error occurred. Please try again.',
    },
  }
  const t = labels[lang] || labels.de

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
        // auto-close the modal 1 second after a successful subscribe
        setTimeout(() => onClose(), 1000)
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
  }

  const statusCfg = status && {
    success:   { icon: 'fa-check-circle',       color: '#16a34a', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.4)',  msg: t.success },
    duplicate: { icon: 'fa-exclamation-circle', color: '#b45309', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)', msg: t.duplicate },
    error:     { icon: 'fa-times-circle',        color: '#dc2626', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.4)',  msg: t.error },
  }[status]

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: '8px',
          maxWidth: '480px',
          width: '100%',
          padding: '40px 36px',
          textAlign: 'center',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: 'transparent',
            border: 'none',
            fontSize: '22px',
            lineHeight: 1,
            cursor: 'pointer',
            color: '#888',
          }}
        >
          &times;
        </button>

        <h3 style={{ marginBottom: '10px' }}>{t.title}</h3>
        <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>{t.desc}</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus(null) }}
            placeholder={t.placeholder}
            disabled={loading}
            style={{
              flex: '1 1 220px',
              padding: '12px 14px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
          <button
            type="submit"
            className="btn btn1"
            disabled={loading}
            style={{ padding: '12px 24px', fontSize: '14px' }}
          >
            {loading ? t.sending : t.btn}
          </button>
        </form>

        {statusCfg && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '14px', padding: '10px 18px', borderRadius: '8px', background: statusCfg.bg, border: `1px solid ${statusCfg.border}`, color: statusCfg.color, fontSize: '13px', fontWeight: '600' }}>
            <i className={`fa ${statusCfg.icon}`} />{statusCfg.msg}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const { lang } = useLanguage()
  const tr = translations.home[lang] || translations.home['de']
  const [showModal, setShowModal] = useState(false)
  const [videoBanner, setVideoBanner] = useState(null)

  useEffect(() => {
    websiteApi.getVideoBanner().then(res => {
      if (res.success) setVideoBanner(res.data)
    })
  }, [])

  // Video banner section — editable in the admin panel (Video Banner);
  // falls back to the static asset/translation until admin data has loaded
  // or if a field is left empty.
  const videoBannerText = videoBanner?.[`text_${lang}`] || tr.sec3Text
  const videoBannerSrc = videoBanner?.video ? `${API}${videoBanner.video}` : '/assets/img/p5-vdo2.mp4'

  useEffect(() => {
    // Only show once every 24 hours, regardless of login/logout or new sessions.
    const lastShown = localStorage.getItem(MODAL_STORAGE_KEY)
    const now = Date.now()

    if (lastShown && now - Number(lastShown) < TWENTY_FOUR_HOURS_MS) {
      return // already shown within the last 24 hours
    }

    const timer = setTimeout(() => {
      setShowModal(true)
      localStorage.setItem(MODAL_STORAGE_KEY, String(Date.now()))
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="page-wraper">

      <HomeHeader />

      {/* Shows at most once every 24 hours, tracked via localStorage */}
      {showModal && <NewsletterModal onClose={() => setShowModal(false)} />}

      {/* ── SEC 1 — PROPERTIES (3 highlighted) ── */}
      <PropertyCarousel />

      {/* ── SEC 2 — VIDEO BANNER ── */}
      <section className="p5-sec3">
        <video key={videoBannerSrc} autoPlay muted loop playsInline className="background-video">
          <source src={videoBannerSrc} type="video/mp4" />
        </video>
        <div className="overlay"></div>
        <div className="content head-sec">
          <h1>{videoBannerText}</h1>
        </div>
      </section>

      {/* ── SEC 3 — SELL PROPERTY ── */}
      {/* <section className="p5-sec4">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="p5-sec4-col1 head-sec">
                <h3>{tr.sec5Heading}</h3>
                <h5>{tr.sec5Sub}</h5>
                <div className="pera2">
                  <p>{tr.sec5Desc}</p>
                </div>
                <Link href="/kontakt">
                  <button type="button" className="btn btn1">{tr.sec5Btn}</button>
                </Link>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <img src="/assets/img/p5-right-img.png" alt="image" />
            </div>
          </div>
        </div>
      </section> */}

      {/* ── SEC 3 — NEWSLETTER (unchanged) ── */}
      <Newsletter />

      <HomeFooter />

    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useSiteInfo } from '@/lib/SiteInfoContext'
import websiteApi from '@/lib/websiteApi'

const t = {
  de: {
    desc: 'Ich stelle die Bedürfnisse meiner Kunden in den Mittelpunkt unserer Zusammenarbeit, um allen Beteiligten einen hohen Mehrwert zu bieten.',
    newsletter: 'Informationen und Tipps',
    emailPh: 'E-Mail eingeben',
    subscribBtn: 'Abonnieren',
    linksTitle: 'Wichtige Links',
    links: ['Über uns', 'Immobilien', 'Verkauf', 'Team', 'Suchagent', 'Datenschutz', 'Impressum', 'Kontakt'],
    sayHello: 'Sag Hallo',
    copyright: '© MICHAELLEBER 2026 • ALLE RECHTE VORBEHALTEN',
  },
  en: {
    desc: 'I place the needs of my clients at the centre of our collaboration to provide high added value for all parties involved.',
    newsletter: 'Information & Tips',
    emailPh: 'Enter your email',
    subscribBtn: 'Subscribe',
    linksTitle: 'Important Links',
    links: ['About', 'Properties', 'Sales', 'Team', 'Search Agent', 'Data Protection', 'Imprint', 'Contact'],
    sayHello: 'Say Hello',
    copyright: '© MICHAELLEBER 2026 • ALL RIGHTS RESERVED',
  },
}

const hrefs = ['/uber-uns', '/immobilien', '/verkauf', '/team', '/suchagent', '/datenschutz', '/impressum', '/kontakt']

export default function HomeFooter() {
  const { lang } = useLanguage()
  const { email: siteEmail, phone } = useSiteInfo()
  const tr = t[lang]
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'duplicate' | 'error'

  const handleSubscribe = async () => {
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await websiteApi.subscribe(email.trim())
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
    }
    setTimeout(() => setStatus(null), 4000)
  }

  return (
    <>
      <section className="footer-2">
        <div className="container">
          <div className="row">

            {/* COL 1 — LOGO + NEWSLETTER */}
            <div className="col-lg-4 col-md-4 col-12">
              <div className="foot-col1">
                <Link href="/">
                  <img src="/assets/img/black-logo.png" alt="image" />
                </Link>
                <p>{tr.desc}</p>
                <h5>{tr.newsletter}</h5>
                <div className="newsletter-input2">
                  <input
                    type="email"
                    className="form-control"
                    placeholder={tr.emailPh}
                    value={email}
                    onChange={e => { setEmail(e.target.value); setStatus(null) }}
                    onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                    disabled={status === 'loading'}
                  />
                  <button
                    type="button"
                    className="btn news-btn2"
                    onClick={handleSubscribe}
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? '...' : tr.subscribBtn}
                  </button>
                </div>
                {status && status !== 'loading' && (() => {
                  const cfg = {
                    success:   { icon: 'fa-check-circle',       color: '#16a34a', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.4)',  msg: lang === 'de' ? 'Erfolgreich abonniert!' : 'Successfully subscribed!' },
                    duplicate: { icon: 'fa-exclamation-circle', color: '#b45309', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)', msg: lang === 'de' ? 'Diese E-Mail ist bereits registriert.' : 'This email is already subscribed.' },
                    error:     { icon: 'fa-times-circle',        color: '#dc2626', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.4)',  msg: lang === 'de' ? 'Fehler. Bitte versuche es erneut.' : 'Error. Please try again.' },
                  }[status]
                  return cfg ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', padding: '10px 14px', borderRadius: '8px', background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontSize: '13px', fontWeight: '600' }}>
                      <i className={`fa ${cfg.icon}`} />{cfg.msg}
                    </div>
                  ) : null
                })()}
              </div>
            </div>

            {/* COL 2 — LINKS */}
            <div className="col-lg-5 col-md-5 col-12">
              <div className="foot-col1 foot-col2 foot-col5">
                <h5>{tr.linksTitle}</h5>
                <ul className="foot-col1-ul">
                  {hrefs.map((href, i) => (
                    <li key={i}><Link href={href}>{tr.links[i]}</Link></li>
                  ))}
                </ul>
              </div>
            </div>

            {/* COL 3 — CONTACT */}
            <div className="col-lg-3 col-md-3 col-12">
              <div className="foot-col1 foot-col2">
                <h3>{tr.sayHello}</h3>
                <h6>{siteEmail}</h6>
                <div className="foot-col-border"></div>
                <h6><span>{phone}</span></h6>
                <div className="foot-social-icon2">
                  <ul>
                    <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                    <li><a href="#"><i className="fa fa-instagram"></i></a></li>
                    <li><a href="#"><i className="fa fa-linkedin"></i></a></li>
                    <li><a href="#"><i className="fa fa-youtube"></i></a></li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="copyright-row">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <p>{tr.copyright}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <button className="scroltop">
        <span className="iconmoon-house relative" id="btn-vibrate"></span>
        Top
      </button>
    </>
  )
}

'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useSiteInfo } from '@/lib/SiteInfoContext'

const t = {
  de: {
    contactTitle: 'Kontakt',
    links: ['Datenschutz', 'Impressum'],
    copyright: '© MICHAELLEBER 2026. ALLE RECHTE VORBEHALTEN',
  },
  en: {
    contactTitle: 'Contact',
    links: ['Data Protection', 'Imprint'],
    copyright: '© MICHAELLEBER 2026. ALL RIGHTS RESERVED',
  },
}

const hrefs = ['/datenschutz', '/impressum']

// Fast scroll-to-top: ~350ms with easing, vs. the old jQuery version's 1000ms.
const SCROLL_TOP_DURATION = 350
function easeOutQuad(x) { return 1 - (1 - x) * (1 - x) }

export default function HomeFooter() {
  const { lang } = useLanguage()
  const { email, phone, facebook, instagram, linkedin, youtube, twitter } = useSiteInfo()
  const tr = t[lang] || t.de

  // Implemented natively in React instead of relying on the legacy jQuery
  // scroll_top()/custom.js binding — that binding is set up once via
  // jQuery(document).ready() on the very first page load and attaches
  // directly to whichever button DOM node exists at that moment. After any
  // client-side route change remounts the footer, the button is a new DOM
  // node the old jQuery handler never sees, so clicks silently did nothing.
  const [showTop, setShowTop] = useState(false)
  const rafRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const scrollToTop = useCallback((e) => {
    e.preventDefault()
    cancelAnimationFrame(rafRef.current)
    const start = window.scrollY
    if (start === 0) return
    const startTime = performance.now()

    const step = (now) => {
      const progress = Math.min((now - startTime) / SCROLL_TOP_DURATION, 1)
      window.scrollTo(0, start * (1 - easeOutQuad(progress)))
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
  }, [])

  const socialLinks = [
    { url: facebook,  icon: 'fa-facebook',  label: 'Facebook' },
    { url: instagram, icon: 'fa-instagram', label: 'Instagram' },
    { url: linkedin,  icon: 'fa-linkedin',  label: 'LinkedIn' },
    { url: youtube,   icon: 'fa-youtube',   label: 'YouTube' },
    { url: twitter,   icon: 'fa-twitter',   label: 'Twitter' },
  ].filter(s => s.url) // only keep the ones that actually have a link set

  return (
    <>
      <footer className="site-footer footer-dark">
        <div className="footer-top overlay-wraper">
          <div className="overlay-main"></div>

          <div className="container">
            <div className="row align-items-start">

              {/* LOGO */}
              <div className="col-lg-4 col-md-6 mb-4">
                <div className="widget widget_about">
                  <Link href="/">
                    {/* Use a higher-resolution logo or SVG if available */}
                    <img
                      src="/assets/img/new-logo.svg"
                      alt="MICHAELLEBER"
                      className="img-fluid"
                    />
                  </Link>
                </div>
              </div>

              {/* CONTACT */}
              <div className="col-lg-5 col-md-6 mb-4">
                <div className="widget widget_services">
                  <h4 className="widget-title">{tr.contactTitle}</h4>

                  <ul>
                    <li>
                      <a href={`mailto:${email}`}>
                        <i className="fa fa-envelope"></i> {email}
                      </a>
                    </li>

                    <li>
                      <a href={`tel:${phone.replace(/\s/g, '')}`}>
                        <img
                          src="/assets/img/phone.png"
                          alt="Phone"
                          className="foot-phone-img"
                        />{' '}
                        {phone}
                      </a>
                    </li>
                  </ul>

                  
                </div>
              </div>

              {/* FOOTER LINKS */}
              <div className="col-lg-3 col-md-12 mb-4">
                <div className="widget widget_services foot-link-col2">
                  <ul>
                    {hrefs.map((href, i) => (
                      <li key={i}>
                        <Link href={href}>{tr.links[i]}</Link>
                      </li>
                    ))}
                  </ul>

                  {/* Social Icons — only ones with a link set are shown */}
                  {socialLinks.length > 0 && (
                    <div className="foot-social-icons mt-4">
                      <ul>
                        {socialLinks.map(s => (
                          <li key={s.label}>
                            <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                              <i className={`fa ${s.icon}`}></i>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* COPYRIGHT */}
          <div className="footer-bottom overlay-wraper">
            <div className="overlay-main"></div>

            <div className="container">
              <div className="row align-items-center">

                <div className="col-12 text-center">
                  <span className="copyrights-text">
                    {tr.copyright}
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </footer>

      <style>{`
        .home-scroltop {
          height: 55px;
          width: 55px;
          background: #161616;
          border: 3px solid #000;
          color: #9DAF9F;
          position: fixed;
          right: 15px;
          bottom: 15px;
          font-size: 11px;
          line-height: 16px;
          font-weight: bold;
          text-transform: uppercase;
          margin: 0;
          padding: 0;
          cursor: pointer;
          text-align: center;
          z-index: 999;
          border-radius: 50%;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .home-scroltop.show { opacity: 1; visibility: visible; pointer-events: auto; }
        .home-scroltop span { display: block; font-size: 24px; line-height: 24px; }
        @media only screen and (max-width: 480px) {
          .home-scroltop { font-size: 7px; height: 30px; width: 30px; line-height: 16px; }
          .home-scroltop span { font-size: 10px; line-height: 10px; }
        }
      `}</style>

      <button
        type="button"
        className={`home-scroltop${showTop ? ' show' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <span
          className="iconmoon-house relative"
          id="btn-vibrate"
        ></span>
        Top
      </button>
    </>
  )
}
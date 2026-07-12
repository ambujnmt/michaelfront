'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useSiteInfo } from '@/lib/SiteInfoContext'

const t = {
  de: {
    contactTitle: 'Kontakt',
    col2: ['Datenschutz', 'Impressum'],
    copyright: '© MICHAELLEBER 2026. ALLE RECHTE VORBEHALTEN',
  },
  en: {
    contactTitle: 'Contact',
    col2: ['Data Protection', 'Imprint'],
    copyright: '© MICHAELLEBER 2026. ALL RIGHTS RESERVED',
  },
}

export default function Footer() {
  const { lang } = useLanguage()
  const { email, phone, facebook, instagram, linkedin, youtube, twitter } = useSiteInfo()
  const tr = t[lang] || t.de

  const socialLinks = [
    { url: facebook,  icon: 'fa-facebook',  label: 'Facebook' },
    { url: instagram, icon: 'fa-instagram', label: 'Instagram' },
    { url: linkedin,  icon: 'fa-linkedin',  label: 'LinkedIn' },
    { url: youtube,   icon: 'fa-youtube',   label: 'YouTube' },
    { url: twitter,   icon: 'fa-twitter',   label: 'Twitter' },
  ].filter(s => s.url) // only keep the ones that actually have a link set

  return (
    <footer className="site-footer footer-dark">
      <div className="footer-top overlay-wraper">
        <div className="overlay-main"></div>

        <div className="container">
          <div className="row align-items-start">

            {/* LOGO */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="widget widget_about">
                <Link href="/">
                  <img
                    src="/assets/img/logo.png"
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
                  <li>
                    <Link href="/datenschutz">{tr.col2[0]}</Link>
                  </li>

                  <li>
                    <Link href="/impressum">{tr.col2[1]}</Link>
                  </li>
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

              <div className="col-lg-8 col-md-12 text-center text-lg-start">
                <span className="copyrights-text">
                  {tr.copyright}
                </span>
              </div>

              <div className="col-lg-4 col-md-12 text-center text-lg-end">
                <span className="copyrights-text copyrights-text2">
                  Website By: Digital Flavers
                </span>
              </div>

            </div>
          </div>
        </div>

      </div>

      <button className="scroltop">
        <span
          className="iconmoon-house relative"
          id="btn-vibrate"
        ></span>
        Top
      </button>
    </footer>
  )
}

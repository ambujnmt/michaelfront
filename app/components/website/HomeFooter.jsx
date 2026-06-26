'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useSiteInfo } from '@/lib/SiteInfoContext'

const t = {
  de: {
    contactTitle: 'Kontaktieren Sie Uns',
    links1: ['Um', 'Eigentum', 'Verkauf', 'Team'],
    links2: ['Suchagent', 'Datenschutz', 'Impressum', 'Kontakt'],
    copyright: '© MICHAELLEBER 2026. ALLE RECHTE VORBEHALTEN',
  },
  en: {
    contactTitle: 'Contact Us',
    links1: ['About', 'Properties', 'Sales', 'Team'],
    links2: ['Search Agent', 'Data Protection', 'Imprint', 'Contact'],
    copyright: '© MICHAELLEBER 2026. ALL RIGHTS RESERVED',
  },
}

const hrefs1 = ['/uber-uns', '/immobilien', '/verkauf', '/team']
const hrefs2 = ['/suchagent', '/datenschutz', '/impressum', '/kontakt']

export default function HomeFooter() {
  const { lang } = useLanguage()
  const { email, phone } = useSiteInfo()
  const tr = t[lang] || t['de']

  return (
    <>
      <footer className="site-footer footer-dark">
        <div className="footer-top overlay-wraper">
          <div className="overlay-main"></div>

          <div className="container">
            <div className="row">

              {/* LOGO */}
              <div className="col-lg-3 col-md-6">
                <div className="widget widget_about">
                  <Link href="/">
                    <img src="/assets/img/logo.png" alt="image" />
                  </Link>
                </div>
              </div>

              {/* CONTACT */}
              <div className="col-lg-4 col-md-6 col-sm-6">
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
                        <img src="/assets/img/phone.png" alt="image" className="foot-phone-img" />
                        {' '}{phone}
                      </a>
                    </li>
                  </ul>
                  <div className="foot-social-icons">
                    <ul>
                      <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                      <li><a href="#"><i className="fa fa-instagram"></i></a></li>
                      <li><a href="#"><i className="fa fa-linkedin"></i></a></li>
                      <li><a href="#"><i className="fa fa-youtube"></i></a></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* LINKS COL 1 */}
              <div className="col-lg-2 col-md-6 col-sm-6">
                <div className="widget widget_services foot-link-col2">
                  <ul>
                    {hrefs1.map((href, i) => (
                      <li key={i}><Link href={href}>{tr.links1[i]}</Link></li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* LINKS COL 2 */}
              <div className="col-lg-3 col-md-6">
                <div className="widget widget_services foot-link-col2">
                  <ul>
                    {hrefs2.map((href, i) => (
                      <li key={i}><Link href={href}>{tr.links2[i]}</Link></li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>

          {/* COPYRIGHT */}
          <div className="footer-bottom overlay-wraper">
            <div className="overlay-main"></div>
            <div className="container">
              <div className="row">
                <div className="col-lg-2 col-md-3 col-12"></div>
                <div className="col-lg-7 col-md-12 col-12 text-center">
                  <span className="copyrights-text">{tr.copyright}</span>
                </div>
                <div className="col-lg-3 col-md-12 col-12">
                  <span className="copyrights-text copyrights-text2">Website By: Digital Flavers</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </footer>

      <button className="scroltop">
        <span className="iconmoon-house relative" id="btn-vibrate"></span>
        Top
      </button>
    </>
  )
}

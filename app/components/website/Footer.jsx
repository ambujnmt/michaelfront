'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import { useSiteInfo } from '@/lib/SiteInfoContext'
import translations from '@/lib/translations'

const t = {
  de: {
    contactTitle: 'Kontaktieren Sie Uns',
    col1: ['Über uns', 'Immobilien', 'Verkauf', 'Team'],
    col2: ['Suchagent', 'Datenschutz', 'Impressum', 'Kontakt'],
    copyright: '© MICHAELLEBER 2026. ALLE RECHTE VORBEHALTEN',
  },
  en: {
    contactTitle: 'Contact Us',
    col1: ['About Us', 'Properties', 'Sales', 'Team'],
    col2: ['Search Agent', 'Data Protection', 'Imprint', 'Contact'],
    copyright: '© MICHAELLEBER 2026. ALL RIGHTS RESERVED',
  },
}

export default function Footer() {
  const { lang } = useLanguage()
  const { email, phone } = useSiteInfo()
  const tr = t[lang]
  const pathname = usePathname()
  const isBlogDetail = pathname?.startsWith('/blog/')
  const contactTitle = isBlogDetail ? translations.blogDetail[lang].pageTitle : tr.contactTitle

  return (
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
                <h4 className="widget-title">{contactTitle}</h4>
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
                  <li><Link href="/uber-uns">{tr.col1[0]}</Link></li>
                  <li><Link href="/immobilien">{tr.col1[1]}</Link></li>
                  <li><Link href="/verkauf">{tr.col1[2]}</Link></li>
                  <li><Link href="/team">{tr.col1[3]}</Link></li>
                </ul>
              </div>
            </div>

            {/* LINKS COL 2 */}
            <div className="col-lg-3 col-md-6">
              <div className="widget widget_services foot-link-col2">
                <ul>
                  <li><Link href="/suchagent">{tr.col2[0]}</Link></li>
                  <li><Link href="/datenschutz">{tr.col2[1]}</Link></li>
                  <li><Link href="/impressum">{tr.col2[2]}</Link></li>
                  <li><Link href="/kontakt">{tr.col2[3]}</Link></li>
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

      <button className="scroltop">
        <span className="iconmoon-house relative" id="btn-vibrate"></span>
        Top
      </button>

    </footer>
  )
}

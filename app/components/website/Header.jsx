'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'

const PAGE_NAMES = {
  de: {
    '/':                        'Home',
    '/uber-uns':                'Über uns',
    '/immobilien':              'Immobilien',
    '/kontakt':                 'Kontakt',
    '/verkauf':                 'Verkauf',
    '/team':                    'Team',
    '/impressum':               'Impressum',
    '/suchagent':               'Suchagent',
    '/datenschutz':             'Datenschutz',
    '/datenschutzrichtlinie':   'Datenschutzrichtlinie',
    '/immobilienanfrage':       'Immobilienanfrage',
  },
  en: {
    '/':                        'Home',
    '/uber-uns':                'About Us',
    '/immobilien':              'Properties',
    '/kontakt':                 'Contact',
    '/verkauf':                 'Sales',
    '/team':                    'Team',
    '/impressum':               'Legal Notice',
    '/suchagent':               'Search Agent',
    '/datenschutz':             'Data Protection',
    '/datenschutzrichtlinie':   'Privacy Policy',
    '/immobilienanfrage':       'Property Inquiry',
  },
}

const PAGE_ICONS = {
  '/':                        'fa-home',
  '/uber-uns':                'fa-info-circle',
  '/immobilien':              'fa-building',
  '/kontakt':                 'fa-envelope',
  '/verkauf':                 'fa-tag',
  '/team':                    'fa-users',
  '/impressum':               'fa-file-text',
  '/suchagent':               'fa-search',
  '/datenschutz':             'fa-shield',
  '/datenschutzrichtlinie':   'fa-lock',
  '/immobilienanfrage':       'fa-pencil',
}

function getPageName(pathname, lang) {
  if (PAGE_NAMES[lang][pathname]) return PAGE_NAMES[lang][pathname]
  if (pathname.startsWith('/immobilien/')) return lang === 'de' ? 'Immobilien' : 'Properties'
  if (pathname.startsWith('/blog/')) return 'Blog Detail'
  return lang === 'de' ? 'Kontaktieren Sie uns' : 'Contact Us'
}

function getPageIcon(pathname) {
  if (PAGE_ICONS[pathname]) return PAGE_ICONS[pathname]
  if (pathname.startsWith('/immobilien/')) return 'fa-building'
  return 'fa-phone'
}

export default function Header({ className = '' }) {
  const { lang, setLang } = useLanguage()
  const pathname = usePathname()
  const pageName = getPageName(pathname, lang)
  const pageIcon = getPageIcon(pathname)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header header-style-1 mobile-sider-drawer-menu ${className}`}
      style={{ background: scrolled ? '#000' : undefined, transition: 'background 0.3s ease' }}>
      <style>{`
        .hh-dropdown { position: relative; }
        .hh-dropdown .hh-sub {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          background: #1a1212;
          min-width: 160px;
          border-radius: 6px;
          padding: 6px 0;
          z-index: 9999;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          list-style: none;
          margin: 0;
        }
        .hh-dropdown:hover .hh-sub { display: block; }
        .hh-sub li a {
          display: block;
          padding: 10px 18px;
          color: #ccc !important;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.2s;
        }
        .hh-sub li a:hover { color: #fff !important; }
      `}</style>

      <div className="container">
        <div className="row align-items-center">

          <div className="col-lg-4 col-md-4 top-col4-1">
            <div className="top-col1">
              <i className={`fa ${pageIcon}`} style={{ fontSize: '22px', marginRight: '8px' }}></i>
              <h5>{pageName}</h5>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-6 d-flex justify-content-center">
            <div className="logo-header text-center">
              <Link href="/">
                <img src="/assets/img/logo.png" alt="image" />
              </Link>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-6">
            <div className="top-lang-col">
              <h5>
                <span
                  onClick={() => setLang('de')}
                  style={{ cursor: 'pointer', fontWeight: lang === 'de' ? '900' : '400', textDecoration: 'none' }}
                >
                  DE
                </span>
                &nbsp; | &nbsp;
                <span
                  onClick={() => setLang('en')}
                  style={{ cursor: 'pointer', fontWeight: lang === 'en' ? '900' : '400', textDecoration: 'none' }}
                >
                  EN
                </span>
              </h5>
            </div>
          </div>

        </div>
      </div>

      {/* STICKY NAV */}
      <div className="sticky-header main-bar-wraper">
        <div className="main-bar">
          <div className="container">

            <div className="header-nav navbar-collapse collapse">
              <ul className="nav navbar-nav">

                <li>
                  <Link href="/immobilien">
                    {lang === 'de' ? 'immobilien' : 'properties'}
                  </Link>
                </li>

                <li>
                  <Link href="/verkauf">
                    {lang === 'de' ? 'verkauf' : 'sales'}
                  </Link>
                </li>

                <li className="hh-dropdown">
                  <a href="#">
                    {lang === 'de' ? 'unternehmen' : 'company'} <i className="fa fa-chevron-down"></i>
                  </a>
                  <ul className="hh-sub">
                    <li><Link href="/uber-uns">{lang === 'de' ? 'Über Uns' : 'About Us'}</Link></li>
                    <li><Link href="/team">{lang === 'de' ? 'Unser Team' : 'Our Team'}</Link></li>
                  </ul>
                </li>

                <li>
                  <Link href="/kontakt">
                    {lang === 'de' ? 'kontakt' : 'contact'}
                  </Link>
                </li>

              </ul>
            </div>

            {/* MOBILE TOGGLE */}
            <button
              id="mobile-side-drawer"
              data-target=".header-nav"
              data-toggle="collapse"
              type="button"
              className="navbar-toggler collapsed"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar icon-bar-first"></span>
              <span className="icon-bar icon-bar-two"></span>
              <span className="icon-bar icon-bar-three"></span>
            </button>

          </div>
        </div>
      </div>

    </header>
  )
}

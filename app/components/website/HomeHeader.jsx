'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { useSiteInfo } from '@/lib/SiteInfoContext'

const t = {
  de: {
    contact:    'Kontaktieren Sie uns',
    immobilien: 'immobilien',
    verkauf:    'verkauf',
    unternehmen:'unternehmen',
    kontakt:    'kontakt',
    aboutUs:    'Über Uns',
    ourTeam:    'Unser Team',
  },
  en: {
    contact:    'Contact Us',
    immobilien: 'properties',
    verkauf:    'sales',
    unternehmen:'company',
    kontakt:    'contact',
    aboutUs:    'About Us',
    ourTeam:    'Our Team',
  },
}

export default function HomeHeader() {
  const { lang, setLang } = useLanguage()
  const { phone } = useSiteInfo()
  const tr = t[lang]
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="video-container">
      <video autoPlay muted loop playsInline className="background-video">
        <source src="/assets/img/hero-vdo.mp4" type="video/mp4" />
      </video>

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

      <header className="site-header header-style-1 vdo-header mobile-sider-drawer-menu"
        style={{ background: scrolled ? '#000' : 'transparent', transition: 'background 0.3s ease' }}>
        <div className="container">
          <div className="row align-items-center">

            {/* PHONE */}
            <div className="col-lg-4 col-md-4 top-col4-1">
              <div className="top-col1">
                <img src="/assets/img/phone.png" alt="image" />
                <h5>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {phone}
                  </a>
                </h5>
              </div>
            </div>

            {/* LOGO */}
            <div className="col-lg-4 col-md-6 col-6 d-flex justify-content-center">
              <div className="logo-header text-center">
                <Link href="/">
                  <img src="/assets/img/logo.png" alt="image" />
                </Link>
              </div>
            </div>

            {/* LANGUAGE */}
            <div className="col-lg-4 col-md-6 col-6">
              <div className="top-lang-col">
                <h5>
                  <span onClick={() => setLang('de')} style={{ cursor: 'pointer', fontWeight: lang === 'de' ? '900' : '400' }}>DE</span>
                  &nbsp; | &nbsp;
                  <span onClick={() => setLang('en')} style={{ cursor: 'pointer', fontWeight: lang === 'en' ? '900' : '400' }}>EN</span>
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

                  {/* IMMOBILIEN → link to /immobilien */}
                  <li>
                    <Link href="/immobilien">{tr.immobilien}</Link>
                  </li>

                  {/* VERKAUF */}
                  <li>
                    <Link href="/verkauf">{tr.verkauf}</Link>
                  </li>

                  {/* UNTERNEHMEN → dropdown */}
                  <li className="hh-dropdown">
                    <a href="#">
                      {tr.unternehmen} <i className="fa fa-chevron-down"></i>
                    </a>
                    <ul className="hh-sub">
                      <li><Link href="/uber-uns">{tr.aboutUs}</Link></li>
                      <li><Link href="/team">{tr.ourTeam}</Link></li>
                    </ul>
                  </li>

                  {/* KONTAKT */}
                  <li>
                    <Link href="/kontakt">{tr.kontakt}</Link>
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
    </div>
  )
}

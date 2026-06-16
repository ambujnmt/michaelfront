'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

export default function HomeHeader() {

  const { lang, setLang } = useLanguage()

  return (
    <header className="site-header header-style-1 mobile-sider-drawer-menu head-2">

      {/* TOP BAR — phone | logo | language + hamburger */}
      <div className="container">
        <div className="row align-items-center">

          {/* PHONE */}
          <div className="col-lg-4 col-md-4 top-col4-1 p8-head-col">
            <div className="top-col1">
              <img src="/assets/img/phone.png" alt="image" />
              <h5>+43 664 547 5915</h5>
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

          {/* LANGUAGE + TOGGLE */}
          <div className="col-lg-4 col-md-6 col-6">
            <div className="top-lang-col">
              <h5>
                <span
                  onClick={() => setLang('de')}
                  style={{ cursor: 'pointer', fontWeight: lang === 'de' ? '900' : '400', textDecoration: lang === 'de' ? 'underline' : 'none' }}
                >
                  DE
                </span>
                &nbsp; | &nbsp;
                <span
                  onClick={() => setLang('en')}
                  style={{ cursor: 'pointer', fontWeight: lang === 'en' ? '900' : '400', textDecoration: lang === 'en' ? 'underline' : 'none' }}
                >
                  EN
                </span>
              </h5>
              <div className="toggle-bar">
                <a href="#"><img src="/assets/img/bars.png" alt="image" /></a>
              </div>
            </div>
          </div>

        </div>
      </div>

    </header>
  )
}

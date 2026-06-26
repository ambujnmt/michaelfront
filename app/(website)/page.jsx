'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'
import HomeHeader from '../components/website/HomeHeader'
import HomeFooter from '../components/website/HomeFooter'
import PropertyCarousel from '../components/website/PropertyCarousel'
import Newsletter from '../components/website/Newsletter'

export default function Home() {
  const { lang } = useLanguage()
  const tr = translations.home[lang] || translations.home['de']

  return (
    <div className="page-wraper">

      <HomeHeader />

      {/* ── SEC 1 — PROPERTIES ── */}
      <PropertyCarousel />

      {/* ── SEC 2 — VIDEO BANNER ── */}
      <section className="p5-sec3">
        <video autoPlay muted loop playsInline className="background-video">
          <source src="/assets/img/p5-vdo2.mp4" type="video/mp4" />
        </video>
        <div className="overlay"></div>
        <div className="content head-sec">
          <h3>{tr.sec3Text}</h3>
        </div>
      </section>

      {/* ── SEC 3 — SELL PROPERTY ── */}
      <section className="p5-sec4">
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
      </section>

      {/* ── SEC 4 — NEWSLETTER ── */}
      <Newsletter />

      <HomeFooter />

    </div>
  )
}

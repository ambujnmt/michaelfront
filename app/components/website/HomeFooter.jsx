'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'

const t = {
  de: {
    desc: 'Ich stelle die Bedürfnisse meiner Kunden in den Mittelpunkt unserer Zusammenarbeit, um allen Beteiligten einen hohen Mehrwert zu bieten.',
    newsletter: 'Informationen und Tipps',
    emailPh: 'E-Mail eingeben',
    subscribBtn: 'Abonnieren',
    linksTitle: 'Wichtige Links',
    links: ['Um', 'Eigentum', 'Verkauf', 'Team', 'Suchagent', 'Datenschutz', 'Impressum', 'Kontakt'],
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

const hrefs = ['/about', '/property', '/verkauf', '/team', '/suchagent', '/data-protection', '/impressum', '/kontakt']

export default function HomeFooter() {
  const { lang } = useLanguage()
  const tr = t[lang]

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
                <form className="newsletter-input2">
                  <input type="text" className="form-control" placeholder={tr.emailPh} />
                  <button type="button" className="btn news-btn2">{tr.subscribBtn}</button>
                </form>
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
                <h6>office@michaelleber.at</h6>
                <div className="foot-col-border"></div>
                <h6><span>+43 664 547 5915</span></h6>
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

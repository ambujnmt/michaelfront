import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="site-footer footer-dark">

      {/* FOOTER BLOCKS */}
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
                <h4 className="widget-title">Kontaktieren Sie Uns</h4>
                <ul>
                  <li>
                    <a href="mailto:office@michaelleber.at">
                      <i className="fa fa-envelope"></i> office@michaelleber.at
                    </a>
                  </li>
                  <li>
                    <a href="tel:+436645475915">
                      <img src="/assets/img/phone.png" alt="image" className="foot-phone-img" />
                      {' '}+43 664 547 5915
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
                  <li><Link href="/about">Um</Link></li>
                  <li><Link href="/property">Eigentum</Link></li>
                  <li><Link href="/verkauf">Verkauf</Link></li>
                  <li><Link href="/team">Team</Link></li>
                </ul>
              </div>
            </div>

            {/* LINKS COL 2 */}
            <div className="col-lg-3 col-md-6">
              <div className="widget widget_services foot-link-col2">
                <ul>
                  <li><Link href="/suchagent">Suchagent</Link></li>
                  <li><Link href="/data-protection">Data Protection</Link></li>
                  <li><Link href="/impressum">Impressum</Link></li>
                  <li><Link href="/kontakt">Kontakt</Link></li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER COPYRIGHT */}
        <div className="footer-bottom overlay-wraper">
          <div className="overlay-main"></div>
          <div className="container">
            <div className="row">
              <div className="col-lg-2 col-md-3 col-12"></div>
              <div className="col-lg-7 col-md-12 col-12 text-center">
                <span className="copyrights-text">
                  © MICHAELLEBER 2026. ALLE RECHTE VORBEHALTEN
                </span>
              </div>
              <div className="col-lg-3 col-md-12 col-12">
                <span className="copyrights-text copyrights-text2">
                  Website By: Digital Flavers
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SCROLL TO TOP */}
      <button className="scroltop">
        <span className="iconmoon-house relative" id="btn-vibrate"></span>
        Top
      </button>

    </footer>
  )
}

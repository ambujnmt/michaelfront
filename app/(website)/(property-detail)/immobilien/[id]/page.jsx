'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import Footer from '@/app/components/website/Footer'
import Newsletter from '@/app/components/website/Newsletter'
import websiteApi from '@/lib/websiteApi'
import { localizeProperty, localizeProperties } from '@/lib/propertyI18n'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'

import { API_URL as API } from '@/service/config'

// Quill saves "empty" content as non-empty-looking HTML (e.g. "<p></p>" or
// "<p><br></p>"), so a plain truthiness check lets an empty editor through
// and hides the default fallback text. Strip tags and check for real text.
function hasRichContent(html) {
  return !!html && html.replace(/<[^>]*>/g, '').trim().length > 0
}

function OtherPropertiesSlider({ properties }) {
  useEffect(() => {
    if (!properties.length) return
    let retryTimer = null
    const tryInit = () => {
      const jq = window.jQuery
      if (!jq || !jq.fn || !jq.fn.owlCarousel) { retryTimer = setTimeout(tryInit, 300); return }
      const $el = jq('.gallery-slider')
      if (!$el.length) return
      if ($el.hasClass('owl-loaded')) $el.trigger('destroy.owl.carousel').removeClass('owl-loaded owl-drag')
      $el.owlCarousel({
        loop: true, margin: 16, nav: false, dots: true,
        dotsClass: 'owl-dashed-dot',
        responsive: { 0: { items: 1 }, 768: { items: 2 }, 1024: { items: 2 } },
      })
    }
    const t = setTimeout(tryInit, 400)
    return () => { clearTimeout(t); clearTimeout(retryTimer) }
  }, [properties])

  return (
    <div className="owl-carousel owl-theme gallery-slider mt-5">
      {properties.map((p) => (
        <div className="item" key={p.id}>
          <Link href={`/immobilien/${p.slug}`} style={{ textDecoration: 'none' }}>
            <div className="gallery-card">
              <img src={p.image ? `${API}${p.image}` : '/assets/img/p3-slider-img1.png'} alt={p.title} />
              <div className="gallery-overlay">
                <h5>{p.title}</h5>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default function PropertyDetail() {
  const { id: slug } = useParams()
  const pathname = usePathname()
  const { lang, setLang } = useLanguage()
  const tr = translations.propertyDetail[lang]
  const pageName = lang === 'de' ? 'Immobilien' : 'Properties'
  const [rawProperty, setRawProperty] = useState(null)
  const [gallery,  setGallery]  = useState([])
  const [others,   setOthers]   = useState([])
  const [apartmentImages, setApartmentImages] = useState([])

  // The DE/EN toggle in the header switches `lang` live, so derive the
  // displayed copy from the raw row rather than re-fetching. EN falls back
  // to DE per-field when the English value is blank.
  const property = useMemo(() => localizeProperty(rawProperty, lang), [rawProperty, lang])
  const localizedOthers = useMemo(() => localizeProperties(others, lang), [others, lang])
  const [loading,  setLoading]  = useState(true)
  const [form,     setForm]     = useState({ name: '', phone: '', email: '', message: '' })
  const [sent,     setSent]     = useState(false)
  const [sending,  setSending]  = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const navLabels = {
    de: { immobilien: 'immobilien', verkauf: 'verkauf', unternehmen: 'unternehmen', kontakt: 'kontakt' },
    en: { immobilien: 'properties', verkauf: 'sales', unternehmen: 'company', kontakt: 'contact' },
  }
  const nv = navLabels[lang] || navLabels.de

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [propRes, allRes] = await Promise.all([
          websiteApi.getProperty(slug),
          websiteApi.getProperties(),
        ])
        if (propRes.success) {
          setRawProperty(propRes.data)
          try {
            const imgRes = await websiteApi.getPropertyImages(propRes.data.id)
            if (imgRes.success) setGallery(imgRes.data)
          } catch (_) {}
          if ((propRes.data.property_type || 'villa') === 'apartment') {
            try {
              const aptRes = await websiteApi.getApartmentImages(propRes.data.id)
              if (aptRes.success) setApartmentImages(aptRes.data)
            } catch (_) {}
          } else {
            setApartmentImages([])
          }
          if (allRes.success) {
            const currentType = propRes.data.property_type || 'villa'
            setOthers(allRes.data.filter(p => p.slug !== slug && (p.property_type || 'villa') === currentType))
          } else {
            setOthers([])
          }
        }
      } catch (e) {
        console.error('Property load error:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  // Route change hote hi mobile menu hamesha band ho jaye
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (loading || !property) return
    let retryTimer = null
    const tryInit = () => {
      const jq = window.jQuery
      if (!jq || !jq.fn || !jq.fn.owlCarousel) { retryTimer = setTimeout(tryInit, 300); return }
      const $el = jq('.hero-detail-slider')
      if (!$el.length) { retryTimer = setTimeout(tryInit, 300); return }
      if ($el.hasClass('owl-loaded')) $el.trigger('destroy.owl.carousel').removeClass('owl-loaded owl-drag')
      const slides = [heroImg, ...gallery.map(g => `${API}${g.image}`)]
      $el.owlCarousel({
        loop: slides.length > 1,
        items: 1,
        nav: true,
        navText: ['<i class="fa fa-chevron-left" style="color:#fff"></i>', '<i class="fa fa-chevron-right" style="color:#fff"></i>'],
        dots: false,
        autoplay: slides.length > 1,
        autoplayTimeout: 4000,
        autoplaySpeed: 800,
        autoplayHoverPause: true,
        mouseDrag: true,
        touchDrag: true,
      })
    }
    const heroTimer = setTimeout(tryInit, 500)
    return () => { clearTimeout(heroTimer); clearTimeout(retryTimer) }
  }, [loading, property, gallery])

  useEffect(() => {
    if (loading || !property) return
    const floorTimer = setTimeout(() => {
      const jq = window.jQuery
      if (!jq || !jq.fn || !jq.fn.owlCarousel) return
      const $el = jq('.floor-plan-slider')
      if (!$el.length) return
      if ($el.hasClass('owl-loaded')) $el.trigger('destroy.owl.carousel').removeClass('owl-loaded owl-drag')
      // apartmentImages is only populated for apartment listings
      const slideCount = apartmentImages.length > 0 ? apartmentImages.length : gallery.length
      $el.owlCarousel({
        loop: slideCount > 1,
        margin: 16,
        nav: true,
        dots: false,
        autoplay: false,
        mouseDrag: true,
        touchDrag: true,
        responsive: {
          0:   { items: 1 },
          768: { items: slideCount >= 2 ? 2 : 1 },
          1200:{ items: slideCount >= 3 ? 3 : slideCount },
        },
      })
    }, 500)
    return () => clearTimeout(floorTimer)
  }, [loading, property, gallery, apartmentImages])

  useEffect(() => {
    if (loading || !property) return
    const timer = setTimeout(() => {
      const jq = window.jQuery
      if (!jq) return
      if (jq.fn && jq.fn.isotope) {
        const $grid = jq('.portfolio-wrap')
        if ($grid.length) {
          $grid.isotope({ itemSelector: '.masonry-item', transitionDuration: '1s', originLeft: true })
          if (jq.fn.imagesLoaded) $grid.imagesLoaded().progress(() => $grid.isotope('layout'))
          jq('.masonry-filter li').off('click.iso').on('click.iso', function () {
            const selector = jq(this).find('a').attr('data-filter')
            if (selector === '*') return false
            jq('.masonry-filter li').removeClass('active')
            jq(this).addClass('active')
            $grid.isotope({ filter: selector })
            return false
          })
        }
      }
      if (jq.fn && jq.fn.scrolla) jq('.animate').scrolla({ mobile: false, once: true })
      if (jq.fn && jq.fn.magnificPopup) {
        jq('.mfp-gallery').magnificPopup({
          delegate: '.mfp-link', type: 'image',
          gallery: { enabled: true, navigateByImgClick: true, preload: [0, 1] },
        })
      }
      jq('.sub-menu, .mega-menu').parent('li').addClass('has-child')
      if (!jq('.has-child > .submenu-toogle').length) {
        jq("<div class='fa fa-angle-right submenu-toogle'></div>").insertAfter('.has-child > a')
      }
      jq('.has-child a+.submenu-toogle').off('click.nav').on('click.nav', function (ev) {
        jq(this).parent().siblings('.has-child').children('.sub-menu, .mega-menu').slideUp(500, function () {
          jq(this).parent().removeClass('nav-active')
        })
        jq(this).next(jq('.sub-menu, .mega-menu')).slideToggle(500, function () {
          jq(this).parent().toggleClass('nav-active')
        })
        ev.stopPropagation()
      })
      jq('button.scroltop').off('click.top').on('click.top', function () {
        jq('html, body').animate({ scrollTop: 0 }, 1000)
        return false
      })
      jq(window).off('scroll.scroltop').on('scroll.scroltop', function () {
        jq(window).scrollTop() > 900
          ? jq('button.scroltop').fadeIn(1000)
          : jq('button.scroltop').fadeOut(1000)
      })
      jq(window).off('scroll.colorFill').on('scroll.colorFill', function () {
        jq(window).scrollTop() >= 100
          ? jq('.is-fixed').addClass('color-fill')
          : jq('.is-fixed').removeClass('color-fill')
      })
    }, 400)
    return () => clearTimeout(timer)
  }, [loading, property])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await websiteApi.submitInquiry({ ...form, property_id: property?.id, propertyTitle: property?.title })
    } catch (_) {}
    setSent(true)
    setSending(false)
    setForm({ name: '', phone: '', email: '', message: '' })
  }

  const heroImg = property?.image ? `${API}${property.image}` : '/assets/img/p3-hero-img.png'

  // ── Property type helpers (mirrors PropertyCard logic on the listing pages) ──
  const propType    = property?.property_type || 'villa'
  const isLand      = propType === 'various'
  const isHouse     = propType === 'villa'
  const isApartment = propType === 'apartment'

  // For apartments, the FLOOR PLAN slider shows the apartment images;
  // everything else keeps using the regular gallery.
  const floorPlanImages = isApartment && apartmentImages.length > 0 ? apartmentImages : gallery

  return (
    <div className="page-wraper">

      <div id="rev_slider_149_1_wrapper" className="rev_slider_wrapper fullscreen-container"
        style={{ backgroundColor: '#2d3032', padding: 0, position: 'relative' }}>

        <header className="site-header header-style-1 mobile-sider-drawer-menu head-2">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-4 col-md-4 top-col4-1">
                <Link href="/immobilien">
                <div className="top-col1">
                  <i className="fa fa-arrow-left" style={{ fontSize: '22px', marginRight: '8px' }}></i>
                  <h5>{pageName}</h5>
                </div>
                </Link>
              </div>
              <div className="col-lg-4 col-md-6 col-6 d-flex justify-content-center">
                <div className="logo-header text-center">
                  <Link href="/"><img src="/assets/img/new-logo.svg" alt="image" /></Link>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-6">
                <div className="top-lang-col">
                  <h5>
                    <span onClick={() => setLang('de')} style={{ cursor: 'pointer', fontWeight: lang === 'de' ? '900' : '400', textDecoration: lang === 'de' ? 'underline' : 'none' }}>DE</span>
                    &nbsp; | &nbsp;
                    <span onClick={() => setLang('en')} style={{ cursor: 'pointer', fontWeight: lang === 'en' ? '900' : '400', textDecoration: lang === 'en' ? 'underline' : 'none' }}>EN</span>
                  </h5>
                </div>
              </div>
            </div>
          </div>

          {/* STICKY NAV + MOBILE TOGGLE */}
          <div className="sticky-header main-bar-wraper">
            <div className="main-bar">
              <div className="container">
                <div
                  className="header-nav navbar-collapse"
                  style={{ display: menuOpen ? 'block' : undefined }}
                >
                  <ul className="nav navbar-nav">
                    <li onClick={() => setMenuOpen(false)}>
                      <Link href="/immobilien">{nv.immobilien}</Link>
                    </li>
                    <li onClick={() => setMenuOpen(false)}>
                      <Link href="/verkauf">{nv.verkauf}</Link>
                    </li>
                    <li className="hh-dropdown" onClick={() => setMenuOpen(false)}>
                      <Link href="/unternehmen">{nv.unternehmen}</Link>
                    </li>
                    <li onClick={() => setMenuOpen(false)}>
                      <Link href="/kontakt">{nv.kontakt}</Link>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  className={`navbar-toggler ${menuOpen ? '' : 'collapsed'}`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setMenuOpen((prev) => !prev)
                  }}
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

          @media (max-width: 991px) {
            .header-nav.navbar-collapse { display: none; }
            .header-nav.navbar-collapse.show { display: block; }
          }

          .hero-slider-wrap { width: 100%; height: 100vh; position: relative; overflow: hidden; background: #2d3032; }
          .hero-slider-wrap .owl-carousel,
          .hero-slider-wrap .owl-stage-outer,
          .hero-slider-wrap .owl-stage,
          .hero-slider-wrap .owl-item,
          .hero-slider-wrap .item { height: 100vh; }
          .hero-slider-wrap .item img { width: 100%; height: 100vh; object-fit: cover; display: block; }
          .hero-slider-wrap .owl-dots { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 10; }
          .hero-slider-wrap .owl-dot span { background: rgba(255,255,255,0.5) !important; }
          .hero-slider-wrap .owl-dot.active span { background: #fff !important; }
          .hero-slider-wrap .owl-nav,
          .hero-slider-wrap .owl-nav.disabled { position: absolute; top: 50%; transform: translateY(-50%); width: 100%; display: flex !important; justify-content: space-between; padding: 0 24px; box-sizing: border-box; z-index: 20; pointer-events: none; }
          .hero-slider-wrap .owl-nav button { pointer-events: all; background: rgba(255,255,255,0.15) !important; color: #fff !important; width: 50px; height: 50px; border-radius: 50% !important; font-size: 18px !important; border: 2px solid rgba(255,255,255,0.5) !important; display: flex !important; align-items: center !important; justify-content: center !important; transition: all 0.2s !important; backdrop-filter: blur(4px); }
          .hero-slider-wrap .owl-nav button:hover { background: rgba(255,255,255,0.4) !important; border-color: #fff !important; }
          .hero-slider-wrap .owl-nav button i { color: #fff !important; }
          .hero-back-btn { position: absolute; top: 100px; left: 24px; z-index: 20; display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; background: rgba(0,0,0,0.4); color: #fff; border: 1px solid rgba(255,255,255,0.6); border-radius: 30px; font-size: 14px; text-decoration: none; backdrop-filter: blur(4px); transition: background 0.2s; }
          .hero-back-btn:hover { background: rgba(0,0,0,0.65); color: #fff; }

          /* ===== RESPONSIVE — TABLET (max-width: 991px) ===== */
          @media (max-width: 991px) {
            .hero-slider-wrap,
            .hero-slider-wrap .owl-carousel,
            .hero-slider-wrap .owl-stage-outer,
            .hero-slider-wrap .owl-stage,
            .hero-slider-wrap .owl-item,
            .hero-slider-wrap .item,
            .hero-slider-wrap .item img {
              height: 70vh;
            }
            .hero-slider-wrap .owl-nav button {
              width: 40px;
              height: 40px;
              font-size: 15px !important;
            }
            .p3-col-sec-box1 {
              margin-bottom: 16px;
            }
          }

          /* ===== RESPONSIVE — MOBILE (max-width: 767px) ===== */
          @media (max-width: 767px) {
            .hero-slider-wrap,
            .hero-slider-wrap .owl-carousel,
            .hero-slider-wrap .owl-stage-outer,
            .hero-slider-wrap .owl-stage,
            .hero-slider-wrap .owl-item,
            .hero-slider-wrap .item,
            .hero-slider-wrap .item img {
              height: 55vh;
            }
            .hero-slider-wrap .owl-nav {
              padding: 0 12px;
            }
            .hero-slider-wrap .owl-nav button {
              width: 34px;
              height: 34px;
              font-size: 13px !important;
            }
            .hero-back-btn {
              top: 80px;
              left: 12px;
              padding: 8px 14px;
              font-size: 12px;
            }

            .p3-col-sec-box1 {
              margin-bottom: 14px;
              padding: 12px 8px;
            }
            .p3-col-sec-box1 h5 {
              font-size: 13px;
            }
            .p3-col-sec-box1 p {
              font-size: 14px;
            }

            .p3-sec2 .head-sec-page h1,
            .p3-sec5 .head-sec-page h1,
            .p3-sec7 .head-sec-page h1 {
              font-size: 26px;
              line-height: 1.3;
            }

            .p3-sec3 .head-sec h3,
            .p3-sec4 .head-sec h3,
            .p3-sec6 h1 {
              font-size: 22px;
            }

            .objekt-section .detail-row {
              flex-direction: column;
              align-items: flex-start;
              gap: 4px;
              padding: 10px 0;
            }
            .objekt-section .col-md-6.ps-md-5 {
              padding-left: 0 !important;
              margin-top: 16px;
            }

            .p3-sec7 .form-sec1 {
              padding: 0 8px;
            }
            .p3-sec7 .form-group {
              margin-bottom: 14px;
            }

            .gallery-card img {
              height: auto;
            }

            .scroltop {
              width: 44px;
              height: 44px;
              font-size: 12px;
            }
          }

          /* ===== RESPONSIVE — SMALL MOBILE (max-width: 480px) ===== */
          @media (max-width: 480px) {
            .hero-slider-wrap,
            .hero-slider-wrap .owl-carousel,
            .hero-slider-wrap .owl-stage-outer,
            .hero-slider-wrap .owl-stage,
            .hero-slider-wrap .owl-item,
            .hero-slider-wrap .item,
            .hero-slider-wrap .item img {
              height: 48vh;
            }
            .p3-sec2 .head-sec-page h1,
            .p3-sec5 .head-sec-page h1,
            .p3-sec7 .head-sec-page h1 {
              font-size: 22px;
            }
          }
        `}</style>
        <div className="hero-slider-wrap">
          {property && (
            <div className="owl-carousel owl-theme hero-detail-slider">
              {[heroImg, ...gallery.map(g => `${API}${g.image}`)].map((src, i) => (
                <div className="item" key={i}>
                  <img src={src} alt={property.title} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!loading && !property && (
        <section className="section-padding text-center">
          <div className="container">
            <h3 style={{ marginBottom: '24px' }}>{tr.notFoundTitle}</h3>
            <Link href="/immobilien"><button className="btn btn1">{tr.backBtn}</button></Link>
          </div>
        </section>
      )}

      {!loading && property && (<>

        {/* ── Top stats row — field set depends on property type ── */}
        <section className="p3-col-sec">
          <div className="container-fluid p-0">
            <div className="row">

              <div className="col-lg-2 col-md-3 col-6">
                <div className="p3-col-sec-box1 text-center">
                  <h5>{tr.location}</h5>
                  <p>{property.location}</p>
                </div>
              </div>

              {/* Plot Size — shown for Land/Plot and House */}
              {(isLand || isHouse) && (
                <div className="col-lg-2 col-md-3 col-6">
                  <div className="p3-col-sec-box1 text-center">
                    <h5>{tr.plotArea || (lang === 'de' ? 'GRUNDSTÜCK' : 'PLOT')}</h5>
                    <p>{property.plot_size ?? property.size} M²</p>
                  </div>
                </div>
              )}

              {/* Living Area — everyone except Land/Plot */}
              {!isLand && (
                <div className="col-lg-2 col-md-3 col-6">
                  <div className="p3-col-sec-box1 text-center">
                    <h5>{tr.livingArea || (lang === 'de' ? 'WOHNFLÄCHE' : 'LIVING AREA')}</h5>
                    <p>{property.size} M²</p>
                  </div>
                </div>
              )}

              {/* Rooms — everyone except Land/Plot */}
              {!isLand && (
                <div className="col-lg-2 col-md-3 col-6">
                  <div className="p3-col-sec-box1 text-center">
                    <h5>{tr.rooms}</h5>
                    <p>{property.rooms}</p>
                  </div>
                </div>
              )}

              {/* Floor / Etage — apartments only */}
              {isApartment && property.floor && (
                <div className="col-lg-2 col-md-3 col-6">
                  <div className="p3-col-sec-box1 text-center">
                    <h5>{tr.floor}</h5>
                    <p>{property.floor}</p>
                  </div>
                </div>
              )}

              {/* Open/Outdoor Area — everyone except Land/Plot */}
              {!isLand && (
                <div className="col-lg-2 col-md-3 col-6">
                  <div className="p3-col-sec-box1 text-center">
                    <h5>{tr.openAreas || (lang === 'de' ? 'FREIFLÄCHEN' : 'OPEN AREAS')}</h5>
                    <p>{property.outdoor_area ?? property.open_area ?? property.terrace_area ?? '-'}</p>
                  </div>
                </div>
              )}

              <div className="col-lg-2 col-md-3 col-6">
                <div className="p3-col-sec-box1 text-center">
                  <h5>{tr.purchasePrice}</h5>
                  <p>€ {Number(property.price).toLocaleString('de-DE')} –</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="p3-sec2 pro-dtl-sec2">
          <div className="container">
            <div className="row">
              <div className="col-lg-11 col-md-12 mx-auto">
                <div className="head-sec-page text-center"><h1>{property.title}</h1></div>
              </div>
              {property.description && (
                <div className="col-lg-10 col-md-12 mx-auto">
                  <div className="text-center pera2">
                    <div
                      dangerouslySetInnerHTML={{ __html: property.description }}
                    />
                    <div className="mt-5"></div>
                    <a href="#anfragen">
                      <button type="button" className="btn btn1">
                        {tr.exposeBtn}
                      </button>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Rich text pasted from the admin editor can contain lists, headings,
            tables, images and very long unbroken strings. Keep every one of
            them inside the column so nothing is clipped or pushed off-screen
            on mobile, and left-align the body copy so lists stay readable. */}
        <style>{`
          .rich-content {
            text-align: left;
            max-width: 100%;
            overflow-wrap: break-word;
            word-break: break-word;
            font-family: var(--head-font);
            font-size: 18px;
            line-height: 1.75;
            color: #828282;
          }
          .rich-content > *:first-child { margin-top: 0; }
          .rich-content * { max-width: 100%; }
          .rich-content p { margin: 0 0 15px; color: #828282; }
          .rich-content h1, .rich-content h2, .rich-content h3,
          .rich-content h4, .rich-content h5, .rich-content h6 {
            color: #3d474a; line-height: 1.3; margin: 26px 0 12px;
          }
          .rich-content ul, .rich-content ol {
            text-align: left; padding-left: 1.4em; margin: 0 0 15px;
          }
          .rich-content li { margin-bottom: 8px; color: #828282; }
          .rich-content a { color: #8a6b3f; word-break: break-all; }
          .rich-content img { height: auto; border-radius: 6px; }
          .rich-content blockquote {
            border-left: 3px solid #8a6b3f; margin: 0 0 15px;
            padding-left: 14px; color: #666;
          }
          .rich-content pre {
            white-space: pre-wrap; word-break: break-word;
            background: #e7e6e6; padding: 12px; border-radius: 6px; overflow-x: auto;
          }
          .rich-content table {
            display: block; width: 100%; overflow-x: auto;
            border-collapse: collapse;
          }
          .rich-content td, .rich-content th {
            border: 1px solid #d9d8d8; padding: 8px 10px;
          }
          /* honour alignment picked in the admin editor */
          .rich-content .ql-align-center { text-align: center; }
          .rich-content .ql-align-right { text-align: right; }
          .rich-content .ql-align-justify { text-align: justify; }
          .rich-content .ql-indent-1 { padding-left: 3em; }
          .rich-content .ql-indent-2 { padding-left: 6em; }
          .rich-content .ql-indent-3 { padding-left: 9em; }
          @media (max-width: 767px) {
            .rich-content { font-size: 15px; line-height: 1.7; }
          }
        `}</style>

        <section className="p3-sec3">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="head-sec text-center pera2">
                  <h3>{tr.lageTitle}</h3>
                  {hasRichContent(property.location_details) ? (
                    <div className="rich-content" dangerouslySetInnerHTML={{ __html: property.location_details }} />
                  ) : (
                    <><p>{tr.lage1}</p><p>{tr.lage2}</p><p>{tr.lage3}</p><p>{tr.lage4}</p></>
                  )}
                </div>
                <div className="head-sec text-center pera2 mt-5">
                  <h3>{tr.ausstattungTitle}</h3>
                  {hasRichContent(property.features) ? (
                    <div className="rich-content" dangerouslySetInnerHTML={{ __html: property.features }} />
                  ) : (
                    <><p>{tr.aus1}</p><p>{tr.aus2}</p><p>{tr.aus3}</p><p>{tr.aus4}</p><p>{tr.aus5}</p></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p3-sec4">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="head-sec text-center pera2">
                  <h3>{tr.infoTitle}</h3>
                  {hasRichContent(property.information) ? (
                    <div className="rich-content" dangerouslySetInnerHTML={{ __html: property.information }} />
                  ) : (
                    <><p>{tr.info1}</p><p>{tr.info2}</p></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FLOOR PLAN — apartments only */}
        {isApartment && (
        <section className="p3-sec5">
          <div className="section-full">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 col-md-12 head-sec-page text-center"><h3>{tr.floorPlanTitle}</h3></div>
              </div>
              <div className="owl-carousel owl-theme floor-plan-slider mt-4">
                {floorPlanImages.length > 0 ? floorPlanImages.map((img) => (
                  <div className="item" key={img.id}>
                    <div className="wt-box">
                      <div
                        className="wt-thum-bx"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center'
                        }}
                      >
                        <img
                          src={`${API}${img.image}`}
                          alt={property.title}
                          style={{ borderRadius: '6px', margin: '0 auto', maxWidth: '100%' }}
                        />
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="item">
                    <div className="wt-box">
                      <div
                        className="wt-thum-bx"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center'
                        }}
                      >
                        <img
                          src={heroImg}
                          alt={property.title}
                          style={{ borderRadius: '6px', margin: '0 auto', maxWidth: '100%' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        )}

        {/* ── Objektdetails — field set depends on property type ── */}
        <section className="p3-sec6" style={{ backgroundColor: '#f7f7f7' }}>
          <div className="container">
            <div className="objekt-section">
              <div className="head-sec"><h3 className='text-center'>{tr.detailsTitle}</h3></div>
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="detail-row">
                    <span className="detail-label">{tr.locationLabel}</span>
                    <span className="detail-value">{property.location}</span>
                  </div>

                  {/* Plot Size — Land/Plot and House */}
                  {(isLand || isHouse) && (
                    <div className="detail-row">
                      <span className="detail-label">{tr.plotAreaLabel || (lang === 'de' ? 'Grundstück' : 'Plot')}</span>
                      <span className="detail-value">{property.plot_size ?? property.size} m²</span>
                    </div>
                  )}

                  {!isLand && (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">{tr.areaLabel}</span>
                        <span className="detail-value">{property.size} m²</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">{tr.roomsLabel}</span>
                        <span className="detail-value">{property.rooms}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">{tr.openAreasLabel || (lang === 'de' ? 'Freiflächen' : 'Open areas')}</span>
                        <span className="detail-value">{property.outdoor_area ?? property.open_area ?? property.terrace_area ?? '-'}</span>
                      </div>
                    </>
                  )}

                  {/* Floor / Etage — apartments only */}
                  {isApartment && property.floor && (
                    <div className="detail-row">
                      <span className="detail-label">{tr.floorLabel}</span>
                      <span className="detail-value">{property.floor}</span>
                    </div>
                  )}

                  <div className="detail-row">
                    <span className="detail-label">{tr.priceLabel}</span>
                    <span className="detail-value">€ {Number(property.price).toLocaleString('de-DE')} –</span>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  {!isLand && (
                    <>
                      <div className="detail-row">
                        <span className="detail-label">{tr.bedroomsLabel}</span>
                        <span className="detail-value">{property.bedrooms}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">{tr.bathroomsLabel}</span>
                        <span className="detail-value">{property.bathrooms}</span>
                      </div>
                    </>
                  )}

                  {property.commission && (
                    <div className="detail-row">
                      <span className="detail-label">{tr.commissionLabel}</span>
                      <span className="detail-value">{property.commission}</span>
                    </div>
                  )}

                  {property.extras && (
                    <div className="detail-row">
                      <span className="detail-label">{tr.extrasLabel}</span>
                      <span className="detail-value">{property.extras}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p3-sec7" id="anfragen">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-9 col-12 mx-auto">
                <div className="head-sec-page text-center"><h3>{tr.formTitle}</h3></div>
                <div className="form-sec1">
                  {sent ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                      <i className="fa fa-check-circle" style={{ fontSize: '48px', color: '#2e7d32', display: 'block', marginBottom: '16px' }} />
                      <h4 style={{ color: '#2e7d32' }}>{tr.successMsg}</h4>
                      <p style={{ color: '#666' }}>{tr.successSub}</p>
                      <button className="btn btn1 mt-3" onClick={() => setSent(false)}>{tr.newInquiry}</button>
                    </div>
                  ) : (
                    <form className="home-1-form" onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-lg-6 col-md-6"><div className="form-group"><input type="text" className="form-control" placeholder={tr.namePh} required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div></div>
                        <div className="col-lg-6 col-md-6"><div className="form-group"><input type="tel" className="form-control" placeholder={tr.phonePh} value={form.phone} onChange={e => {
                          const cleaned = e.target.value.replace(/[^\d+\s()-]/g, '')
                          let digits = 0
                          let limited = ''
                          for (const ch of cleaned) {
                            if (/\d/.test(ch)) {
                              if (digits >= 15) continue
                              digits++
                            }
                            limited += ch
                          }
                          setForm({ ...form, phone: limited })
                        }} /></div></div>
                        <div className="col-lg-12 col-md-12"><div className="form-group"><input type="email" className="form-control" placeholder={tr.emailPh} required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div></div>
                        <div className="col-lg-12 col-md-12"><div className="form-group"><textarea rows="4" className="form-control" placeholder={tr.messagePh} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></div></div>
                        <div className="col-lg-12 col-md-12"><div className="form-txt pera2"><p>{tr.privacyText}</p></div></div>
                        <div className="col-lg-12 col-md-12 text-center sub-btn1">
                          <button type="submit" className="btn btn1" disabled={sending}>{sending ? tr.sendingBtn : tr.submitBtn}</button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {others.length > 0 && (
          <section className="p3-sec8">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 col-md-12"><div className="head-sec text-center"><h3>{tr.otherProps}</h3></div></div>
                <OtherPropertiesSlider properties={localizedOthers} />
              </div>
            </div>
          </section>
        )}

        <Newsletter />

      </>)}

      <Footer />
      <button className="scroltop"><span className="iconmoon-house relative" id="btn-vibrate"></span>Top</button>

    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Footer from '@/app/components/website/Footer'
import Newsletter from '@/app/components/website/Newsletter'
import websiteApi from '@/lib/websiteApi'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

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
  const { lang, setLang } = useLanguage()
  const tr = translations.propertyDetail[lang]
  const pageName = lang === 'de' ? 'Immobilien' : 'Properties'
  const [property, setProperty] = useState(null)
  const [gallery,  setGallery]  = useState([])
  const [others,   setOthers]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [form,     setForm]     = useState({ name: '', phone: '', email: '', message: '' })
  const [sent,     setSent]     = useState(false)
  const [sending,  setSending]  = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [propRes, allRes] = await Promise.all([
          websiteApi.getProperty(slug),
          websiteApi.getProperties(),
        ])
        if (propRes.success) {
          setProperty(propRes.data)
          try {
            const imgRes = await websiteApi.getPropertyImages(propRes.data.id)
            if (imgRes.success) setGallery(imgRes.data)
          } catch (_) {}
          setOthers(allRes.success ? allRes.data.filter(p => p.slug !== slug) : [])
        }
      } catch (e) {
        console.error('Property load error:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

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
      jq('#mobile-side-drawer').off('click.drawer').on('click.drawer', function () {
        jq('.mobile-sider-drawer-menu').toggleClass('active')
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

  return (
    <div className="page-wraper">

      <div id="rev_slider_149_1_wrapper" className="rev_slider_wrapper fullscreen-container"
        style={{ backgroundColor: '#2d3032', padding: 0, position: 'relative' }}>

        <header className="site-header header-style-1 mobile-sider-drawer-menu head-2">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-4 col-md-4 top-col4-1">
                <div className="top-col1">
                  <i className="fa fa-building" style={{ fontSize: '22px', marginRight: '8px' }}></i>
                  <h5>{pageName}</h5>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-6 d-flex justify-content-center">
                <div className="logo-header text-center">
                  <Link href="/"><img src="/assets/img/logo.png" alt="image" /></Link>
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
        </header>

        <style>{`
          @keyframes kenBurns { from { transform: scale(1.3); } to { transform: scale(1.0); } }
          @keyframes timerBar { from { width: 0%; } to { width: 100%; } }
          .hero-kenburns { width: 100%; height: 100%; object-fit: cover; display: block; animation: kenBurns 20s linear forwards; transform-origin: center center; }
          .tp-bannertimer { position: absolute; bottom: 0; left: 0; height: 10px; background: rgba(255,255,255,0.25); z-index: 10; animation: timerBar 20s linear forwards; }
        `}</style>
        <div style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden', background: '#2d3032' }}>
          {property && (
            <>
              <img key={heroImg} src={heroImg} alt={property.title} className="hero-kenburns" />
              <div className="tp-bannertimer" />
            </>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
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

        <section className="p3-col-sec">
          <div className="container-fluid p-0">
            <div className="row">
              <div className="col-lg-2 col-md-3 col-12"><div className="p3-col-sec-box1 text-center"><h5>{tr.bedrooms}</h5><p>{property.bedrooms}</p></div></div>
              <div className="col-lg-2 col-md-3 col-12"><div className="p3-col-sec-box1 text-center"><h5>{tr.bathrooms}</h5><p>{property.bathrooms}</p></div></div>
              <div className="col-lg-2 col-md-3 col-12"><div className="p3-col-sec-box1 text-center"><h5>{tr.rooms}</h5><p>{property.rooms}</p></div></div>
              <div className="col-lg-2 col-md-3 col-12"><div className="p3-col-sec-box1 text-center"><h5>{tr.location}</h5><p>{property.location}</p></div></div>
              <div className="col-lg-2 col-md-3 col-12"><div className="p3-col-sec-box1 text-center"><h5>{tr.terraceArea}</h5><p>{property.size} M²</p></div></div>
              <div className="col-lg-2 col-md-3 col-12"><div className="p3-col-sec-box1 text-center"><h5>{tr.purchasePrice}</h5><p>€ {Number(property.price).toLocaleString()}</p></div></div>
            </div>
          </div>
        </section>

        <section className="p3-sec2 mt-5">
          <div className="container">
            <div className="row">
              <div className="col-lg-11 col-md-12 mx-auto">
                <div className="head-sec text-center"><h1>{property.title}</h1></div>
              </div>
              {property.description && (
                <div className="col-lg-10 col-md-12 mx-auto">
                  <div className="text-center pera2">
                    {property.description.split('\n').filter(Boolean).map((para, i) => <p key={i}>{para}</p>)}
                    <div className="mt-5"></div>
                    <a href="#anfragen"><button type="button" className="btn btn1">{tr.exposeBtn}</button></a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="p3-sec3">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="head-sec text-center pera2">
                  <h3>{tr.lageTitle}</h3>
                  <p>{tr.lage1}</p><p>{tr.lage2}</p><p>{tr.lage3}</p><p>{tr.lage4}</p>
                </div>
                <div className="head-sec text-center pera2 mt-5">
                  <h3>{tr.ausstattungTitle}</h3>
                  <p>{tr.aus1}</p><p>{tr.aus2}</p><p>{tr.aus3}</p><p>{tr.aus4}</p><p>{tr.aus5}</p>
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
                  <p>{tr.info1}</p><p>{tr.info2}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p3-sec5">
          <div className="section-full">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 col-md-12 head-sec text-center"><h3>{tr.floorPlanTitle}</h3></div>
              </div>
              {gallery.length > 0 && (
                <div className="filter-wrap p-a15 our-gallery m-tb30">
                  <ul className="masonry-filter link-style text-uppercase center-block m-t0">
                    <li className="active"><a data-filter=".cat-filter-1" href="#" onClick={e => e.preventDefault()}>{tr.floor1}</a></li>
                    <li><a data-filter=".cat-filter-2" href="#" onClick={e => e.preventDefault()}>{tr.floor2}</a></li>
                  </ul>
                </div>
              )}
            </div>
            <div className="portfolio-wrap mfp-gallery no-col-gap clearfix">
              <div className="container-fluid">
                <div className="row">
                  {gallery.length > 0 ? gallery.map((img, i) => (
                    <div key={img.id} className={`masonry-item ${i % 2 === 0 ? 'cat-filter-1' : 'cat-filter-2'} col-xl-8 col-lg-8 col-md-8 col-12 mx-auto`}>
                      <div className="wt-box"><div className="wt-thum-bx"><img src={`${API}${img.image}`} alt="gallery" /></div></div>
                    </div>
                  )) : (
                    <div className="masonry-item cat-filter-1 col-xl-8 col-lg-8 col-md-8 col-12 mx-auto">
                      <div className="wt-box"><div className="wt-thum-bx"><img src={heroImg} alt={property.title} /></div></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p3-sec6">
          <div className="container">
            <div className="objekt-section">
              <div className="head-sec"><h3>{tr.detailsTitle}</h3></div>
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="detail-row"><span className="detail-label">{tr.locationLabel}</span><span className="detail-value">{property.location}</span></div>
                  <div className="detail-row"><span className="detail-label">{tr.roomsLabel}</span><span className="detail-value">{property.rooms}</span></div>
                  <div className="detail-row"><span className="detail-label">{tr.bedroomsLabel}</span><span className="detail-value">{property.bedrooms}</span></div>
                  <div className="detail-row"><span className="detail-label">{tr.areaLabel}</span><span className="detail-value">{property.size} m²</span></div>
                  <div className="detail-row"><span className="detail-label">{tr.statusLabel}</span><span className="detail-value">{property.status}</span></div>
                </div>
                <div className="col-12 col-md-6 ps-md-5">
                  <div className="detail-row"><span className="detail-label">{tr.bathroomsLabel}</span><span className="detail-value">{property.bathrooms}</span></div>
                  <div className="detail-row"><span className="detail-label">{tr.priceLabel}</span><span className="detail-value">€ {Number(property.price).toLocaleString()}</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p3-sec7" id="anfragen">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-9 col-12 mx-auto">
                <div className="head-sec text-center"><h3>{tr.formTitle}</h3></div>
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
                        <div className="col-lg-6 col-md-6"><div className="form-group"><input type="tel" className="form-control" placeholder={tr.phonePh} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div></div>
                        <div className="col-lg-12 col-md-12"><div className="form-group"><input type="email" className="form-control" placeholder={tr.emailPh} required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div></div>
                        <div className="col-lg-12 col-md-12"><div className="form-group"><textarea rows="4" className="form-control" placeholder={tr.messagePh} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></div></div>
                        <div className="col-lg-12 col-md-12"><div className="form-txt pera2"><p>{tr.privacyText}</p></div></div>
                        <div className="col-lg-12 col-md-12 text-center mt-5">
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
                <OtherPropertiesSlider properties={others} />
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

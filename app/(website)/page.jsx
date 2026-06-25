'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'
import websiteApi from '@/lib/websiteApi'

import Link from 'next/link'
import HomeHeader from '../components/website/HomeHeader'
import HeroSlider from '../components/website/HeroSlider'
import PropertyCarousel from '../components/website/PropertyCarousel'
import TestimonialSection from '../components/website/TestimonialSection'
import HomeFooter from '../components/website/HomeFooter'

import { BASE_URL } from '@/service/config'

export default function Home() {
  const { lang } = useLanguage()
  const tr = translations.home[lang]
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    websiteApi.getBlogs()
      .then(d => { if (d.success) setBlogs(d.data) })
      .catch(() => {})
  }, [])

  return (
    <div className="page-wraper">

      <HomeHeader />

      {/* HERO — Revolution Slider */}
      <HeroSlider />

      {/* SEC 1 — Wer wir sind */}
      <section className="p8-sec1">
        <div className="container">
          <div className="row">
            <div className="col-lg-11 col-md-11 mx-auto">
              <div className="head-sec text-center">
                <h6>{tr.sec1Sub}</h6>
                <h1>{tr.sec1Title}</h1>
                <p>{tr.sec1Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEC 2 — Properties Carousel */}
      <PropertyCarousel />

      {/* SEC 3 — Video Banner */}
      <section className="p5-sec3 p7-sec4 p8-sec3">
        <video autoPlay muted loop playsInline className="background-video">
          <source src="/assets/img/p5-vdo2.mp4" type="video/mp4" />
        </video>
        <div className="overlay"></div>
        <div className="content head-sec">
          <h3>{tr.sec3Text}</h3>
        </div>
      </section>

      {/* SEC 4 — Traumimmobilie */}
      <section className="p7-sec5 p8-sec4">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-8">
              <div className="head-sec">
                <h3>{tr.sec4Heading}</h3>
                <div className="mt-5"></div>
                <div className="villa-dtl-col2">
                  <Link href="/immobilienanfrage">
                    <button type="button" className="btn btn1">{tr.sec4Btn}</button>
                  </Link>
                </div>
              </div>
              <div className="row margin-row">
                <div className="col-lg-6 col-md-6">
                  <div className="p8-sec4-col-img1">
                    <img src="/assets/img/p8-side-img2.png" alt="Immobilie" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="p8-sec4-col-img2">
                    <img src="/assets/img/p8-side-img3.png" alt="Immobilie" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="p7-sec5-img-col">
                <img src="/assets/img/p8-side-img.png" alt="Immobilie" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEC 5 — Verkauf */}
      <section className="p8-sec5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 col-md-7">
              <div className="head-sec">
                <h3>{tr.sec5Heading}</h3>
                <h5>{tr.sec5Sub}</h5>
                <p>{tr.sec5Desc}</p>
                <Link href="/kontakt">
                  <button type="button" className="btn btn1">{tr.sec5Btn}</button>
                </Link>
              </div>
            </div>
            <div className="col-lg-5 col-md-5">
              <div className="michael-img">
                <img src="/assets/img/Michael-Leber.png" alt="Michael Leber" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEC 6 — Testimonials */}
      <TestimonialSection />

      {/* SEC 7 — Badges + Video */}
      <section className="badge-strip p8-sec7">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 col-md-10 mx-auto">
              <div className="row text-center p8-sec7-row1">
                <div className="col-lg-3 col-md-3 col-12">
                  <div className="p8-sec7-col-icon1">
                    <img src="/assets/img/hand-icon.png" alt={tr.badge1} />
                    <h5>{tr.badge1}</h5>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-12">
                  <div className="p8-sec7-col-icon1">
                    <img src="/assets/img/user-icon.png" alt={tr.badge2} />
                    <h5>{tr.badge2}</h5>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-12">
                  <div className="p8-sec7-col-icon1">
                    <img src="/assets/img/hand-icon2.png" alt={tr.badge3} />
                    <h5>{tr.badge3}</h5>
                  </div>
                </div>
              </div>
              <div className="video-wrapper">
                <video autoPlay muted loop playsInline>
                  <source src="/assets/img/
                  
                  " type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEC 8 — Blog */}
      <section className="p7-sec8 p8-sec8">
        <div className="container">
          <div className="row">
            <div className="col-lg-9 col-md-9 mx-auto head-sec text-center">
              <h6>{tr.blogSub}</h6>
              <h3>{tr.blogTitle}</h3>
              <p>{tr.blogDesc}</p>
            </div>

            {blogs.length > 0 ? (
              blogs.slice(0, 3).map((post) => (
                <div key={post.id} className="col-lg-4 col-md-4 col-12">
                  <div className="blog-col1">
                    <img
                      src={post.image ? `${BASE_URL}${post.image}` : '/assets/img/blog1.png'}
                      alt={post.title}
                      style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                    />
                    <p>
                      <i className="fa fa-calendar"></i>{' '}
                      {new Date(post.created_at).toLocaleDateString(lang === 'de' ? 'de-AT' : 'en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                    <h5>{post.title}</h5>
                    {post.excerpt && <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>{post.excerpt}</p>}
                    <Link href={`/blog/${post.slug}`}><button type="button" className="btn btn1">{tr.readMore}</button></Link>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="col-lg-4 col-md-4 col-12">
                  <div className="blog-col1">
                    <img src="/assets/img/blog1.png" alt="image" />
                    <p><i className="fa fa-calendar"></i> {tr.blog1Date}</p>
                    <h5>{tr.blog1Title}</h5>
                    <a href="#"><button type="button" className="btn btn1">{tr.readMore}</button></a>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-12">
                  <div className="blog-col1">
                    <img src="/assets/img/blog2.png" alt="image" />
                    <p><i className="fa fa-calendar"></i> {tr.blog2Date}</p>
                    <h5>{tr.blog2Title}</h5>
                    <a href="#"><button type="button" className="btn btn1">{tr.readMore}</button></a>
                  </div>
                </div>
                <div className="col-lg-4 col-md-4 col-12">
                  <div className="blog-col1">
                    <img src="/assets/img/blog3.png" alt="image" />
                    <p><i className="fa fa-calendar"></i> {tr.blog3Date}</p>
                    <h5>{tr.blog3Title}</h5>
                    <a href="#"><button type="button" className="btn btn1">{tr.readMore}</button></a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* SEC 9 — Contact CTA */}
      <section className="p8-sec9">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7 col-md-7 col-12">
              <div className="head-sec">
                <h3>{tr.ctaHeading}</h3>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-12">
              <Link href="/kontakt">
                <button type="button" className="btn btn1">{tr.ctaBtn}</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="michael-img-2">
          <img src="/assets/img/michaeliber-2.png" alt="Michael Leber" />
        </div>
      </section>

      <HomeFooter />

    </div>
  )
}

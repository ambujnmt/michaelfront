'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import websiteApi from '@/lib/websiteApi'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7001'

const DEFAULT_SLIDE = {
  image: '/assets/img/p8-hero-bg.png',
  title: null,
  subtitle: null,
  btn_text: null,
  btn_link: null,
}

export default function HeroSlider() {
  const [slides, setSlides] = useState([])
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    websiteApi.getSliders()
      .then(d => { setSlides(d.success && d.data.length ? d.data : [DEFAULT_SLIDE]) })
      .catch(() => { setSlides([DEFAULT_SLIDE]) })
      .finally(() => setLoaded(true))
  }, [])

  const next = useCallback(() => {
    setCurrent(p => (p + 1) % slides.length)
  }, [slides.length])

  const prev = () => setCurrent(p => (p - 1 + slides.length) % slides.length)

  useEffect(() => {
    if (slides.length <= 1) return
    timerRef.current = setInterval(next, 12000)
    return () => clearInterval(timerRef.current)
  }, [slides.length, next])

  const goTo = (i) => {
    clearInterval(timerRef.current)
    setCurrent(i)
    timerRef.current = setInterval(next, 12000)
  }

  if (!loaded) return (
    <div style={{ width: '100%', height: '100vh', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.2)', borderTop: '3px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const slide = slides[current]
  const imgSrc = slide.image ? (slide.image.startsWith('/uploads') ? `${BASE_URL}${slide.image}` : slide.image) : DEFAULT_SLIDE.image

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#0f0f1a' }}>

      <style>{`
        @keyframes kenburns {
          0%   { transform: scale(1.18) translateX(0px)   translateY(0px); }
          100% { transform: scale(1.0)  translateX(-12px) translateY(-6px); }
        }
        .kb-active { animation: kenburns 12s ease-out forwards; }

        @keyframes charIn {
          from { opacity: 0; transform: translateY(40px) scale(1.4); filter: blur(8px); }
          to   { opacity: 1; transform: translateY(0)    scale(1);   filter: blur(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-char {
          display: inline-block;
          opacity: 0;
          animation: charIn 0.65s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .hero-sub {
          opacity: 0;
          animation: fadeSlideUp 0.6s ease forwards;
        }
        .hero-btn {
          opacity: 0;
          animation: fadeSlideUp 0.6s ease forwards;
        }
      `}</style>

      {/* Slides */}
      {slides.map((s, i) => {
        const src = s.image ? (s.image.startsWith('/uploads') ? `${BASE_URL}${s.image}` : s.image) : DEFAULT_SLIDE.image
        return (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1.2s ease',
            zIndex: i === current ? 1 : 0,
            overflow: 'hidden',
          }}>
            <img
              src={src}
              alt={s.title || ''}
              className={i === current ? 'kb-active' : ''}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transformOrigin: 'center center' }}
            />
          </div>
        )
      })}

      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)', zIndex: 2 }} />

      {/* Content — centered */}
      {(slide.title || slide.subtitle || slide.btn_text) && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 20px',
          paddingTop: '12vh',
        }}>
          <div key={current} style={{ maxWidth: '800px', width: '100%' }}>
            {slide.title && (
              <h1 style={{
                color: '#fff', fontFamily: 'var(--head-font)',
                fontSize: 'clamp(36px, 5.5vw, 80px)',
                fontWeight: '200', lineHeight: '1.1',
                letterSpacing: '-3px', marginBottom: '24px',
                overflow: 'hidden',
              }}>
                {slide.title.split('').map((char, i) => (
                  <span
                    key={i}
                    className="hero-char"
                    style={{ animationDelay: `${0.3 + i * 0.045}s` }}
                  >
                    {char === ' ' ? ' ' : char}
                  </span>
                ))}
              </h1>
            )}
            {slide.subtitle && (
              <p
                className="hero-sub"
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: 'clamp(15px, 2vw, 20px)',
                  fontFamily: 'var(--pera-font)',
                  lineHeight: '1.6',
                  maxWidth: '560px', margin: '0 auto 36px',
                  animationDelay: `${0.3 + slide.title.length * 0.045 + 0.2}s`,
                }}
              >{slide.subtitle}</p>
            )}
            {slide.btn_text && (
              <div
                className="hero-btn"
                style={{ animationDelay: `${0.3 + slide.title.length * 0.045 + 0.5}s` }}
              >
                <Link href={slide.btn_link || '#'}>
                  <button className="btn btn1" style={{ fontSize: '14px', padding: '14px 34px', letterSpacing: '0.05em' }}>
                    {slide.btn_text}
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} style={{
            position: 'absolute', left: '30px', top: '50%', transform: 'translateY(-50%)',
            zIndex: 4, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', width: '50px', height: '50px', borderRadius: '50%',
            cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)', transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
            <i className="fa fa-angle-left" />
          </button>
          <button onClick={next} style={{
            position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)',
            zIndex: 4, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', width: '50px', height: '50px', borderRadius: '50%',
            cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)', transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}>
            <i className="fa fa-angle-right" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div style={{
          position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 4, display: 'flex', gap: '10px',
        }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i === current ? '28px' : '10px', height: '10px',
              borderRadius: '5px', border: 'none', cursor: 'pointer',
              background: i === current ? '#fff' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.3s ease', padding: 0,
            }} />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {slides.length > 1 && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.15)', zIndex: 4 }}>
          <div key={current} style={{
            height: '100%', background: 'rgba(255,255,255,0.7)',
            animation: 'progress 12s linear forwards',
          }} />
          <style>{`@keyframes progress { from{width:0%} to{width:100%} }`}</style>
        </div>
      )}

    </div>
  )
}

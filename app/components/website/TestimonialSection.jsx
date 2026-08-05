'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import websiteApi from '@/lib/websiteApi'

import { BASE_URL } from '@/service/config'

const FALLBACK = {
  de: [
    { message: '„Ich Habe Mein Traumhaus Gefunden Dank Der Exzellenten Beratung Von Michael Leber. Der Prozess War Reibungslos Und Professionell."', name: 'Thomas Wagner', position: 'Käufer' },
    { message: '„Michael Leber Hat Unsere Immobilie Weit Über Dem Erwarteten Preis Verkauft. Seine Marktkenntnisse Sind Unübertroffen."', name: 'Anna Müller', position: 'Verkäuferin' },
    { message: '„Der Größte Unterschied In Meinem Leben. Ich Bin Sehr Glücklich. Vielen Dank, Michael Leber Immobilien."', name: 'Michelle Miller', position: 'Experte' },
  ],
  en: [
    { message: '"I found my dream home thanks to the excellent advice of Michael Leber. The process was smooth and professional."', name: 'Thomas Wagner', position: 'Buyer' },
    { message: '"Michael Leber sold our property well above the expected price. His market knowledge is unmatched."', name: 'Anna Müller', position: 'Seller' },
    { message: '"The biggest difference in my life. I am very happy. Thank you, Michael Leber Immobilien."', name: 'Michelle Miller', position: 'Expert' },
  ],
}

const ui = {
  de: { label: 'Erfahrungsberichte', heading: 'Unsere Zufriedenen Kunden' },
  en: { label: 'Testimonials', heading: 'Our Satisfied Customers' },
}

export default function TestimonialSection() {
  const { lang } = useLanguage()
  const [items, setItems] = useState([])
  const [current, setCurrent] = useState(0)
  const [exiting, setExiting] = useState(null)
  const tr = ui[lang]

  useEffect(() => {
    websiteApi.getTestimonials()
      .then(d => {
        if (d.success && d.data.length) setItems(d.data)
        else setItems(FALLBACK[lang])
      })
      .catch(() => setItems(FALLBACK[lang]))
  }, [])

  // reset index if items change
  useEffect(() => { setCurrent(0) }, [items.length])

  const goTo = (index) => {
    if (index === current) return
    setExiting(current)
    setTimeout(() => setExiting(null), 550)
    setCurrent(index)
  }

  useEffect(() => {
    if (!items.length) return
    const interval = setInterval(() => {
      setCurrent(prev => {
        setExiting(prev)
        setTimeout(() => setExiting(null), 550)
        return (prev + 1) % items.length
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [items.length])

  if (!items.length) return null

  const t = items[current]

  return (
    <section className="testimonial-section p7-sec7">
      <div className="content-card">
        <div className="quote-mark">
          <img src="/assets/img/quote.png" alt="quote" style={{ width: '40px', height: 'auto' }} />
        </div>
        <div className="head-sec">
          <h6>{tr.label}</h6>
          <h3>{tr.heading}</h3>
        </div>

        <div id="testimonialSlider">
          {items.map((t, i) => (
            <div key={i} className={`slide-item${i === current ? ' active' : ''}${i === exiting ? ' exit' : ''}`}>

              {/* Avatar if available */}
              {t.image && (
                <div style={{ marginBottom: '16px' }}>
                  <img
                    src={`${BASE_URL}${t.image}`}
                    alt={t.name}
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto', display: 'block', border: '3px solid rgba(255,255,255,0.2)' }}
                  />
                </div>
              )}

              <p>„{t.message}"</p>
              <p className="author-name">{t.name}</p>
              <p className="author-role">{t.position || ''}</p>

              {/* Star rating */}
              {t.rating && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '8px' }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <i key={n} className={`fa fa-star${n <= t.rating ? '' : '-o'}`}
                      style={{ color: '#facc15', fontSize: '14px' }} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="slider-dots" id="sliderDots">
          {items.map((_, i) => (
            <button key={i} className={`dot${i === current ? ' active' : ''}`}
              onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

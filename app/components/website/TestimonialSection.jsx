'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

const testimonials = {
  de: [
    {
      text: '„Der Größte Unterschied In Meinem Leben, Den Ich In Ecoland Erfahren Habe, Ist Die Herzliche Familiäre Zuneigung. Ich Bin Sehr Glücklich, Wenn Ich Nach Hause Komme. Dieser Ort Hat Dazu Beigetragen, Dass Meine Familie Immer Mehr Zeit Miteinander Verbringt Und Die Zuneigung Dadurch Noch Stärker Geworden Ist. Vielen Dank, Ecoland."',
      author: 'Michelle Miller',
      role: 'Experte',
    },
    {
      text: '„Ich Habe Mein Traumhaus Gefunden Dank Der Exzellenten Beratung Von Michael Leber. Der Prozess War Reibungslos Und Professionell. Ich Würde Seine Dienste Jedem Empfehlen, Der Auf Der Suche Nach Einer Immobilie In Wien Ist."',
      author: 'Thomas Wagner',
      role: 'Käufer',
    },
    {
      text: '„Michael Leber Hat Unsere Immobilie Weit Über Dem Erwarteten Preis Verkauft. Seine Marktkenntnisse Und Sein Netzwerk Sind Unübertroffen. Absolute Empfehlung Für Jeden Immobilienverkauf In Österreich."',
      author: 'Anna Müller',
      role: 'Verkäuferin',
    },
  ],
  en: [
    {
      text: '"The biggest difference in my life that I have experienced at Ecoland is the warm family affection. I am very happy when I come home. This place has contributed to my family spending more and more time together and the affection has grown even stronger. Thank you, Ecoland."',
      author: 'Michelle Miller',
      role: 'Expert',
    },
    {
      text: '"I found my dream home thanks to the excellent advice of Michael Leber. The process was smooth and professional. I would recommend his services to anyone looking for a property in Vienna."',
      author: 'Thomas Wagner',
      role: 'Buyer',
    },
    {
      text: '"Michael Leber sold our property well above the expected price. His market knowledge and network are unmatched. Absolute recommendation for any property sale in Austria."',
      author: 'Anna Müller',
      role: 'Seller',
    },
  ],
}

const ui = {
  de: { label: 'Erfahrungsberichte', heading: 'Unsere Zufriedenen Kunden' },
  en: { label: 'Testimonials', heading: 'Our Satisfied Customers' },
}

export default function TestimonialSection() {
  const { lang } = useLanguage()
  const [current, setCurrent] = useState(0)
  const [exiting, setExiting] = useState(null)

  const items = testimonials[lang]
  const tr = ui[lang]

  const goTo = (index) => {
    if (index === current) return
    setExiting(current)
    setTimeout(() => setExiting(null), 550)
    setCurrent(index)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => {
        setExiting(prev)
        setTimeout(() => setExiting(null), 550)
        return (prev + 1) % items.length
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [items.length])

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
            <div
              key={i}
              className={`slide-item${i === current ? ' active' : ''}${i === exiting ? ' exit' : ''}`}
            >
              <p>{t.text}</p>
              <p className="author-name">{t.author}</p>
              <p className="author-role">{t.role}</p>
            </div>
          ))}
        </div>
        <div className="slider-dots" id="sliderDots">
          {items.map((_, i) => (
            <button
              key={i}
              className={`dot${i === current ? ' active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  )
}

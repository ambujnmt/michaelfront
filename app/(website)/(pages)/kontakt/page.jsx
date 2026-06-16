'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import websiteApi from '@/lib/websiteApi'
import allTranslations from '@/lib/translations'

export default function Kontakt() {

  const { lang } = useLanguage()
  const t = allTranslations.kontakt[lang]

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')
    setError('')

    try {
      const data = await websiteApi.submitInquiry(form)
      if (data.success) {
        setSuccess(t.successMsg)
        setForm({ name: '', email: '', phone: '', message: '' })
      } else {
        setError(data.message)
      }
    } catch {
      setError(t.errorMsg)
    }

    setLoading(false)
  }

  return (
    <>
      <section className="inner-page-banner head-sec">
        <div className="container">
          <h1>{t.bannerTitle}</h1>
          <p>{t.bannerSubtitle}</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row">

            <div className="col-lg-6 mb-4">
              <div className="head-sec">
                <h3>{t.formTitle}</h3>
              </div>
              <form className="home-1-form mt-4" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <input type="text" className="form-control" placeholder={t.namePlaceholder}
                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <input type="text" className="form-control" placeholder={t.phonePlaceholder}
                        value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <input type="email" className="form-control" placeholder={t.emailPlaceholder}
                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group">
                      <textarea rows="5" className="form-control" placeholder={t.messagePlaceholder}
                        value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required></textarea>
                    </div>
                  </div>
                  {success && <div className="col-lg-12"><p style={{ color: 'green', marginBottom: '10px' }}>{success}</p></div>}
                  {error && <div className="col-lg-12"><p style={{ color: 'red', marginBottom: '10px' }}>{error}</p></div>}
                  <div className="col-lg-12">
                    <button type="submit" className="btn btn1" disabled={loading}>
                      {loading ? t.sendingBtn : t.sendBtn}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="head-sec">
                <h3>{t.contactTitle}</h3>
              </div>
              <div className="mt-4">
                <p><i className="fa fa-envelope me-2"></i> office@michaelleber.at</p>
                <p><img src="/assets/img/phone.png" alt="phone" style={{ width: '16px', marginRight: '8px' }} /> +43 664 547 5915</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

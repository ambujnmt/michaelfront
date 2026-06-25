'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'
import websiteApi from '@/lib/websiteApi'

export default function Immobilienanfrage() {
  const router = useRouter()
  const { lang } = useLanguage()
  const tr = translations.immobilienanfrage[lang]

  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    property_type: 'villa', location: '', budget: '', message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fullMessage =
      `[${tr.typeLabel}: ${form.property_type}] ` +
      (form.location ? `[${tr.locationLabel}: ${form.location}] ` : '') +
      (form.budget ? `[${tr.budgetLabel}: €${form.budget}] ` : '') +
      form.message

    try {
      const res = await websiteApi.submitInquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: fullMessage,
      })
      if (res.success) {
        setSubmitted(true)
      } else {
        setError(res.message || tr.errorMsg)
      }
    } catch {
      setError(tr.errorMsg)
    }
    setLoading(false)
  }

  const reset = () => {
    setSubmitted(false)
    setForm({ name: '', phone: '', email: '', property_type: 'villa', location: '', budget: '', message: '' })
  }

  return (
    <>
      <section className="inner-page-banner head-sec">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h1 style={{ margin: 0 }}>{tr.bannerTitle}</h1>
            <button onClick={() => router.back()} className="btn btn1" style={{ fontSize: '13px', padding: '8px 20px', flexShrink: 0 }}>
              <i className="fa fa-arrow-left" style={{ marginRight: '6px' }}></i>
              {lang === 'de' ? 'Zurück' : 'Back'}
            </button>
          </div>
          <p>{tr.bannerSub}</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">

              {submitted ? (
                <div className="head-sec text-center" style={{ padding: '60px 0' }}>
                  <i className="fa fa-check-circle" style={{ fontSize: '64px', color: '#22c55e', marginBottom: '24px', display: 'block' }} />
                  <h3>{tr.successMsg}</h3>
                  <p style={{ marginTop: '12px', marginBottom: '32px' }}>{tr.successSub}</p>
                  <button type="button" className="btn btn1" onClick={reset}>
                    {tr.newInquiry}
                  </button>
                </div>
              ) : (
                <>
                  <div className="head-sec mb-4">
                    <h3>{tr.formTitle}</h3>
                    <p>{tr.formDesc}</p>
                  </div>

                  <form className="home-1-form" onSubmit={handleSubmit}>
                    <div className="row">

                      {/* Name */}
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={tr.namePh}
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={tr.phonePh}
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="col-lg-12">
                        <div className="form-group">
                          <input
                            type="email"
                            className="form-control"
                            placeholder={tr.emailPh}
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      {/* Property Type */}
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label style={{ color: '#888', fontSize: '13px', marginBottom: '6px', display: 'block' }}>{tr.typeLabel}</label>
                          <select
                            className="form-control"
                            value={form.property_type}
                            onChange={e => setForm({ ...form, property_type: e.target.value })}
                          >
                            <option value="villa">{tr.typeVilla}</option>
                            <option value="apartment">{tr.typeApartment}</option>
                            <option value="various">{tr.typeVarious}</option>
                          </select>
                        </div>
                      </div>

                      {/* Preferred Location */}
                      <div className="col-lg-6 col-md-6">
                        <div className="form-group">
                          <label style={{ color: '#888', fontSize: '13px', marginBottom: '6px', display: 'block' }}>{tr.locationLabel}</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={tr.locationPh}
                            value={form.location}
                            onChange={e => setForm({ ...form, location: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Budget */}
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label style={{ color: '#888', fontSize: '13px', marginBottom: '6px', display: 'block' }}>{tr.budgetLabel}</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder={tr.budgetPh}
                            value={form.budget}
                            onChange={e => setForm({ ...form, budget: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Message */}
                      <div className="col-lg-12">
                        <div className="form-group">
                          <textarea
                            rows="5"
                            className="form-control"
                            placeholder={tr.messagePh}
                            value={form.message}
                            onChange={e => setForm({ ...form, message: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="col-lg-12">
                          <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>
                        </div>
                      )}

                      <div className="col-lg-12">
                        <button type="submit" className="btn btn1" disabled={loading}>
                          {loading ? tr.sendingBtn : tr.submitBtn}
                        </button>
                      </div>

                    </div>
                  </form>
                </>
              )}

            </div>
          </div>
        </div>
      </section>
    </>
  )
}

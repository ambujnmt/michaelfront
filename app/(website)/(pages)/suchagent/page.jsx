'use client'

import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'

export default function Suchagent() {
  const { lang } = useLanguage()
  const tr = translations.suchagent[lang]

  return (
    <>
      <section className="inner-page-banner head-sec">
        <div className="container">
          <h1>{tr.bannerTitle}</h1>
          <p>{tr.bannerSub}</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="col-lg-8 mx-auto">
            <div className="head-sec mb-4">
              <h3>{tr.formTitle}</h3>
              <p>{tr.formDesc}</p>
            </div>

            <form className="home-1-form">
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{tr.typeLabel}</label>
                    <select className="form-control">
                      {tr.typeOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                    </select>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{tr.locationLabel}</label>
                    <input type="text" className="form-control" placeholder={tr.locationPlaceholder} />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{tr.sizeLabel}</label>
                    <input type="number" className="form-control" placeholder={tr.sizePlaceholder} />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="form-group">
                    <label>{tr.priceLabel}</label>
                    <input type="number" className="form-control" placeholder={tr.pricePlaceholder} />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form-group">
                    <label>{tr.emailLabel}</label>
                    <input type="email" className="form-control" placeholder={tr.emailPlaceholder} />
                  </div>
                </div>
                <div className="col-lg-12">
                  <button type="button" className="btn btn1">{tr.btnText}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

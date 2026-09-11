import BASE from "../service/config";

const websiteApi = {

  getProperties: () =>
    fetch(`${BASE}/api/website/properties`).then(r => r.json()),

  getSalesProperties: () =>
    fetch(`${BASE}/api/website/properties/sales`).then(r => r.json()),

  getProperty: (id) =>
    fetch(`${BASE}/api/website/properties/${id}`).then(r => r.json()),

  getPropertyImages: (id) =>
    fetch(`${BASE}/api/website/properties/${id}/images`).then(r => r.json()),

  getApartmentImages: (id) =>
    fetch(`${BASE}/api/website/properties/${id}/apartment-images`).then(r => r.json()),

  submitInquiry: (data) =>
    fetch(`${BASE}/api/website/inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  submitSuchagent: (data) =>
    fetch(`${BASE}/api/website/suchagent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  submitContact: (data) =>
    fetch(`${BASE}/api/website/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  subscribe: (email) =>
    fetch(`${BASE}/api/website/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }).then(r => r.json()),

  getSliders: () =>
    fetch(`${BASE}/api/website/sliders`).then(r => r.json()),

  getTestimonials: () =>
    fetch(`${BASE}/api/website/testimonials`).then(r => r.json()),

  getBlogs: () =>
    fetch(`${BASE}/api/website/blogs`).then(r => r.json()),

  getBlog: (id) =>
    fetch(`${BASE}/api/website/blogs/${id}`).then(r => r.json()),

  getSiteInfo: () =>
    fetch(`${BASE}/api/website/site-info`).then(r => r.json()),

  getTeam: () =>
    fetch(`${BASE}/api/website/team`).then(r => r.json()),

  getAbout: () =>
    fetch(`${BASE}/api/website/about`).then(r => r.json()),

  getHomeIntro: () =>
    fetch(`${BASE}/api/website/home-intro`).then(r => r.json()),

  getVideoBanner: () =>
    fetch(`${BASE}/api/website/video-banner`).then(r => r.json()),

  getVerkaufPage: () =>
    fetch(`${BASE}/api/website/verkauf-page`).then(r => r.json()),

  getKontaktPage: () =>
    fetch(`${BASE}/api/website/kontakt-page`).then(r => r.json()),

  getPrivacyPage: () =>
    fetch(`${BASE}/api/website/privacy-page`).then(r => r.json()),

  getImpressumPage: () =>
    fetch(`${BASE}/api/website/impressum-page`).then(r => r.json()),

}

export default websiteApi

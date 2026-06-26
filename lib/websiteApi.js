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

  submitInquiry: (data) =>
    fetch(`${BASE}/api/website/inquiry`, {
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

}

export default websiteApi

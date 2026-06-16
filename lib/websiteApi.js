const BASE = process.env.NEXT_PUBLIC_API_URL

const websiteApi = {

  getProperties: () =>
    fetch(`${BASE}/api/website/properties`).then(r => r.json()),

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

  subscribe: (email) =>
    fetch(`${BASE}/api/website/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    }).then(r => r.json()),

}

export default websiteApi

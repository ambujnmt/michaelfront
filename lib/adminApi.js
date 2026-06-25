import BASE from "../service/config";

const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('adminToken') : ''

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
})

const adminApi = {

  // Auth
  login: (data) =>
    fetch(`${BASE}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  // Dashboard
  getStats: () =>
    fetch(`${BASE}/api/admin/stats`, {
      headers: authHeaders()
    }).then(r => r.json()),

  // Properties
  getProperties: () =>
    fetch(`${BASE}/api/admin/properties`, {
      headers: authHeaders()
    }).then(r => r.json()),

  getProperty: (id) =>
    fetch(`${BASE}/api/admin/properties/${id}`, {
      headers: authHeaders()
    }).then(r => r.json()),

  addProperty: (data) =>
    fetch(`${BASE}/api/admin/properties`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }).then(r => r.json()),

  updateProperty: (id, data) =>
    fetch(`${BASE}/api/admin/properties/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }).then(r => r.json()),

  deleteProperty: (id) =>
    fetch(`${BASE}/api/admin/properties/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    }).then(r => r.json()),

  uploadBanner: (id, formData) =>
    fetch(`${BASE}/api/admin/properties/${id}/banner`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(r => r.json()),

  getPropertyImages: (id) =>
    fetch(`${BASE}/api/admin/properties/${id}/images`, {
      headers: authHeaders()
    }).then(r => r.json()),

  uploadGalleryImages: (id, formData) =>
    fetch(`${BASE}/api/admin/properties/${id}/images`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(r => r.json()),

  deleteGalleryImage: (imageId) =>
    fetch(`${BASE}/api/admin/properties/images/${imageId}`, {
      method: 'DELETE',
      headers: authHeaders()
    }).then(r => r.json()),

  // Inquiries
  getInquiries: () =>
    fetch(`${BASE}/api/admin/inquiries`, {
      headers: authHeaders()
    }).then(r => r.json()),

  updateInquiryStatus: (id, status) =>
    fetch(`${BASE}/api/admin/inquiries/${id}/status`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ status })
    }).then(r => r.json()),

  deleteInquiry: (id) =>
    fetch(`${BASE}/api/admin/inquiries/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    }).then(r => r.json()),

  // Contacts
  getContacts: () =>
    fetch(`${BASE}/api/admin/contacts`, { headers: authHeaders() }).then(r => r.json()),

  updateContactStatus: (id, status) =>
    fetch(`${BASE}/api/admin/contacts/${id}/status`, {
      method: 'PUT', headers: authHeaders(), body: JSON.stringify({ status })
    }).then(r => r.json()),

  deleteContact: (id) =>
    fetch(`${BASE}/api/admin/contacts/${id}`, {
      method: 'DELETE', headers: authHeaders()
    }).then(r => r.json()),

  // Mail
  sendMail: (data) => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15000)
    return fetch(`${BASE}/api/admin/send-mail`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
      signal: controller.signal,
    }).then(async r => {
      const text = await r.text()
      try { return JSON.parse(text) }
      catch { return { success: false, message: `Server error (${r.status}) — restart the server` } }
    }).finally(() => clearTimeout(timer))
  },

  // Sliders
  getSliders: () =>
    fetch(`${BASE}/api/admin/sliders`, { headers: authHeaders() }).then(r => r.json()),

  createSlider: (formData) =>
    fetch(`${BASE}/api/admin/sliders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(r => r.json()),

  updateSlider: (id, formData) =>
    fetch(`${BASE}/api/admin/sliders/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(r => r.json()),

  deleteSlider: (id) =>
    fetch(`${BASE}/api/admin/sliders/${id}`, {
      method: 'DELETE', headers: authHeaders()
    }).then(r => r.json()),

  // Testimonials
  getTestimonials: () =>
    fetch(`${BASE}/api/admin/testimonials`, { headers: authHeaders() }).then(r => r.json()),

  createTestimonial: (formData) =>
    fetch(`${BASE}/api/admin/testimonials`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(r => r.json()),

  updateTestimonial: (id, formData) =>
    fetch(`${BASE}/api/admin/testimonials/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(r => r.json()),

  deleteTestimonial: (id) =>
    fetch(`${BASE}/api/admin/testimonials/${id}`, {
      method: 'DELETE', headers: authHeaders()
    }).then(r => r.json()),

  // Blogs
  getBlogs: () =>
    fetch(`${BASE}/api/admin/blogs`, { headers: authHeaders() }).then(r => r.json()),

  getBlog: (id) =>
    fetch(`${BASE}/api/admin/blogs/${id}`, { headers: authHeaders() }).then(r => r.json()),

  createBlog: (formData) =>
    fetch(`${BASE}/api/admin/blogs`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(r => r.json()),

  updateBlog: (id, formData) =>
    fetch(`${BASE}/api/admin/blogs/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(r => r.json()),

  deleteBlog: (id) =>
    fetch(`${BASE}/api/admin/blogs/${id}`, {
      method: 'DELETE', headers: authHeaders()
    }).then(r => r.json()),

  // Subscribers
  getSubscribers: () =>
    fetch(`${BASE}/api/admin/subscribers`, {
      headers: authHeaders()
    }).then(r => r.json()),

  deleteSubscriber: (id) =>
    fetch(`${BASE}/api/admin/subscribers/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    }).then(r => r.json()),

  // Settings
  updateProfile: (data) =>
    fetch(`${BASE}/api/admin/settings/profile`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }).then(r => r.json()),

  updatePassword: (data) =>
    fetch(`${BASE}/api/admin/settings/password`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }).then(r => r.json()),

  getSiteSettings: () =>
    fetch(`${BASE}/api/admin/settings/site`, {
      headers: authHeaders()
    }).then(r => r.json()),

  updateSiteSettings: (data) =>
    fetch(`${BASE}/api/admin/settings/site`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    }).then(r => r.json()),

}

export default adminApi

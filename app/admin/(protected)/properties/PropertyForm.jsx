'use client'

import { useRef } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const inputStyle = {
  width: '100%', padding: '12px 14px',
  background: '#0f1623', border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: '10px', color: '#f1f5f9', outline: 'none',
  fontSize: '14px', marginBottom: '16px',
}

const labelStyle = {
  color: '#cbd5e1', fontSize: '13px', fontWeight: '600',
  display: 'block', marginBottom: '6px',
}

const sectionStyle = {
  background: '#0f1623', borderRadius: '12px', padding: '18px',
  marginBottom: '16px', border: '1px solid rgba(255,255,255,0.1)',
}

const removeBtn = {
  position: 'absolute', top: '-6px', right: '-6px',
  background: '#ef4444', color: '#fff', border: 'none',
  borderRadius: '50%', width: '20px', height: '20px',
  fontSize: '13px', cursor: 'pointer', lineHeight: '20px',
  textAlign: 'center', padding: 0, fontWeight: '700',
}

export default function PropertyForm({
  form, setForm, onSubmit, loading, editId,
  bannerFile, onBannerChange,
  galleryFiles, onGalleryAdd, onGalleryRemove,
  existingGallery, onDeleteGallery,
}) {
  const galleryInputRef = useRef(null)

  const bannerPreview = bannerFile
    ? URL.createObjectURL(bannerFile)
    : (form.image ? `${API}${form.image}` : null)

  const handleGalleryPick = (e) => {
    const file = e.target.files[0]
    if (file) onGalleryAdd(file)
    e.target.value = ''
  }

  return (
    <div style={{
      background: '#1a1f2e', borderRadius: '18px', padding: '28px',
      marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)',
    }}>
      <h4 style={{ color: '#f1f5f9', marginBottom: '24px', fontSize: '16px', fontWeight: '700' }}>
        {editId ? 'Edit Property' : 'Add New Property'}
      </h4>
      <form onSubmit={onSubmit}>
        <div className="row">

          {/* Text Fields */}
          <div className="col-lg-6">
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} placeholder="e.g. Luxury Villa Wien" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="col-lg-6">
            <label style={labelStyle}>Location *</label>
            <input style={inputStyle} placeholder="e.g. 1010 Vienna" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
          </div>
          <div className="col-lg-4">
            <label style={labelStyle}>Price (€) *</label>
            <input style={inputStyle} placeholder="e.g. 1200000" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
          </div>
          <div className="col-lg-4">
            <label style={labelStyle}>Size (m²)</label>
            <input style={inputStyle} type="number" placeholder="e.g. 150" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} />
          </div>
          <div className="col-lg-4">
            <label style={labelStyle}>Rooms</label>
            <input style={inputStyle} type="number" placeholder="e.g. 4" value={form.rooms} onChange={e => setForm({ ...form, rooms: e.target.value })} />
          </div>
          <div className="col-lg-6">
            <label style={labelStyle}>Bedrooms</label>
            <input style={inputStyle} type="number" placeholder="e.g. 3" value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })} />
          </div>
          <div className="col-lg-6">
            <label style={labelStyle}>Bathrooms</label>
            <input style={inputStyle} type="number" placeholder="e.g. 2" value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })} />
          </div>
          <div className="col-lg-12">
            <label style={labelStyle}>Status</label>
            <select style={inputStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option>Active</option>
              <option>Pending</option>
              <option>Sold</option>
            </select>
          </div>
          <div className="col-lg-12">
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, height: '90px', resize: 'vertical' }} placeholder="Short description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>

          {/* Banner Image */}
          <div className="col-lg-12">
            <div style={sectionStyle}>
              <label style={{ ...labelStyle, marginBottom: '12px', fontSize: '14px' }}>
                <i className="fa fa-image" style={{ marginRight: '8px', color: '#60a5fa' }} />
                Banner Image
              </label>
              {bannerPreview && (
                <div style={{ marginBottom: '12px' }}>
                  <img src={bannerPreview} alt="banner" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                </div>
              )}
              <input
                type="file" accept="image/*"
                onChange={e => onBannerChange(e.target.files[0] || null)}
                style={{ color: '#94a3b8', fontSize: '13px' }}
              />
              <p style={{ color: '#64748b', fontSize: '12px', margin: '6px 0 0' }}>JPG, PNG, WEBP — max 5MB</p>
            </div>
          </div>

          {/* Gallery Images */}
          <div className="col-lg-12">
            <div style={sectionStyle}>
              <label style={{ ...labelStyle, marginBottom: '12px', fontSize: '14px' }}>
                <i className="fa fa-th" style={{ marginRight: '8px', color: '#60a5fa' }} />
                Gallery Images
              </label>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-start' }}>

                {/* Existing gallery images */}
                {existingGallery && existingGallery.map(img => (
                  <div key={img.id} style={{ position: 'relative' }}>
                    <img src={`${API}${img.image}`} alt="" style={{ width: '90px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <button type="button" onClick={() => onDeleteGallery(img.id)} style={removeBtn}>×</button>
                  </div>
                ))}

                {/* Newly added images (not yet uploaded) */}
                {galleryFiles && galleryFiles.map((file, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={URL.createObjectURL(file)} alt="" style={{ width: '90px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #2563eb' }} />
                    <button type="button" onClick={() => onGalleryRemove(i)} style={removeBtn}>×</button>
                    <span style={{ position: 'absolute', bottom: '3px', left: '3px', background: '#2563eb', color: '#fff', fontSize: '9px', padding: '1px 4px', borderRadius: '4px', fontWeight: '700' }}>NEW</span>
                  </div>
                ))}

                {/* Add image button */}
                <button
                  type="button"
                  onClick={() => galleryInputRef.current.click()}
                  style={{
                    width: '90px', height: '70px', borderRadius: '8px',
                    border: '2px dashed rgba(255,255,255,0.2)', background: 'transparent',
                    color: '#64748b', fontSize: '24px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                  title="Add image"
                >+</button>
              </div>

              {/* Hidden single file input */}
              <input ref={galleryInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleGalleryPick} />
              <p style={{ color: '#64748b', fontSize: '12px', margin: '10px 0 0' }}>Click + to add images one by one — JPG, PNG, WEBP, max 5MB each</p>
            </div>
          </div>

          {/* Submit */}
          <div className="col-lg-12">
            <button type="submit" disabled={loading} style={{
              background: '#2563eb', color: '#fff', border: 'none',
              padding: '12px 28px', borderRadius: '12px', fontWeight: '700',
              fontSize: '14px', cursor: 'pointer', opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 14px rgba(37,99,235,0.5)',
            }}>
              {loading ? 'Saving...' : editId ? 'Update Property' : 'Add Property'}
            </button>
          </div>

        </div>
      </form>
    </div>
  )
}

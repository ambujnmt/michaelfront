'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'

const QuillEditor = dynamic(() => import('@/app/components/admin/QuillEditor'), { ssr: false })

import { API_URL as API } from '@/service/config'

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

// DE / EN pill shown next to a field label (mirrors the Privacy/Impressum admin pages)
const langTag = (lang) => ({
  display: 'inline-block', marginLeft: '8px', fontSize: '10px', fontWeight: '700',
  color: lang === 'de' ? '#60a5fa' : '#34d399',
  background: lang === 'de' ? 'rgba(96,165,250,0.15)' : 'rgba(52,211,153,0.15)',
  border: `1px solid ${lang === 'de' ? 'rgba(96,165,250,0.35)' : 'rgba(52,211,153,0.35)'}`,
  padding: '1px 7px', borderRadius: '20px', verticalAlign: 'middle',
})

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
  apartmentFiles = [], onApartmentAdd, onApartmentRemove,
  existingApartmentImages = [], onDeleteApartmentImage,
}) {
  const galleryInputRef = useRef(null)
  const apartmentInputRef = useRef(null)

  const bannerPreview = bannerFile
    ? URL.createObjectURL(bannerFile)
    : (form.image ? `${API}${form.image}` : null)

  const handleGalleryPick = (e) => {
    const file = e.target.files[0]
    if (file) onGalleryAdd(file)
    e.target.value = ''
  }

  const handleApartmentPick = (e) => {
    const file = e.target.files[0]
    if (file) onApartmentAdd(file)
    e.target.value = ''
  }

  return (
    <div style={{
      background: '#1a1f2e', borderRadius: '18px', padding: '28px',
      marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)',
    }}>
      <h4 style={{ color: '#f1f5f9', marginBottom: '6px', fontSize: '16px', fontWeight: '700' }}>
        {editId ? 'Edit Property' : 'Add New Property'}
      </h4>
      <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '22px' }}>
        Text fields have German and English side by side. English is optional — if left blank, the site shows the German text.
      </p>

      <form onSubmit={onSubmit}>
        <div className="row">

          {/* Title — DE / EN */}
          <div className="col-lg-6">
            <label style={labelStyle}>Title <span style={langTag('de')}>DE</span> *</label>
            <input style={inputStyle} placeholder="e.g. Luxury Villa Wien" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="col-lg-6">
            <label style={labelStyle}>Title <span style={langTag('en')}>EN</span></label>
            <input style={inputStyle} placeholder="e.g. Luxury Villa Vienna" value={form.title_en || ''} onChange={e => setForm({ ...form, title_en: e.target.value })} />
          </div>

          {/* Location — DE / EN */}
          <div className="col-lg-6">
            <label style={labelStyle}>Location <span style={langTag('de')}>DE</span> *</label>
            <input style={inputStyle} placeholder="e.g. 1010 Wien" value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} required />
          </div>
          <div className="col-lg-6">
            <label style={labelStyle}>Location <span style={langTag('en')}>EN</span></label>
            <input style={inputStyle} placeholder="e.g. 1010 Vienna" value={form.location_en || ''} onChange={e => setForm({ ...form, location_en: e.target.value })} />
          </div>
          <div className="col-lg-4">
            <label style={labelStyle}>Price (€) *</label>
            <input style={inputStyle} placeholder="e.g. 1200000" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
          </div>
          <div className="col-lg-8">
            <label style={labelStyle}>Property Type</label>
            <select style={inputStyle} value={form.property_type || 'villa'} onChange={e => {
              const property_type = e.target.value
              // Land Area applies to House & Land/Plot. Living Area / Rooms / Bedrooms /
              // Bathrooms / Outdoor Area don't apply to a bare Land/Plot listing.
              const patch = { property_type }
              if (property_type !== 'villa' && property_type !== 'various') patch.plot_size = ''
              // Floor / Etage only applies to apartments
              if (property_type !== 'apartment') patch.floor = ''
              if (property_type === 'various') {
                patch.size = ''
                patch.rooms = ''
                patch.bedrooms = ''
                patch.bathrooms = ''
                patch.outdoor_area = ''
              }
              setForm({ ...form, ...patch })
            }}>
              <option value="villa">Villa / House</option>
              <option value="apartment">Apartment</option>
              <option value="various">Land/Plot</option>
            </select>
          </div>

          {(() => {
            const type = form.property_type || 'villa'
            const isLand = type === 'various'
            const isHouse = type === 'villa'

            if (isLand) {
              return (
                <div className="col-lg-4">
                  <label style={labelStyle}>Land Area (m²)</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 800" value={form.plot_size || ''} onChange={e => setForm({ ...form, plot_size: e.target.value })} />
                </div>
              )
            }

            return (
              <>
                <div className="col-lg-4">
                  <label style={labelStyle}>Living Area (m²)</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 150" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} />
                </div>
                {isHouse && (
                  <div className="col-lg-4">
                    <label style={labelStyle}>Land Area (m²)</label>
                    <input style={inputStyle} type="number" placeholder="e.g. 400" value={form.plot_size || ''} onChange={e => setForm({ ...form, plot_size: e.target.value })} />
                  </div>
                )}
                <div className="col-lg-4">
                  <label style={labelStyle}>Outdoor Area (m²)</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 25" value={form.outdoor_area || ''} onChange={e => setForm({ ...form, outdoor_area: e.target.value })} />
                </div>
                <div className="col-lg-4">
                  <label style={labelStyle}>Rooms</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 4" value={form.rooms} onChange={e => setForm({ ...form, rooms: e.target.value })} />
                </div>
                <div className="col-lg-4">
                  <label style={labelStyle}>Bedrooms</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 3" value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })} />
                </div>
                <div className="col-lg-4">
                  <label style={labelStyle}>Bathrooms</label>
                  <input style={inputStyle} type="number" placeholder="e.g. 2" value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })} />
                </div>
                {/* Floor / Etage — apartments only */}
                {type === 'apartment' && (
                  <div className="col-lg-4">
                    <label style={labelStyle}>Floor / Etage</label>
                    <input style={inputStyle} placeholder="e.g. 3. OG, EG, Dachgeschoss" value={form.floor || ''} onChange={e => setForm({ ...form, floor: e.target.value })} />
                  </div>
                )}
              </>
            )
          })()}

          <div className="col-lg-4">
            <label style={labelStyle}>Status</label>
            <select style={inputStyle} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option>Active</option>
              <option>Pending</option>
              <option>Sold</option>
            </select>
          </div>
          <div className="col-lg-8">
            <label style={labelStyle}>Commission / Provision</label>
            <input style={inputStyle} placeholder="e.g. 3% zzgl. 20% USt" value={form.commission || ''} onChange={e => setForm({ ...form, commission: e.target.value })} />
          </div>
          <div className="col-lg-12">
            <label style={labelStyle}>Extras</label>
            <input style={inputStyle} placeholder="e.g. Garage, Balkon, Garten, Keller" value={form.extras || ''} onChange={e => setForm({ ...form, extras: e.target.value })} />
          </div>
          <style>{`
            /* Rich-text editors: full width, tall, readable on the dark
               admin theme, with spaces & line breaks kept visible. */
            .col-lg-6:has(> .prop-lang-quill) {
              flex: 0 0 100%;
              max-width: 100%;
            }
            .prop-lang-quill .ql-toolbar {
              background: #131b2b;
              border-color: rgba(255,255,255,0.18);
              border-radius: 10px 10px 0 0;
            }
            .prop-lang-quill .ql-toolbar .ql-stroke { stroke: #cbd5e1; }
            .prop-lang-quill .ql-toolbar .ql-fill { fill: #cbd5e1; }
            .prop-lang-quill .ql-toolbar .ql-picker-label { color: #cbd5e1; }
            .prop-lang-quill .ql-container {
              border-color: rgba(255,255,255,0.18);
              border-radius: 0 0 10px 10px;
              font-size: 15px;
            }
            .prop-lang-quill .ql-editor {
              min-height: 220px;
              background: #0f1623;
              color: #f1f5f9;
              line-height: 1.7;
              white-space: pre-wrap;
              tab-size: 4;
            }
            .prop-lang-quill .ql-editor p { margin-bottom: 12px; }
            .prop-lang-quill .ql-editor.ql-blank::before {
              color: #64748b;
              font-style: normal;
            }
          `}</style>
          <div className="col-lg-6">
            <label style={labelStyle}>Description <span style={langTag('de')}>DE</span></label>
            <div className="prop-lang-quill" style={{ marginBottom: '16px' }}>
              <QuillEditor
                key={`description-de-${editId || 'new'}`}
                value={form.description}
                onChange={val => setForm({ ...form, description: val })}
                placeholder="Short description..."
              />
            </div>
          </div>
          <div className="col-lg-6">
            <label style={labelStyle}>Description <span style={langTag('en')}>EN</span></label>
            <div className="prop-lang-quill" style={{ marginBottom: '16px' }}>
              <QuillEditor
                key={`description-en-${editId || 'new'}`}
                value={form.description_en}
                onChange={val => setForm({ ...form, description_en: val })}
                placeholder="Short description..."
              />
            </div>
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

          {/* Apartment Images — only for apartment listings, multiple */}
          {(form.property_type || 'villa') === 'apartment' && (
            <div className="col-lg-12">
              <div style={sectionStyle}>
                <label style={{ ...labelStyle, marginBottom: '12px', fontSize: '14px' }}>
                  <i className="fa fa-building" style={{ marginRight: '8px', color: '#60a5fa' }} />
                  Apartment Images
                </label>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-start' }}>

                  {/* Already uploaded */}
                  {existingApartmentImages.map(img => (
                    <div key={img.id} style={{ position: 'relative' }}>
                      <img src={`${API}${img.image}`} alt="" style={{ width: '90px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <button type="button" onClick={() => onDeleteApartmentImage(img.id)} style={removeBtn}>×</button>
                    </div>
                  ))}

                  {/* Newly picked (not yet uploaded) */}
                  {apartmentFiles.map((file, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={URL.createObjectURL(file)} alt="" style={{ width: '90px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #2563eb' }} />
                      <button type="button" onClick={() => onApartmentRemove(i)} style={removeBtn}>×</button>
                      <span style={{ position: 'absolute', bottom: '3px', left: '3px', background: '#2563eb', color: '#fff', fontSize: '9px', padding: '1px 4px', borderRadius: '4px', fontWeight: '700' }}>NEW</span>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => apartmentInputRef.current.click()}
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

                <input ref={apartmentInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleApartmentPick} />
                <p style={{ color: '#64748b', fontSize: '12px', margin: '10px 0 0' }}>Shown only on apartment detail pages — click + to add one by one, JPG/PNG/WEBP, max 5MB each</p>
              </div>
            </div>
          )}

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

          <div className="col-lg-6">
            <label style={labelStyle}>Location Details <span style={langTag('de')}>DE</span></label>
            <div className="prop-lang-quill" style={{ marginBottom: '16px' }}>
              <QuillEditor
                key={`location_details-de-${editId || 'new'}`}
                value={form.location_details}
                onChange={val => setForm({ ...form, location_details: val })}
                placeholder="Location description..."
              />
            </div>
          </div>
          <div className="col-lg-6">
            <label style={labelStyle}>Location Details <span style={langTag('en')}>EN</span></label>
            <div className="prop-lang-quill" style={{ marginBottom: '16px' }}>
              <QuillEditor
                key={`location_details-en-${editId || 'new'}`}
                value={form.location_details_en}
                onChange={val => setForm({ ...form, location_details_en: val })}
                placeholder="Location description..."
              />
            </div>
          </div>
          <div className="col-lg-6">
            <label style={labelStyle}>Features <span style={langTag('de')}>DE</span></label>
            <div className="prop-lang-quill" style={{ marginBottom: '16px' }}>
              <QuillEditor
                key={`features-de-${editId || 'new'}`}
                value={form.features}
                onChange={val => setForm({ ...form, features: val })}
                placeholder="Property features..."
              />
            </div>
          </div>
          <div className="col-lg-6">
            <label style={labelStyle}>Features <span style={langTag('en')}>EN</span></label>
            <div className="prop-lang-quill" style={{ marginBottom: '16px' }}>
              <QuillEditor
                key={`features-en-${editId || 'new'}`}
                value={form.features_en}
                onChange={val => setForm({ ...form, features_en: val })}
                placeholder="Property features..."
              />
            </div>
          </div>
          <div className="col-lg-6">
            <label style={labelStyle}>Information <span style={langTag('de')}>DE</span></label>
            <div className="prop-lang-quill" style={{ marginBottom: '16px' }}>
              <QuillEditor
                key={`information-de-${editId || 'new'}`}
                value={form.information}
                onChange={val => setForm({ ...form, information: val })}
                placeholder="Additional information..."
              />
            </div>
          </div>
          <div className="col-lg-6">
            <label style={labelStyle}>Information <span style={langTag('en')}>EN</span></label>
            <div className="prop-lang-quill" style={{ marginBottom: '16px' }}>
              <QuillEditor
                key={`information-en-${editId || 'new'}`}
                value={form.information_en}
                onChange={val => setForm({ ...form, information_en: val })}
                placeholder="Additional information..."
              />
            </div>
          </div>

          {/* Sales toggle */}
          <div className="col-lg-12" style={{ marginBottom: '20px' }}>
            {(() => {
              const on = form.show_in_sales == 1 || form.show_in_sales === true
              return (
                <div
                  onClick={() => setForm({ ...form, show_in_sales: !on })}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{
                    width: '44px', height: '24px', borderRadius: '12px', flexShrink: 0,
                    background: on ? '#2563eb' : 'rgba(255,255,255,0.12)',
                    border: `1px solid ${on ? '#2563eb' : 'rgba(255,255,255,0.25)'}`,
                    position: 'relative', transition: 'background 0.2s, border-color 0.2s',
                  }}>
                    <div style={{
                      position: 'absolute', top: '3px',
                      left: on ? '22px' : '3px',
                      width: '16px', height: '16px', borderRadius: '50%',
                      background: '#fff',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                      transition: 'left 0.2s',
                    }} />
                  </div>
                  <span style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '600' }}>
                    Show in Sales Page
                    <span style={{ color: '#64748b', fontWeight: '400', fontSize: '12px', marginLeft: '6px' }}>(Verkauf)</span>
                  </span>
                </div>
              )
            })()}
          </div>

          {/* Homepage toggle — controls the 3-property showcase on the homepage */}
          <div className="col-lg-12" style={{ marginBottom: '20px' }}>
            {(() => {
              const on = form.show_on_homepage == 1 || form.show_on_homepage === true
              return (
                <div
                  onClick={() => setForm({ ...form, show_on_homepage: !on })}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{
                    width: '44px', height: '24px', borderRadius: '12px', flexShrink: 0,
                    background: on ? '#2563eb' : 'rgba(255,255,255,0.12)',
                    border: `1px solid ${on ? '#2563eb' : 'rgba(255,255,255,0.25)'}`,
                    position: 'relative', transition: 'background 0.2s, border-color 0.2s',
                  }}>
                    <div style={{
                      position: 'absolute', top: '3px',
                      left: on ? '22px' : '3px',
                      width: '16px', height: '16px', borderRadius: '50%',
                      background: '#fff',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                      transition: 'left 0.2s',
                    }} />
                  </div>
                  <span style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '600' }}>
                    Show on Homepage
                    <span style={{ color: '#64748b', fontWeight: '400', fontSize: '12px', marginLeft: '6px' }}>(3-property showcase)</span>
                  </span>
                </div>
              )
            })()}
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
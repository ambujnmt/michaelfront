'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import adminApi from '@/lib/adminApi'
import PropertyForm from './PropertyForm'
import Swal from 'sweetalert2'

import { API_URL as API } from '@/service/config'
const emptyForm = { title: '', location: '', price: '', size: '', plot_size: '', outdoor_area: '', rooms: '', bedrooms: '', bathrooms: '', status: 'Active', property_type: 'villa', description: '', image: '', show_in_sales: false, show_on_homepage: false, location_details: '', features: '', information: '', title_en: '', location_en: '', description_en: '', location_details_en: '', features_en: '', information_en: '', floor: '', commission: '', extras: '' }
const statusColor = { Active: '#34d399', Sold: '#94a3b8', Pending: '#fbbf24' }
const thStyle = { padding: '14px 18px', color: '#94a3b8', fontWeight: '700', textAlign: 'left', fontSize: '12px', letterSpacing: '0.8px', textTransform: 'uppercase' }
const tdStyle = (extra = {}) => ({ padding: '15px 18px', fontSize: '14px', color: '#cbd5e1', ...extra })
const labelStyle = { color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }
const valueStyle = { color: '#f1f5f9', fontSize: '15px', fontWeight: '600', margin: 0 }

// ── Modal Wrapper ────────────────────────────────────────────
function Modal({ title, onClose, children, wide }) {
  return (
    <>
    <style>{`.prop-modal-wrap::-webkit-scrollbar{display:none}`}</style>
    <div className="prop-modal-wrap" style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.82)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      zIndex: 9999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: wide ? '24px 20px' : '40px 16px', overflowY: 'auto',
      msOverflowStyle: 'none', scrollbarWidth: 'none',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#1e2a3a',
        borderRadius: '20px',
        width: '100%',
        maxWidth: wide ? 'none' : '680px',
        border: '1px solid rgba(99,179,237,0.25)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 28px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', borderRadius: '20px 20px 0 0' }}>
          <h3 style={{ color: '#f1f5f9', margin: 0, fontSize: '17px', fontWeight: '700', letterSpacing: '0.02em' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1', width: '34px', height: '34px', borderRadius: '10px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', fontWeight: '700', lineHeight: 1 }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = '#f87171' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#cbd5e1' }}>
            ×
          </button>
        </div>
        {/* Modal Body */}
        <div style={{ padding: '28px' }}>{children}</div>
      </div>
    </div>
    </>
  )
}

// ── View Modal Content ───────────────────────────────────────
function ViewContent({ property, gallery }) {
  const cardStyle = { background: '#1a1f2e', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }
  return (
    <>
      <div className="row g-3">
        <div className="col-lg-7">
          {property.image
            ? <img src={`${API}${property.image}`} alt="banner" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '10px' }} />
            : <div style={{ width: '100%', height: '200px', background: '#0f1623', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa fa-image" style={{ color: '#334155', fontSize: '40px' }} />
              </div>
          }
        </div>
        <div className="col-lg-5">
          <div style={cardStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <p style={labelStyle}>Price</p>
                <p style={{ ...valueStyle, fontSize: '20px', color: '#34d399' }}>€ {Number(property.price).toLocaleString()}</p>
              </div>
              <div>
                <p style={labelStyle}>Status</p>
                <span style={{ background: (statusColor[property.status] || '#94a3b8') + '20', color: statusColor[property.status] || '#94a3b8', border: `1px solid ${(statusColor[property.status] || '#94a3b8')}50`, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>{property.status}</span>
              </div>
              <div>
                <p style={labelStyle}>Type</p>
                <p style={valueStyle}>{property.property_type || '—'}</p>
              </div>
              <div>
                <p style={labelStyle}>Location</p>
                <p style={valueStyle}>{property.location}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><p style={labelStyle}>Living Area</p><p style={valueStyle}>{property.size ? `${property.size} m²` : '—'}</p></div>
                <div><p style={labelStyle}>Land Area</p><p style={valueStyle}>{property.plot_size ? `${property.plot_size} m²` : '—'}</p></div>
                <div><p style={labelStyle}>Outdoor Area</p><p style={valueStyle}>{property.outdoor_area ? `${property.outdoor_area} m²` : '—'}</p></div>
                <div><p style={labelStyle}>Rooms</p><p style={valueStyle}>{property.rooms || '—'}</p></div>
                <div><p style={labelStyle}>Bedrooms</p><p style={valueStyle}>{property.bedrooms || '—'}</p></div>
                <div><p style={labelStyle}>Bathrooms</p><p style={valueStyle}>{property.bathrooms || '—'}</p></div>
                {property.property_type === 'apartment' && (
                  <div><p style={labelStyle}>Floor</p><p style={valueStyle}>{property.floor || '—'}</p></div>
                )}
              </div>
              {(property.commission || property.extras) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                  {property.commission && (
                    <div><p style={labelStyle}>Commission</p><p style={valueStyle}>{property.commission}</p></div>
                  )}
                  {property.extras && (
                    <div><p style={labelStyle}>Extras</p><p style={valueStyle}>{property.extras}</p></div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {property.description && (
          <div className="col-12">
            <div style={cardStyle}>
              <p style={{ ...labelStyle, marginBottom: '8px' }}>Description</p>
              <style>{`.desc-view *{max-width:100%;word-break:break-word;overflow-wrap:break-word;color:#cbd5e1;font-size:14px;line-height:1.7} .desc-view p{margin:0 0 8px}`}</style>
              <div
                className="desc-view"
                dangerouslySetInnerHTML={{ __html: property.description }}
              />
            </div>
          </div>
        )}

        {(property.title_en || property.location_en || property.description_en) && (
          <div className="col-12">
            <div style={cardStyle}>
              <p style={{ ...labelStyle, marginBottom: '10px', color: '#60a5fa' }}>English</p>
              {property.title_en && (
                <div style={{ marginBottom: '10px' }}>
                  <p style={labelStyle}>Title</p>
                  <p style={valueStyle}>{property.title_en}</p>
                </div>
              )}
              {property.location_en && (
                <div style={{ marginBottom: '10px' }}>
                  <p style={labelStyle}>Location</p>
                  <p style={valueStyle}>{property.location_en}</p>
                </div>
              )}
              {property.description_en && (
                <div>
                  <p style={{ ...labelStyle, marginBottom: '8px' }}>Description</p>
                  <div className="desc-view" dangerouslySetInnerHTML={{ __html: property.description_en }} />
                </div>
              )}
            </div>
          </div>
        )}

        {gallery.length > 0 && (
          <div className="col-12">
            <div style={cardStyle}>
              <p style={{ ...labelStyle, marginBottom: '12px' }}>Gallery ({gallery.length})</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {gallery.map(img => (
                  <img key={img.id} src={`${API}${img.image}`} alt="" style={{ width: '110px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)' }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// ── Sales / Homepage Toggle ───────────────────────────────────
function SalesToggle({ property, field, onChange }) {
  const [on, setOn] = useState(property[field] == 1)
  const [busy, setBusy] = useState(false)

  const toggle = async () => {
    if (busy) return
    setBusy(true)
    const next = !on
    setOn(next)
    await adminApi.updateProperty(property.id, { ...property, [field]: next })
    onChange()
    setBusy(false)
  }

  return (
    <div onClick={toggle} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: busy ? 'wait' : 'pointer', userSelect: 'none' }}>
      <div style={{
        width: '38px', height: '21px', borderRadius: '11px', flexShrink: 0, position: 'relative',
        background: on ? '#2563eb' : 'rgba(255,255,255,0.1)',
        border: `1px solid ${on ? '#2563eb' : 'rgba(255,255,255,0.2)'}`,
        transition: 'background 0.2s, border-color 0.2s',
        opacity: busy ? 0.6 : 1,
      }}>
        <div style={{
          position: 'absolute', top: '2px',
          left: on ? '19px' : '2px',
          width: '15px', height: '15px', borderRadius: '50%',
          background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
          transition: 'left 0.2s',
        }} />
      </div>
      <span style={{ fontSize: '12px', color: on ? '#60a5fa' : '#475569', fontWeight: '600' }}>
        {on ? 'On' : 'Off'}
      </span>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────
export default function Properties() {
  const [properties, setProperties] = useState([])
  const [flash, setFlash] = useState(null)
  const flashRef = useRef(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  // Modal state
  const [modal, setModal] = useState(null) // 'add' | 'edit' | 'view'
  const [modalLoading, setModalLoading] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])
  const [existingGallery, setExistingGallery] = useState([])
  const [apartmentFiles, setApartmentFiles] = useState([])
  const [existingApartmentImages, setExistingApartmentImages] = useState([])
  const [viewProperty, setViewProperty] = useState(null)
  const [viewGallery, setViewGallery] = useState([])

  const showFlash = (type, msg) => {
    setFlash({ type, msg })
    setTimeout(() => flashRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    setTimeout(() => setFlash(null), 4000)
  }

  const fetchProperties = () => {
    adminApi.getProperties().then(data => { if (data.success) setProperties(data.data) })
  }

  useEffect(() => { fetchProperties() }, [])

  const closeModal = () => {
    setModal(null)
    setForm(emptyForm)
    setEditId(null)
    setBannerFile(null)
    setGalleryFiles([])
    setExistingGallery([])
    setApartmentFiles([])
    setExistingApartmentImages([])
    setViewProperty(null)
    setViewGallery([])
  }

  // ── Open Add ──
  const openAdd = () => {
    setForm(emptyForm)
    setBannerFile(null)
    setGalleryFiles([])
    setApartmentFiles([])
    setExistingApartmentImages([])
    setModal('add')
  }

  // ── Open Edit ──
  const openEdit = async (id) => {
    setEditId(id)
    setModal('edit')
    setModalLoading(true)
    const [propRes, imgRes, aptRes] = await Promise.all([
      adminApi.getProperty(id),
      adminApi.getPropertyImages(id),
      adminApi.getApartmentImages(id),
    ])
    if (propRes.success) {
      const p = propRes.data
      setForm({ title: p.title, location: p.location, price: p.price, size: p.size, plot_size: p.plot_size ?? '', outdoor_area: p.outdoor_area ?? '', rooms: p.rooms, bedrooms: p.bedrooms || 0, bathrooms: p.bathrooms || 0, status: p.status, property_type: p.property_type || 'villa', description: p.description || '', image: p.image || '', show_in_sales: p.show_in_sales == 1, show_on_homepage: p.show_on_homepage == 1, location_details: p.location_details || '', features: p.features || '', information: p.information || '', title_en: p.title_en || '', location_en: p.location_en || '', description_en: p.description_en || '', location_details_en: p.location_details_en || '', features_en: p.features_en || '', information_en: p.information_en || '', floor: p.floor || '', commission: p.commission || '', extras: p.extras || '' })
    }
    if (imgRes.success) setExistingGallery(imgRes.data)
    if (aptRes.success) setExistingApartmentImages(aptRes.data)
    setModalLoading(false)
  }

  // ── Open View ──
  const openView = async (id) => {
    setModal('view')
    setModalLoading(true)
    const [propRes, imgRes] = await Promise.all([adminApi.getProperty(id), adminApi.getPropertyImages(id)])
    if (propRes.success) setViewProperty(propRes.data)
    if (imgRes.success) setViewGallery(imgRes.data)
    setModalLoading(false)
  }

  // ── Submit Add ──
  const handleAdd = async (e) => {
    e.preventDefault()
    setModalLoading(true)
    try {
      const res = await adminApi.addProperty(form)
      if (!res.success) { Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Failed', background: '#1a1f2e', color: '#f1f5f9' }); setModalLoading(false); return }
      if (bannerFile) { const fd = new FormData(); fd.append('banner', bannerFile); await adminApi.uploadBanner(res.id, fd) }
      if (galleryFiles.length > 0) { const fd = new FormData(); galleryFiles.forEach(f => fd.append('images', f)); await adminApi.uploadGalleryImages(res.id, fd) }
      if (apartmentFiles.length > 0 && form.property_type === 'apartment') { const fd = new FormData(); apartmentFiles.forEach(f => fd.append('apartment_images', f)); await adminApi.uploadApartmentImages(res.id, fd) }
      closeModal()
      fetchProperties()
      showFlash('success', 'Property added successfully!')
    } catch { Swal.fire({ icon: 'error', title: 'Error', text: 'Network error', background: '#1a1f2e', color: '#f1f5f9' }) }
    setModalLoading(false)
  }

  // ── Submit Edit ──
  const handleEdit = async (e) => {
    e.preventDefault()
    setModalLoading(true)
    try {
      const res = await adminApi.updateProperty(editId, form)
      if (!res.success) { Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Failed', background: '#1a1f2e', color: '#f1f5f9' }); setModalLoading(false); return }
      if (bannerFile) { const fd = new FormData(); fd.append('banner', bannerFile); await adminApi.uploadBanner(editId, fd) }
      if (galleryFiles.length > 0) { const fd = new FormData(); galleryFiles.forEach(f => fd.append('images', f)); await adminApi.uploadGalleryImages(editId, fd) }
      if (apartmentFiles.length > 0 && form.property_type === 'apartment') { const fd = new FormData(); apartmentFiles.forEach(f => fd.append('apartment_images', f)); await adminApi.uploadApartmentImages(editId, fd) }
      closeModal()
      fetchProperties()
      showFlash('success', 'Property updated successfully!')
    } catch { Swal.fire({ icon: 'error', title: 'Error', text: 'Network error', background: '#1a1f2e', color: '#f1f5f9' }) }
    setModalLoading(false)
  }

  // ── Delete ──
  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: 'Delete Property?', text: 'This action cannot be undone.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Yes, Delete', cancelButtonText: 'Cancel', confirmButtonColor: '#ef4444', cancelButtonColor: '#334155', background: '#1a1f2e', color: '#f1f5f9' })
    if (!result.isConfirmed) return
    const res = await adminApi.deleteProperty(id)
    if (res.success) { showFlash('success', 'Property deleted successfully!'); fetchProperties() }
    else showFlash('error', res.message || 'Failed to delete')
  }

  const handleDeleteGallery = async (imageId) => {
    const res = await adminApi.deleteGalleryImage(imageId)
    if (res.success) setExistingGallery(prev => prev.filter(img => img.id !== imageId))
  }

  const handleDeleteApartmentImage = async (imageId) => {
    const res = await adminApi.deleteApartmentImage(imageId)
    if (res.success) setExistingApartmentImages(prev => prev.filter(img => img.id !== imageId))
  }

  const filtered = properties.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.title?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'All' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <>
      {/* Flash */}
      {flash && (
        <div ref={flashRef} style={{ background: flash.type === 'success' ? 'rgba(52,211,153,0.12)' : 'rgba(239,68,68,0.12)', border: `1px solid ${flash.type === 'success' ? 'rgba(52,211,153,0.4)' : 'rgba(239,68,68,0.4)'}`, color: flash.type === 'success' ? '#34d399' : '#f87171', padding: '13px 18px', borderRadius: '12px', marginBottom: '18px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className={`fa fa-${flash.type === 'success' ? 'check-circle' : 'exclamation-circle'}`} />{flash.msg}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '10px', flex: 1, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <i className="fa fa-search" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '13px' }} />
            <input type="text" placeholder="Search by title or location..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              style={{ width: '100%', padding: '10px 14px 10px 36px', background: '#141824', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            style={{ padding: '10px 14px', background: '#141824', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', cursor: 'pointer', outline: 'none' }}>
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Sold">Sold</option>
          </select>
        </div>
        <button onClick={openAdd} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#2563eb', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.5)', whiteSpace: 'nowrap' }}>
          <i className="fa fa-plus" />Add Property
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#1a1f2e', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: '#141824' }}>
              {['#', 'Banner', 'Title', 'Location', 'Sales', 'Homepage', 'Status', 'Actions'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="8" style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontSize: '15px' }}>
                <i className="fa fa-search" style={{ fontSize: '32px', display: 'block', marginBottom: '12px', color: '#334155' }} />
                {search || statusFilter !== 'All' ? 'No matching properties found' : 'No properties found'}
              </td></tr>
            ) : paginated.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={tdStyle({ color: '#64748b', fontWeight: '600' })}>{(page - 1) * PER_PAGE + i + 1}</td>
                <td style={tdStyle()}>
                  {p.image
                    ? <img src={`${API}${p.image}`} alt="banner" style={{ width: '72px', height: '48px', objectFit: 'cover', borderRadius: '6px', display: 'block' }} />
                    : <div style={{ width: '72px', height: '48px', background: '#1e293b', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa fa-image" style={{ color: '#334155', fontSize: '18px' }} />
                      </div>
                  }
                </td>
                <td style={tdStyle({ color: '#f1f5f9', fontWeight: '700' })}>
                  <Link href={`/immobilien/${p.slug}`} target="_blank" style={{ color: '#f1f5f9', textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#60a5fa'}
                    onMouseLeave={e => e.currentTarget.style.color = '#f1f5f9'}>
                    {p.title}
                  </Link>
                </td>
                <td style={tdStyle()}><i className="fa fa-map-marker" style={{ marginRight: '7px', color: '#60a5fa' }} />{p.location}</td>
                <td style={tdStyle()}>
                  <SalesToggle property={p} field="show_in_sales" onChange={fetchProperties} />
                </td>
                <td style={tdStyle()}>
                  <SalesToggle property={p} field="show_on_homepage" onChange={fetchProperties} />
                </td>
                <td style={tdStyle()}>
                  <span style={{ background: statusColor[p.status] + '20', color: statusColor[p.status], border: `1px solid ${statusColor[p.status]}50`, padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>{p.status}</span>
                </td>
                <td style={tdStyle()}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => openView(p.id)} title="View"
                      style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                      <i className="fa fa-eye" />
                    </button>
                    <button onClick={() => openEdit(p.id)} title="Edit"
                      style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.35)', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                      <i className="fa fa-edit" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} title="Delete"
                      style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.35)', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                      <i className="fa fa-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>{filtered.length} / {properties.length} properties</p>
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '7px 13px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: page === 1 ? 'transparent' : '#1a1f2e', color: page === 1 ? '#334155' : '#94a3b8', cursor: page === 1 ? 'default' : 'pointer', fontSize: '13px' }}>
              <i className="fa fa-chevron-left" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)} style={{ padding: '7px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', border: n === page ? '1px solid #2563eb' : '1px solid rgba(255,255,255,0.1)', background: n === page ? '#2563eb' : '#1a1f2e', color: n === page ? '#fff' : '#94a3b8', cursor: 'pointer' }}>{n}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '7px 13px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: page === totalPages ? 'transparent' : '#1a1f2e', color: page === totalPages ? '#334155' : '#94a3b8', cursor: page === totalPages ? 'default' : 'pointer', fontSize: '13px' }}>
              <i className="fa fa-chevron-right" />
            </button>
          </div>
        )}
      </div>

      {/* ── Add Modal ── */}
      {modal === 'add' && (
        <Modal title="Add New Property" onClose={closeModal} wide>
          <PropertyForm form={form} setForm={setForm} onSubmit={handleAdd} loading={modalLoading} editId={null}
            bannerFile={bannerFile} onBannerChange={setBannerFile}
            galleryFiles={galleryFiles}
            onGalleryAdd={(file) => setGalleryFiles(prev => [...prev, file])}
            onGalleryRemove={(i) => setGalleryFiles(prev => prev.filter((_, idx) => idx !== i))}
            existingGallery={[]} onDeleteGallery={() => {}}
            apartmentFiles={apartmentFiles}
            onApartmentAdd={(file) => setApartmentFiles(prev => [...prev, file])}
            onApartmentRemove={(i) => setApartmentFiles(prev => prev.filter((_, idx) => idx !== i))}
            existingApartmentImages={[]} onDeleteApartmentImage={() => {}} />
        </Modal>
      )}

      {/* ── Edit Modal ── */}
      {modal === 'edit' && (
        <Modal title="Edit Property" onClose={closeModal} wide>
          {modalLoading || !form.title
            ? <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}><i className="fa fa-spinner fa-spin" style={{ fontSize: '28px' }} /></div>
            : <PropertyForm form={form} setForm={setForm} onSubmit={handleEdit} loading={modalLoading} editId={editId}
                bannerFile={bannerFile} onBannerChange={setBannerFile}
                galleryFiles={galleryFiles}
                onGalleryAdd={(file) => setGalleryFiles(prev => [...prev, file])}
                onGalleryRemove={(i) => setGalleryFiles(prev => prev.filter((_, idx) => idx !== i))}
                existingGallery={existingGallery} onDeleteGallery={handleDeleteGallery}
                apartmentFiles={apartmentFiles}
                onApartmentAdd={(file) => setApartmentFiles(prev => [...prev, file])}
                onApartmentRemove={(i) => setApartmentFiles(prev => prev.filter((_, idx) => idx !== i))}
                existingApartmentImages={existingApartmentImages} onDeleteApartmentImage={handleDeleteApartmentImage} />
          }
        </Modal>
      )}

      {/* ── View Modal ── */}
      {modal === 'view' && (
        <Modal title={viewProperty?.title || 'Property Detail'} onClose={closeModal} wide>
          {modalLoading || !viewProperty
            ? <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}><i className="fa fa-spinner fa-spin" style={{ fontSize: '28px' }} /></div>
            : <ViewContent property={viewProperty} gallery={viewGallery} />
          }
        </Modal>
      )}
    </>
  )
}

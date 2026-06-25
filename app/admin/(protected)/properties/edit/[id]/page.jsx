'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import adminApi from '@/lib/adminApi'
import PropertyForm from '../../PropertyForm'
import Swal from 'sweetalert2'

export default function EditProperty() {
  const router = useRouter()
  const { id } = useParams()

  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(false)
  const [bannerFile, setBannerFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])
  const [existingGallery, setExistingGallery] = useState([])

  useEffect(() => {
    const load = async () => {
      const [propRes, imgRes] = await Promise.all([
        adminApi.getProperty(id),
        adminApi.getPropertyImages(id),
      ])
      if (propRes.success) {
        const p = propRes.data
        setForm({
          title: p.title, location: p.location, price: p.price,
          size: p.size, rooms: p.rooms, bedrooms: p.bedrooms || 0,
          bathrooms: p.bathrooms || 0, status: p.status,
          property_type: p.property_type || 'villa',
          description: p.description || '', image: p.image || '',
          show_in_sales: p.show_in_sales == 1,
        })
      }
      if (imgRes.success) setExistingGallery(imgRes.data)
    }
    load()
  }, [id])

  const handleDeleteGallery = async (imageId) => {
    const res = await adminApi.deleteGalleryImage(imageId)
    if (res.success) setExistingGallery(prev => prev.filter(img => img.id !== imageId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await adminApi.updateProperty(id, form)
      if (!res.success) {
        Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Something went wrong', background: '#1a1f2e', color: '#f1f5f9' })
        setLoading(false)
        return
      }

      if (bannerFile) {
        const fd = new FormData()
        fd.append('banner', bannerFile)
        await adminApi.uploadBanner(id, fd)
      }

      if (galleryFiles.length > 0) {
        const fd = new FormData()
        Array.from(galleryFiles).forEach(f => fd.append('images', f))
        await adminApi.uploadGalleryImages(id, fd)
      }

      await Swal.fire({ icon: 'success', title: 'Updated!', text: 'Property updated successfully!', background: '#1a1f2e', color: '#f1f5f9', timer: 1800, showConfirmButton: false })
      router.push('/admin/properties')
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Network error — please try again', background: '#1a1f2e', color: '#f1f5f9' })
    }
    setLoading(false)
  }

  if (!form) {
    return (
      <div style={{ textAlign: 'center', padding: '80px', color: '#64748b', fontSize: '15px' }}>
        <i className="fa fa-spinner fa-spin" style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }} />
        Loading property...
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
        <button onClick={() => router.push('/admin/properties')} style={{
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          color: '#94a3b8', padding: '9px 16px', borderRadius: '10px',
          cursor: 'pointer', fontSize: '13px', fontWeight: '600',
        }}>
          <i className="fa fa-arrow-left" style={{ marginRight: '6px' }} />Back
        </button>
        <h2 style={{ color: '#f1f5f9', margin: 0, fontSize: '20px', fontWeight: '700' }}>Edit Property</h2>
      </div>

      <PropertyForm
        form={form} setForm={setForm}
        onSubmit={handleSubmit} loading={loading} editId={id}
        bannerFile={bannerFile} onBannerChange={setBannerFile}
        galleryFiles={galleryFiles}
        onGalleryAdd={(file) => setGalleryFiles(prev => [...prev, file])}
        onGalleryRemove={(i) => setGalleryFiles(prev => prev.filter((_, idx) => idx !== i))}
        existingGallery={existingGallery} onDeleteGallery={handleDeleteGallery}
      />
    </>
  )
}

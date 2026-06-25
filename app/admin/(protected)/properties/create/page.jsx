'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import adminApi from '@/lib/adminApi'
import PropertyForm from '../PropertyForm'
import Swal from 'sweetalert2'

const emptyForm = { title: '', location: '', price: '', size: '', rooms: '', bedrooms: '', bathrooms: '', status: 'Active', property_type: 'villa', description: '', image: '', show_in_sales: false }

export default function CreateProperty() {
  const router = useRouter()
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [bannerFile, setBannerFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await adminApi.addProperty(form)
      if (!res.success) {
        Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Something went wrong', background: '#1a1f2e', color: '#f1f5f9' })
        setLoading(false)
        return
      }

      if (bannerFile) {
        const fd = new FormData()
        fd.append('banner', bannerFile)
        await adminApi.uploadBanner(res.id, fd)
      }

      if (galleryFiles.length > 0) {
        const fd = new FormData()
        Array.from(galleryFiles).forEach(f => fd.append('images', f))
        await adminApi.uploadGalleryImages(res.id, fd)
      }

      await Swal.fire({ icon: 'success', title: 'Added!', text: 'Property added successfully!', background: '#1a1f2e', color: '#f1f5f9', timer: 1800, showConfirmButton: false })
      router.push('/admin/properties')
    } catch {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Network error — please try again', background: '#1a1f2e', color: '#f1f5f9' })
    }
    setLoading(false)
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
        <h2 style={{ color: '#f1f5f9', margin: 0, fontSize: '20px', fontWeight: '700' }}>Add New Property</h2>
      </div>

      <PropertyForm
        form={form} setForm={setForm}
        onSubmit={handleSubmit} loading={loading} editId={null}
        bannerFile={bannerFile} onBannerChange={setBannerFile}
        galleryFiles={galleryFiles}
        onGalleryAdd={(file) => setGalleryFiles(prev => [...prev, file])}
        onGalleryRemove={(i) => setGalleryFiles(prev => prev.filter((_, idx) => idx !== i))}
        existingGallery={[]} onDeleteGallery={() => {}}
      />
    </>
  )
}

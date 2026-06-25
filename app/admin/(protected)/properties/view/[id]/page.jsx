'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import adminApi from '@/lib/adminApi'

import { API_URL as API } from '@/service/config'

const statusColor = { Active: '#34d399', Sold: '#94a3b8', Pending: '#fbbf24' }

const labelStyle = { color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }
const valueStyle = { color: '#f1f5f9', fontSize: '15px', fontWeight: '600', margin: 0 }
const cardStyle = { background: '#1a1f2e', borderRadius: '14px', padding: '24px', border: '1px solid rgba(255,255,255,0.08)' }

export default function PropertyView() {
  const router = useRouter()
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminApi.getProperty(id),
      adminApi.getPropertyImages(id),
    ]).then(([propRes, imgRes]) => {
      if (propRes.success) setProperty(propRes.data)
      if (imgRes.success) setGallery(imgRes.data)
      setLoading(false)
    })
  }, [id])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#64748b' }}>
      <i className="fa fa-spinner fa-spin" style={{ fontSize: '32px' }} />
    </div>
  )

  if (!property) return (
    <div style={{ textAlign: 'center', padding: '80px', color: '#f87171' }}>Property not found.</div>
  )

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ color: '#f1f5f9', fontWeight: '700', fontSize: '20px', margin: 0 }}>{property.title}</h2>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0' }}>
            <i className="fa fa-map-marker" style={{ marginRight: '6px', color: '#60a5fa' }} />
            {property.location}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => router.push(`/admin/properties/edit/${id}`)} style={{
            background: 'rgba(96,165,250,0.15)', color: '#60a5fa',
            border: '1px solid rgba(96,165,250,0.35)',
            padding: '9px 20px', borderRadius: '10px',
            cursor: 'pointer', fontSize: '13px', fontWeight: '600',
          }}>
            <i className="fa fa-pencil" style={{ marginRight: '6px' }} />Edit
          </button>
          <button onClick={() => router.push('/admin/properties')} style={{
            background: 'rgba(255,255,255,0.06)', color: '#94a3b8',
            border: '1px solid rgba(255,255,255,0.12)',
            padding: '9px 20px', borderRadius: '10px',
            cursor: 'pointer', fontSize: '13px', fontWeight: '600',
          }}>
            <i className="fa fa-arrow-left" style={{ marginRight: '6px' }} />Back
          </button>
        </div>
      </div>

      <div className="row g-4">

        {/* Banner */}
        <div className="col-lg-8">
          <div style={cardStyle}>
            {property.image
              ? <img src={`${API}${property.image}`} alt="banner"
                  style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', borderRadius: '10px' }} />
              : <div style={{ width: '100%', height: '260px', background: '#0f1623', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa fa-image" style={{ color: '#334155', fontSize: '48px' }} />
                </div>
            }
          </div>
        </div>

        {/* Key Details */}
        <div className="col-lg-4">
          <div style={{ ...cardStyle, height: '100%' }}>
            <h5 style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '20px' }}>Details</h5>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              <div>
                <p style={labelStyle}>Price</p>
                <p style={{ ...valueStyle, fontSize: '22px', color: '#34d399' }}>€ {Number(property.price).toLocaleString()}</p>
              </div>

              <div>
                <p style={labelStyle}>Status</p>
                <span style={{
                  background: (statusColor[property.status] || '#94a3b8') + '20',
                  color: statusColor[property.status] || '#94a3b8',
                  border: `1px solid ${(statusColor[property.status] || '#94a3b8')}50`,
                  padding: '5px 14px', borderRadius: '20px',
                  fontSize: '12px', fontWeight: '700',
                }}>{property.status}</span>
              </div>

              <div>
                <p style={labelStyle}>Type</p>
                <p style={valueStyle}>{property.property_type || '—'}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <p style={labelStyle}>Size</p>
                  <p style={valueStyle}>{property.size ? `${property.size} m²` : '—'}</p>
                </div>
                <div>
                  <p style={labelStyle}>Rooms</p>
                  <p style={valueStyle}>{property.rooms || '—'}</p>
                </div>
                <div>
                  <p style={labelStyle}>Bedrooms</p>
                  <p style={valueStyle}>{property.bedrooms || '—'}</p>
                </div>
                <div>
                  <p style={labelStyle}>Bathrooms</p>
                  <p style={valueStyle}>{property.bathrooms || '—'}</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Description */}
        {property.description && (
          <div className="col-12">
            <div style={cardStyle}>
              <h5 style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '16px' }}>Description</h5>
              <style>{`
                .desc-content { color: #cbd5e1; font-size: 15px; line-height: 28px; word-break: break-word; overflow-wrap: break-word; }
                .desc-content * { max-width: 100%; box-sizing: border-box; }
                .desc-content p { margin: 0 0 10px; color: #cbd5e1; }
                .desc-content h1, .desc-content h2, .desc-content h3 { color: #f1f5f9; margin: 14px 0 8px; }
                .desc-content ul, .desc-content ol { padding-left: 22px; margin: 8px 0; }
                .desc-content li { color: #cbd5e1; margin-bottom: 4px; }
                .desc-content a { color: #60a5fa; }
                .desc-content blockquote { border-left: 3px solid #334155; padding-left: 14px; margin: 10px 0; color: #94a3b8; }
                .desc-content img { max-width: 100%; height: auto; border-radius: 8px; display: block; }
              `}</style>
              <div
                className="desc-content"
                dangerouslySetInnerHTML={{ __html: property.description }}
              />
            </div>
          </div>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <div className="col-12">
            <div style={cardStyle}>
              <h5 style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '16px' }}>
                Gallery ({gallery.length})
              </h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {gallery.map(img => (
                  <img key={img.id} src={`${API}${img.image}`} alt=""
                    style={{ width: '140px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }} />
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}

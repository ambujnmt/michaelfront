'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import websiteApi from '@/lib/websiteApi'
import { useLanguage } from '@/lib/LanguageContext'
import translations from '@/lib/translations'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7001'

export default function BlogDetail() {
  const { slug } = useParams()
  const router = useRouter()
  const { lang } = useLanguage()
  const t = useMemo(() => translations.blogDetail[lang], [lang])

  const [post, setPost] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    websiteApi.getBlog(slug)
      .then(d => {
        if (d.success) {
          setPost(d.data)
          return websiteApi.getBlogs()
        } else {
          setNotFound(true)
        }
      })
      .then(d => {
        if (d?.success) setRelated(d.data.filter(p => p.slug !== slug).slice(0, 3))
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  const fmt = useCallback((d) => d
    ? new Date(d).toLocaleDateString(lang === 'de' ? 'de-AT' : 'en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : '', [lang])

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #eee', borderTop: '3px solid #333', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color: '#999', fontSize: '14px' }}>{t.loading}</p>
      </div>
    </div>
  )

  if (notFound || !post) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontFamily: 'var(--head-font)', fontSize: '32px' }}>{t.notFound}</h2>
      <p style={{ color: '#666' }}>{t.notFoundSub}</p>
      <button onClick={() => router.back()} className="btn btn1" style={{ padding: '10px 28px', fontSize: '13px' }}>
        {t.goBack}
      </button>
    </div>
  )

  const imgSrc = post.image ? `${BASE_URL}${post.image}` : '/assets/img/blog1.png'

  return (
    <div style={{ paddingBottom: '80px', overflowX: 'hidden' }}>

      {/* ── Hero: Image left, Info right ── */}
      <div style={{ background: '#f8f9fc', borderBottom: '1px solid #eee', padding: '60px 0 0', overflow: 'hidden' }}>
        <div className="container">

          {/* Page Heading */}
          <div className="row mb-4">
            <div className="col-12">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h1 style={{ fontSize: '38px', fontWeight: '700', textTransform: 'uppercase', margin: 0, fontFamily: 'var(--head-font)' }}>
                  {t.pageTitle}
                </h1>
                <button onClick={() => router.back()} className="btn btn1" style={{ fontSize: '13px', padding: '8px 20px', flexShrink: 0 }}>
                  <i className="fa fa-arrow-left" style={{ marginRight: '6px' }} />
                  {t.backBtn}
                </button>
              </div>
              <p style={{ color: '#666', fontSize: '16px', margin: 0, fontFamily: 'var(--pera-font)' }}>{post.title}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '40px', paddingBottom: '48px', flexWrap: 'wrap' }}>

            {/* Left — Image */}
            <div style={{ flex: '0 0 calc(50% - 20px)', minWidth: '280px' }}>
              <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
                <img src={imgSrc} alt={post.title}
                  style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }} />
              </div>
            </div>

            {/* Right — Meta + Title + Excerpt */}
            <div style={{ flex: '1 1 280px', minWidth: '0' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', fontFamily: 'var(--pera-font)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  {post.category}
                </span>
                <span style={{ color: '#999', fontSize: '13px', fontFamily: 'var(--pera-font)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <i className="fa fa-calendar-o" />{fmt(post.created_at)}
                </span>
              </div>

              <h2 style={{ fontFamily: 'var(--head-font)', fontSize: 'clamp(22px, 3vw, 38px)', fontWeight: '700', lineHeight: '1.2', marginBottom: '20px', color: '#1a1a1a' }}>
                {post.title}
              </h2>

              {post.excerpt && (
                <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.8', borderLeft: '3px solid #4f46e5', paddingLeft: '16px', margin: '0 0 28px', fontFamily: 'var(--pera-font)', fontStyle: 'italic' }}>
                  {post.excerpt}
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '2px', background: '#4f46e5' }} />
                <span style={{ color: '#bbb', fontSize: '12px', fontFamily: 'var(--pera-font)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {t.readBelow}
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Article Body ── */}
      <div className="container" style={{ marginTop: '56px', overflowX: 'hidden' }}>
        <div className="row">
          <div className="col-12">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
              style={{ fontFamily: 'var(--pera-font)', fontSize: '16px', lineHeight: '1.9', color: '#333' }}
            />
          </div>
        </div>

        {/* ── Related Posts ── */}
        {related.length > 0 && (
          <div className="row" style={{ marginTop: '72px' }}>
            <div className="col-12" style={{ marginBottom: '32px', textAlign: 'center' }}>
              <h6 style={{ fontFamily: 'var(--head-font)', color: '#999', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px', marginBottom: '8px' }}>
                {t.relatedSub}
              </h6>
              <h3 style={{ fontFamily: 'var(--head-font)', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: '700', color: '#1a1a1a' }}>
                {t.relatedTitle}
              </h3>
            </div>
            {related.map(p => (
              <div key={p.id} className="col-lg-4 col-md-4 col-12" style={{ marginBottom: '24px' }}>
                <div className="blog-col1" style={{ padding: '16px', borderRadius: '12px', boxShadow: '0 4px 18px rgba(0,0,0,0.07)', background: '#fff', height: '100%' }}>
                  <Link href={`/blog/${p.slug}`} style={{ textDecoration: 'none' }}>
                    <img
                      src={p.image ? `${BASE_URL}${p.image}` : '/assets/img/blog1.png'}
                      alt={p.title}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                    <p><i className="fa fa-calendar" /> {fmt(p.created_at)}</p>
                    <h5>{p.title}</h5>
                    {p.excerpt && <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>{p.excerpt}</p>}
                    <button type="button" className="btn btn1">{t.readMore}</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}


      </div>

      <style>{`
        .blog-content h1,.blog-content h2,.blog-content h3,
        .blog-content h4,.blog-content h5,.blog-content h6 {
          font-family: var(--head-font);
          color: #1a1a1a;
          margin: 30px 0 14px;
          line-height: 1.3;
        }
        .blog-content h1{font-size:32px}
        .blog-content h2{font-size:26px}
        .blog-content h3{font-size:22px}
        .blog-content p{margin-bottom:18px}
        .blog-content ul,.blog-content ol{padding-left:24px;margin-bottom:18px}
        .blog-content li{margin-bottom:6px}
        .blog-content blockquote{
          border-left:4px solid #4f46e5;
          padding:14px 20px;margin:24px 0;
          background:#f8f7ff;border-radius:0 10px 10px 0;
          color:#555;font-style:italic;
        }
        .blog-content a{color:#4f46e5;text-decoration:underline}
        .blog-content img{max-width:100%;border-radius:10px;margin:16px 0}
        .blog-content strong{color:#1a1a1a}
      `}</style>

    </div>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import adminApi from '@/lib/adminApi'
import Swal from 'sweetalert2'

const QuillEditor = dynamic(() => import('@/app/components/admin/QuillEditor'), { ssr: false })

import { BASE_URL } from '@/service/config'

const thStyle = { padding: '14px 18px', color: '#94a3b8', fontWeight: '700', textAlign: 'left', fontSize: '12px', letterSpacing: '0.8px', textTransform: 'uppercase' }
const tdStyle = (extra = {}) => ({ padding: '15px 18px', fontSize: '14px', color: '#cbd5e1', ...extra })

function Label({ children }) {
  return <p style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 5px' }}>{children}</p>
}

const CATEGORIES = ['General', 'Real Estate', 'Market News', 'Tips & Advice', 'Investment', 'Lifestyle']

const statusMap = {
  Published: { bg: 'rgba(34,197,94,0.15)',   color: '#4ade80' },
  Draft:     { bg: 'rgba(234,179,8,0.15)',    color: '#facc15' },
  Archived:  { bg: 'rgba(156,163,175,0.15)',  color: '#9ca3af' },
}

const emptyForm = { title: '', slug: '', excerpt: '', content: '', category: 'General', status: 'Draft' }

const clientSlugify = (str) =>
  str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')

function BlogModal({ post, mode, onClose, onSaved }) {
  const [form, setForm] = useState(post ? { title: post.title || '', slug: post.slug || '', excerpt: post.excerpt || '', content: post.content || '', category: post.category || 'General', status: post.status || 'Draft' } : emptyForm)
  const [slugManual, setSlugManual] = useState(!!post?.slug)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(post?.image ? `${BASE_URL}${post.image}` : null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setImageFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSave = async (overrideStatus) => {
    if (!form.title.trim()) { Swal.fire('Validation', 'Title is required.', 'warning'); return }
    if (!form.slug.trim()) { Swal.fire('Validation', 'Slug is required.', 'warning'); return }
    setSaving(true)
    const fd = new FormData()
    const finalForm = overrideStatus ? { ...form, status: overrideStatus } : form
    Object.entries(finalForm).forEach(([k, v]) => fd.append(k, v ?? ''))
    if (imageFile) fd.append('image', imageFile)
    const res = mode === 'add' ? await adminApi.createBlog(fd) : await adminApi.updateBlog(post.id, fd)
    setSaving(false)
    if (res.success) { onSaved(); onClose() }
    else Swal.fire('Error', res.message || 'Failed', 'error')
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(4px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', boxSizing: 'border-box' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="hide-scroll" style={{ background: '#1e2a3a', borderRadius: '20px', width: '100%', maxWidth: '720px', maxHeight: '92vh', overflowY: 'auto', border: '1px solid rgba(99,179,237,0.25)', boxShadow: '0 32px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', borderRadius: '20px 20px 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa fa-pencil-square-o" style={{ color: '#60a5fa', fontSize: '13px' }} />
            </div>
            <h3 style={{ color: '#f1f5f9', margin: 0, fontSize: '16px', fontWeight: '700' }}>{mode === 'add' ? 'New Blog Post' : 'Edit Blog Post'}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; e.currentTarget.style.color = '#f87171' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#94a3b8' }}>×</button>
        </div>
        {/* Body */}
        <div style={{ padding: '24px' }}>
          {/* Row 1: Title + Image */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '15px' }}>
            <div>
              <Label>Title *</Label>
              <input value={form.title} onChange={e => {
                const t = e.target.value
                setForm(f => ({ ...f, title: t, slug: slugManual ? f.slug : clientSlugify(t) }))
              }} placeholder="Blog post title"
                style={{ width: '100%', padding: '11px 14px', background: '#0f1623', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
            </div>
            <div>
              <Label>Featured Image</Label>
              <div onClick={() => fileRef.current.click()} style={{ border: '2px dashed rgba(96,165,250,0.3)', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(96,165,250,0.04)', gap: '8px', color: '#475569', fontSize: '13px' }}>
                {preview
                  ? <><i className="fa fa-check-circle" style={{ color: '#4ade80' }} /><span style={{ color: '#4ade80' }}>Image selected</span></>
                  : <><i className="fa fa-upload" /><span>Click to upload</span></>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
            </div>
          </div>

          {/* Slug row */}
          <div style={{ marginBottom: '15px' }}>
            <Label>Slug (URL)</Label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: '13px', pointerEvents: 'none' }}>/blog/</span>
              <input
                value={form.slug}
                onChange={e => { setSlugManual(true); setForm(f => ({ ...f, slug: clientSlugify(e.target.value) })) }}
                placeholder="auto-generated-from-title"
                style={{ width: '100%', padding: '11px 14px 11px 52px', background: '#0f1623', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#94a3b8', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace' }}
                onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
              {slugManual && (
                <button type="button" onClick={() => { setSlugManual(false); setForm(f => ({ ...f, slug: clientSlugify(f.title) })) }}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', cursor: 'pointer' }}>
                  Auto
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Excerpt + Category + Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '15px' }}>
            <div>
              <Label>Short Excerpt</Label>
              <input value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Brief summary shown in listing..."
                style={{ width: '100%', padding: '11px 14px', background: '#0f1623', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'rgba(96,165,250,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
            </div>
            <div>
              <Label>Category</Label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', background: '#0f1623', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                style={{ width: '100%', padding: '11px 14px', background: '#0f1623', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Row 3: Editor full width */}
          <div style={{ marginBottom: '4px' }}>
            <Label>Post Content</Label>
            <div style={{ marginTop: '6px' }}>
              <QuillEditor
                value={form.content}
                onChange={val => setForm(f => ({ ...f, content: val }))}
                placeholder="Write your blog post content here..."
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '22px' }}>
            <button onClick={onClose} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Cancel</button>
            <button onClick={() => handleSave('Draft')} disabled={saving}
              style={{ padding: '10px 18px', background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.4)', color: '#facc15', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
              Save Draft
            </button>
            <button onClick={() => handleSave()} disabled={saving} style={{ padding: '10px 24px', background: saving ? 'rgba(37,99,235,0.4)' : '#2563eb', border: 'none', color: '#fff', borderRadius: '10px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: saving ? 'none' : '0 4px 14px rgba(37,99,235,0.5)' }}>
              {saving ? <><i className="fa fa-spinner fa-spin" />Saving...</> : <><i className="fa fa-check" />{mode === 'add' ? 'Publish Post' : 'Save Changes'}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Pagination Component ────────────────────────────────────
function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null
  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
        style={{ padding: '7px 13px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: page === 1 ? 'transparent' : '#1a1f2e', color: page === 1 ? '#334155' : '#94a3b8', cursor: page === 1 ? 'default' : 'pointer', fontSize: '13px' }}>
        <i className="fa fa-chevron-left" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
        <button key={n} onClick={() => setPage(n)}
          style={{ padding: '7px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', border: n === page ? '1px solid #2563eb' : '1px solid rgba(255,255,255,0.1)', background: n === page ? '#2563eb' : '#1a1f2e', color: n === page ? '#fff' : '#94a3b8', cursor: 'pointer' }}>{n}</button>
      ))}
      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
        style={{ padding: '7px 13px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: page === totalPages ? 'transparent' : '#1a1f2e', color: page === totalPages ? '#334155' : '#94a3b8', cursor: page === totalPages ? 'default' : 'pointer', fontSize: '13px' }}>
        <i className="fa fa-chevron-right" />
      </button>
    </div>
  )
}

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [selected, setSelected] = useState(null)
  const [modal, setModal] = useState(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const load = () => adminApi.getBlogs().then(d => { if (d.success) setPosts(d.data) })
  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog post?')) return
    await adminApi.deleteBlog(id)
    if (selected?.id === id) setSelected(null)
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

  const filtered = posts.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.title?.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q)
    const matchCategory = categoryFilter === 'All' || p.category === categoryFilter
    const matchStatus = statusFilter === 'All' || p.status === statusFilter
    return matchSearch && matchCategory && matchStatus
  })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <>
      {modal && <BlogModal mode={modal.mode} post={modal.post} onClose={() => setModal(null)} onSaved={load} />}

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

        {/* Table */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <i className="fa fa-search" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '13px' }} />
              <input type="text" placeholder="Search by title or excerpt..." value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                style={{ width: '100%', padding: '10px 14px 10px 36px', background: '#141824', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1) }}
              style={{ padding: '10px 14px', background: '#141824', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', cursor: 'pointer', outline: 'none' }}>
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
              style={{ padding: '10px 14px', background: '#141824', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#f1f5f9', fontSize: '14px', cursor: 'pointer', outline: 'none' }}>
              <option value="All">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
            <button onClick={() => setModal({ mode: 'add', post: null })}
              style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', boxShadow: '0 4px 12px rgba(37,99,235,0.4)', whiteSpace: 'nowrap' }}>
              <i className="fa fa-plus" /> New Post
            </button>
          </div>

          <div style={{ background: '#1a1f2e', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: '#141824' }}>
                  {['#', 'Image', 'Title', 'Category', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="7" style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontSize: '15px' }}>
                    <i className="fa fa-pencil-square-o" style={{ fontSize: '32px', display: 'block', marginBottom: '12px', color: '#334155' }} />
                    {search || categoryFilter !== 'All' || statusFilter !== 'All' ? 'No matching posts found' : 'No blog posts yet'}
                  </td></tr>
                ) : paginated.map((p, i) => (
                  <tr key={p.id} onClick={() => setSelected(p)}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', background: selected?.id === p.id ? 'rgba(37,99,235,0.12)' : 'transparent', borderLeft: selected?.id === p.id ? '3px solid #2563eb' : '3px solid transparent', transition: 'all 0.15s' }}
                    onMouseEnter={e => { if (selected?.id !== p.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                    onMouseLeave={e => { if (selected?.id !== p.id) e.currentTarget.style.background = 'transparent' }}>
                    <td style={tdStyle({ color: '#64748b', fontWeight: '600' })}>{(page - 1) * PER_PAGE + i + 1}</td>
                    <td style={tdStyle()}>
                      {p.image
                        ? <img src={`${BASE_URL}${p.image}`} alt="" style={{ width: '70px', height: '42px', objectFit: 'cover', borderRadius: '8px' }} />
                        : <div style={{ width: '70px', height: '42px', background: '#2a3547', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa fa-image" style={{ color: '#475569' }} /></div>}
                    </td>
                    <td style={{ ...tdStyle(), maxWidth: '220px' }}>
                      <div style={{ color: '#f1f5f9', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                      {p.excerpt && <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.excerpt}</div>}
                    </td>
                    <td style={tdStyle()}>
                      <span style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.3)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>{p.category}</span>
                    </td>
                    <td style={tdStyle()}>
                      <span style={{ background: (statusMap[p.status] || statusMap.Draft).bg, color: (statusMap[p.status] || statusMap.Draft).color, border: `1px solid ${(statusMap[p.status] || statusMap.Draft).color}50`, padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>{p.status}</span>
                    </td>
                    <td style={tdStyle({ color: '#64748b', fontSize: '13px', whiteSpace: 'nowrap' })}>{fmt(p.created_at)}</td>
                    <td style={tdStyle()}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={e => { e.stopPropagation(); setModal({ mode: 'edit', post: p }) }}
                          style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.35)', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                          <i className="fa fa-edit" />
                        </button>
                        <button onClick={e => { e.stopPropagation(); handleDelete(p.id) }}
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.35)', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
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
            <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>{filtered.length} / {posts.length} posts</p>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{ width: '300px', flexShrink: 0, background: '#1a1f2e', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ color: '#f1f5f9', margin: 0, fontSize: '15px', fontWeight: '700' }}>Post Detail</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setModal({ mode: 'edit', post: selected })}
                  style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa fa-edit" />
                </button>
                <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#94a3b8', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            </div>

            {selected.image
              ? <img src={`${BASE_URL}${selected.image}`} alt="" style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '10px', marginBottom: '14px' }} />
              : <div style={{ width: '100%', height: '80px', background: '#2a3547', borderRadius: '10px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa fa-image" style={{ color: '#334155', fontSize: '24px' }} />
              </div>}

            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.3)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>{selected.category}</span>
              <span style={{ background: (statusMap[selected.status] || statusMap.Draft).bg, color: (statusMap[selected.status] || statusMap.Draft).color, border: `1px solid ${(statusMap[selected.status] || statusMap.Draft).color}50`, padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>{selected.status}</span>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <Label>Title</Label>
              <p style={{ color: '#f1f5f9', fontWeight: '600', fontSize: '14px', margin: '4px 0 0', lineHeight: '1.5' }}>{selected.title}</p>
            </div>

            {selected.slug && (
              <div style={{ marginBottom: '12px' }}>
                <Label>Slug</Label>
                <p style={{ color: '#475569', fontSize: '12px', margin: '4px 0 0', fontFamily: 'monospace', wordBreak: 'break-all' }}>/blog/{selected.slug}</p>
              </div>
            )}

            {selected.excerpt && (
              <div style={{ marginBottom: '12px' }}>
                <Label>Excerpt</Label>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0', lineHeight: '1.5' }}>{selected.excerpt}</p>
              </div>
            )}

            {selected.content && (
              <div style={{ marginBottom: '12px' }}>
                <Label>Content Preview</Label>
                <div style={{ background: '#0f1623', borderRadius: '10px', padding: '12px 14px', border: '1px solid rgba(255,255,255,0.06)', marginTop: '6px', maxHeight: '120px', overflow: 'hidden' }}>
                  <div style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6' }}
                    dangerouslySetInnerHTML={{ __html: selected.content }} />
                </div>
              </div>
            )}

            <p style={{ color: '#475569', fontSize: '12px', margin: '10px 0 0' }}>
              <i className="fa fa-clock-o" style={{ marginRight: '6px' }} />
              {fmt(selected.created_at)}
            </p>
          </div>
        )}
      </div>
    </>
  )
}

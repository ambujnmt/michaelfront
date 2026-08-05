'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import adminApi from '@/lib/adminApi'

const translations = {
  de: {
    title: 'Admin Login',
    subtitle: 'Willkommen zurück! Bitte melden Sie sich an.',
    emailPlaceholder: 'E-Mail eingeben',
    passwordPlaceholder: 'Passwort eingeben',
    loginBtn: 'Jetzt anmelden',
    loadingBtn: 'Bitte warten...',
    successAlert: 'Anmeldung erfolgreich',
    errorAlert: 'Serverfehler',
  },
  en: {
    title: 'Admin Login',
    subtitle: 'Welcome back! Please login to continue.',
    emailPlaceholder: 'Enter Email',
    passwordPlaceholder: 'Enter Password',
    loginBtn: 'Login Now',
    loadingBtn: 'Please wait...',
    successAlert: 'Login Successful',
    errorAlert: 'Server Error',
  }
}

export default function AdminLogin() {

  const router = useRouter()
  const [lang, setLang] = useState('de')
  const t = translations[lang]

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await adminApi.login(formData)
      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminData', JSON.stringify(data.admin))
        alert(t.successAlert)
        router.push('/admin/dashboard')
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.log(error)
      alert(t.errorAlert)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a, #1e293b, #334155)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
    }}>
      <div style={{
        width: '100%', maxWidth: '430px',
        background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px',
        padding: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.35)', position: 'relative'
      }}>

        {/* Language Toggle */}
        <div style={{ position: 'absolute', top: '18px', right: '20px', display: 'flex', gap: '4px' }}>
          {['de', 'en'].map((l) => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding: '4px 10px', borderRadius: '6px', border: 'none',
              fontSize: '12px', fontWeight: '700', cursor: 'pointer', textTransform: 'uppercase',
              background: lang === l ? '#ffffff' : 'rgba(255,255,255,0.12)',
              color: lang === l ? '#0f172a' : '#94a3b8', transition: 'all 0.2s'
            }}>
              {l}
            </button>
          ))}
        </div>

        <div className="text-center mb-4">
          <img src="/assets/img/logo.png" alt="Logo" style={{ width: '120px', marginBottom: '20px' }} />
          <h2 style={{ color: '#fff', fontWeight: '700', marginBottom: '10px' }}>{t.title}</h2>
          <p style={{ color: '#cbd5e1', fontSize: '14px' }}>{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input type="email" name="email" placeholder={t.emailPlaceholder} className="form-control"
              onChange={handleChange} required
              style={{ height: '55px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.12)', color: '#fff', paddingLeft: '18px' }} />
          </div>
          <div className="mb-4">
            <input type="password" name="password" placeholder={t.passwordPlaceholder} className="form-control"
              onChange={handleChange} required
              style={{ height: '55px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.12)', color: '#fff', paddingLeft: '18px' }} />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', height: '55px', border: 'none', borderRadius: '12px',
            background: '#ffffff', color: '#0f172a', fontWeight: '700', fontSize: '16px', cursor: 'pointer'
          }}>
            {loading ? t.loadingBtn : t.loginBtn}
          </button>
        </form>

      </div>
    </div>
  )
}

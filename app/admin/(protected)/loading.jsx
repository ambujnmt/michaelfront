export default function AdminLoading() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '70vh', flexDirection: 'column', gap: '14px',
    }}>
      <style>{`
        @keyframes admin-spin { to { transform: rotate(360deg); } }
        .admin-spin-ring {
          width: 40px; height: 40px;
          border: 3px solid rgba(37,99,235,0.15);
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: admin-spin 0.65s linear infinite;
        }
      `}</style>
      <div className="admin-spin-ring" />
      <p style={{ color: '#475569', fontSize: '13px', margin: 0, fontWeight: '500' }}>Loading...</p>
    </div>
  )
}

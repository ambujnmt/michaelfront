export default function PagesLoading() {
  return (
    <>
      <style>{`
        @keyframes web-spin { to { transform: rotate(360deg); } }
        .web-spin-ring {
          width: 44px; height: 44px;
          border: 3px solid rgba(0,0,0,0.08);
          border-top-color: #1a1a1a;
          border-radius: 50%;
          animation: web-spin 0.7s linear infinite;
        }
      `}</style>
      <div style={{
        minHeight: '60vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div className="web-spin-ring" />
      </div>
    </>
  )
}

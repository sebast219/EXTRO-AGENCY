export default function BlogLoading() {
  const bar = (w: number | string, h: number) => (
    <div style={{ width: w, height: h, borderRadius: 6, background: '#18181b' }} className="animate-pulse" />
  )
  return (
    <div style={{ minHeight: '100vh', background: '#050505', padding: '150px 24px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 18 }}>{bar(90, 14)}</div>
        <div style={{ marginBottom: 16 }}>{bar(220, 56)}</div>
        <div style={{ marginBottom: 56 }}>{bar(480, 18)}</div>
        <div className="bl-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ padding: 24, borderRadius: 12, background: '#0c0c0d' }} className="animate-pulse">
              <div style={{ marginBottom: 14 }}>{bar(140, 14)}</div>
              <div style={{ marginBottom: 24 }}>{bar('80%', 28)}</div>
              <div style={{ aspectRatio: '16 / 10', borderRadius: 10, background: '#111113' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* eslint-disable @next/next/no-img-element */
// Generated from the Claude Design file Home.dc.html. Static markup only.
export default function HomeNav({ base = '' }: { base?: string }) {
  return (
    <header className="nav" style={{ position: "fixed", top: "16px", left: "50%", right: "auto", zIndex: "50", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(14,14,14,0.78)", backdropFilter: "blur(20px) saturate(1.4)", transform: "translateX(-50%)", width: "min(1040px, calc(100% - 32px))", borderRadius: "999px", boxShadow: "0 12px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: "none", margin: "0 auto", padding: "0px 8px 0px 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px", boxSizing: "border-box" }}>
        <a href={`${base}#inicio`} aria-label="EXTRO, ir al inicio" style={{ display: "flex", alignItems: "center" }}>
          <img src="/images/brand/extro-logo.png" alt="EXTRO" style={{ display: "block", width: "103px", height: "30px" }} />
        </a>
        <nav aria-label="Navegación principal" className="nav-links" style={{ display: "flex", alignItems: "center", gap: "28px", fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
          <a className="nav-a" href={`${base}#soluciones`} style={{ textDecoration: "none" }}>
            {"Soluciones"}
          </a>
          <a className="nav-a" href={`${base}#casos`} style={{ textDecoration: "none" }}>
            {"Casos"}
          </a>
          <a className="nav-a" href={`${base}#proceso`} style={{ textDecoration: "none" }}>
            {"Proceso"}
          </a>
          <a className="nav-a" href={`${base}#faq`} style={{ textDecoration: "none" }}>
            {"FAQ"}
          </a>
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <a href="https://wa.me/573005865312" className="btn-g nav-links mag" style={{ display: "inline-flex", alignItems: "center", minHeight: "40px", padding: "0 16px", borderRadius: "999px", background: "rgba(9,9,11,0.6)", border: "1px solid #27272a", color: "#fff", fontSize: "14px", fontWeight: "500", textDecoration: "none" }}>
            {"WhatsApp"}
          </a>
          <a href={`${base}#contacto`} className="btn-w mag" style={{ display: "inline-flex", alignItems: "center", gap: "8px", minHeight: "40px", padding: "0 16px", borderRadius: "999px", background: "#fafafa", color: "#18181b", fontSize: "14px", fontWeight: "600", textDecoration: "none", whiteSpace: "nowrap" }}>
            {"Cotizar proyecto"}
          </a>
        </div>
      </div>
    </header>
  )
}

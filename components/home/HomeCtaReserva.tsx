 
// Generated from the Claude Design file Home.dc.html. Static markup only.
export default function HomeCtaReserva({ children }: { children: React.ReactNode }) {
  return (
    <div className="cta-res" style={{ position: "relative", isolation: "isolate" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: "0", zIndex: "-1", pointerEvents: "none", background: "radial-gradient(ellipse 720px 560px at 50% 640px, rgba(0,102,255,0.28) 0%, rgba(0,102,255,0.08) 50%, transparent 78%)" }}></div>
      <div aria-hidden="true" style={{ position: "absolute", inset: "0", zIndex: "-1", pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "14px 14px", WebkitMaskImage: "radial-gradient(ellipse 700px 480px at 50% 640px, #000 0%, transparent 72%)", maskImage: "radial-gradient(ellipse 700px 480px at 50% 640px, #000 0%, transparent 72%)" }}></div>
      <section id="contacto" style={{ position: "relative", zIndex: "1", isolation: "isolate", overflow: "hidden", padding: "clamp(110px, 12vw, 170px) 24px 36px", boxSizing: "border-box", textAlign: "center" }}>
        <h2 className="grad rv" style={{ margin: "0 auto 22px", maxWidth: "1000px", fontFamily: "var(--font-space),sans-serif", fontWeight: "700", fontSize: "clamp(44px, 7vw, 104px)", lineHeight: "1.02", letterSpacing: "-0.05em", textTransform: "uppercase", paddingTop: "0.08em" }}>
          <span aria-hidden="true" style={{ display: "inline-block", width: "0.16em", height: "0.16em", borderRadius: "999px", background: "rgb(0, 102, 255)", boxShadow: "rgba(0, 102, 255, 0.8) 0px 0px 24px", verticalAlign: "middle", marginRight: "0.3em" }}></span>
          <span className="cta-w grad" style={{ padding: "0.06em 0.02em 0.04em" }}>
            {"CONSTRUYAMOS "}
          </span>
          <span className="cta-w grad" style={{ padding: "0.06em 0.02em 0.04em" }}>
            {"tu"}
          </span>
          {" "}
          <span className="cta-w grad" style={{ padding: "0.06em 0.02em 0.04em" }}>
            {"próximo"}
          </span>
          {" "}
          <span className="cta-w grad" style={{ padding: "0.06em 0.02em 0.04em" }}>
            {"software"}
          </span>
        </h2>
        <p style={{ margin: "0 auto 40px", maxWidth: "560px", fontSize: "18px", lineHeight: "1.6", color: "rgba(255,255,255,0.6)" }}>
          {"En 15 minutos te decimos cómo lo resolveríamos, cuánto costaría y en cuánto tiempo. Sin compromiso."}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
          <a href="#reserva" className="btn-w mag" style={{ display: "inline-flex", alignItems: "center", gap: "10px", minHeight: "48px", padding: "0 22px", borderRadius: "8px", background: "#fafafa", color: "#18181b", fontSize: "15px", fontWeight: "600", textDecoration: "none" }}>
            {"Elegir fecha y hora "}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14"></path>
              <path d="m19 12-7 7-7-7"></path>
            </svg>
          </a>
        </div>
      </section>
      {children}
    </div>
  )
}

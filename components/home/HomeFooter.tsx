/* eslint-disable @next/next/no-img-element */
// Generated from the Claude Design file Home.dc.html. Static markup only.
import { localizedPath, type Locale } from '@/lib/i18n/config'
import { HOME_COPY } from '@/lib/i18n/home-copy'

export default function HomeFooter({ lang, base = '' }: { lang: Locale; base?: string }) {
  const c = HOME_COPY[lang].footer
  const terms = localizedPath('/terms', lang)
  const blog = localizedPath('/blog', lang)
  return (
    <footer id="footer" style={{ position: "relative", zIndex: "1", background: "#050505", color: "#fff", overflow: "hidden", isolation: "isolate", left: "auto", top: "auto", width: "100%", height: "auto" }}>
      <div aria-hidden="true" style={{ position: "absolute", inset: "0", zIndex: "0", pointerEvents: "none" }}>
        <img data-lazy-src="/images/work/work-15.webp" alt="" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 45%", transform: "scaleX(-1)" }} />
        <div style={{ position: "absolute", inset: "0", background: "radial-gradient(ellipse 45% 40% at 26% 48%, rgba(0,102,255,0.12) 0%, transparent 70%)" }}></div>
        <div style={{ position: "absolute", inset: "0", background: "linear-gradient(90deg,rgba(5,5,5,0.55) 0%,rgba(5,5,5,0.1) 45%,rgba(5,5,5,0.35) 100%)" }}></div>
        <div style={{ position: "absolute", inset: "0", background: "linear-gradient(180deg,#050505 0%,rgba(5,5,5,0) 16%,rgba(5,5,5,0) 60%,rgba(5,5,5,0.88) 86%,#050505 100%)" }}></div>
      </div>
      <div className="ft-in" style={{ position: "relative", zIndex: "1", minHeight: "min(100vh, 900px)", display: "flex", flexDirection: "column", padding: "clamp(84px, 11vh, 100px) clamp(20px, 3vw, 48px) clamp(14px, 2vh, 22px)", boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "20px 32px", minHeight: "112px", marginBottom: "24px" }}>
          <a href={`${base}#inicio`} aria-label={c.homeAria} style={{ display: "inline-flex", alignItems: "center", gap: "10px", color: "#fff", textDecoration: "none", fontFamily: "var(--font-space),sans-serif", fontWeight: "700", fontSize: "26px", letterSpacing: "-0.04em" }}>
            <img data-lazy-src="/icon.png" alt="" style={{ width: "30px", height: "30px", borderRadius: "999px", objectFit: "cover" }} />
            {"EXTRO "}
          </a>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px clamp(32px, 7vw, 120px)", fontSize: "14px", lineHeight: "1.45", color: "rgba(255,255,255,0.86)" }}>
            <p style={{ margin: "0" }}>
              {c.role[0]}
              <br />
              {c.role[1]}
            </p>
            <div className="ft-clockbox" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontFamily: "var(--font-mono),monospace", fontSize: "11px", letterSpacing: "0.04em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                {c.city}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                <span className="ft-live" aria-hidden="true" style={{ width: "7px", height: "7px", borderRadius: "999px", background: "#0066ff", boxShadow: "0 0 10px rgba(0,102,255,0.9)" }}></span>
                <time className="ft-clock" aria-label={c.clockAria} style={{ fontFamily: "var(--font-space),sans-serif", fontSize: "26px", fontWeight: "500", letterSpacing: "-0.02em", lineHeight: "1", color: "#fff", fontVariantNumeric: "tabular-nums" }}>
                  {"16:13:57"}
                </time>
                <span style={{ fontFamily: "var(--font-mono),monospace", fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                  {"GMT-5"}
                </span>
              </span>
            </div>
          </div>
          <a href={`${base}#contacto`} className="ft-cta" style={{ display: "inline-flex", alignItems: "center", gap: "8px", minHeight: "44px", padding: "0 18px", borderRadius: "12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
            {c.cta}{" "}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </a>
        </div>
        <h2 style={{ margin: "0 auto", fontFamily: "var(--font-space),sans-serif", fontWeight: "700", fontSize: "clamp(40px, min(6.6vw, 10.5vh), 112px)", lineHeight: "0.88", letterSpacing: "-0.045em", textTransform: "uppercase", textAlign: "center", width: "100%", maxWidth: "1340px", backgroundImage: "linear-gradient(180deg, #ffffff 100%, #daa47f 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {c.heading[0]}
          <br />
          {c.heading[1]}
          <br />
          <span style={{ color: "rgb(0, 102, 255)" }}>
            {c.heading[2]}
          </span>
        </h2>
        <div className="ft-mid" style={{ flex: "1", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "28px 48px", margin: "clamp(20px, 5vh, 64px) 0" }}>
          <div style={{ maxWidth: "420px", paddingBottom: "6px" }}>
            <p style={{ margin: "0", display: "flex", alignItems: "center", gap: "14px", fontFamily: "var(--font-space),sans-serif", fontSize: "clamp(18px, min(1.8vw, 3vh), 26px)", fontWeight: "500", letterSpacing: "-0.03em", lineHeight: "1.1" }}>
              <span style={{ width: "14px", height: "14px", borderRadius: "999px", background: "#0066ff", boxShadow: "0 0 16px rgba(0,102,255,0.6)", flexShrink: "0" }}></span>
              {c.ready}
            </p>
            <p style={{ margin: "6px 0 0", fontFamily: "var(--font-space),sans-serif", fontSize: "clamp(18px, min(1.8vw, 3vh), 26px)", fontWeight: "500", letterSpacing: "-0.03em", lineHeight: "1.1", color: "rgba(255,255,255,0.6)", textWrap: "balance" }}>
              {c.readySub}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginLeft: "auto" }}>
            <div style={{ marginTop: "clamp(16px, 3vh, 30px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-end", gap: "12px 24px" }}>
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.72)" }}>
                {c.callNote}
              </span>
              <a href={`${base}#contacto`} className="ft-pill" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "12px", minWidth: "min(300px, 100%)", height: "clamp(48px, 7vh, 60px)", padding: "0 30px", boxSizing: "border-box", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.24)", background: "rgba(5,5,5,0.45)", backdropFilter: "blur(8px)", color: "#fff", textDecoration: "none", fontSize: "18px", fontWeight: "500", letterSpacing: "-0.01em" }}>
                {c.cta}{" "}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.14)", borderBottom: "1px solid rgba(255,255,255,0.14)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(150px, 100%), 1fr))" }}>
          <div style={{ position: "relative", borderLeft: "1px solid rgba(255,255,255,0.1)", padding: "14px 20px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "18px", minHeight: "clamp(104px, 15vh, 150px)", boxSizing: "border-box" }}>
            <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true" style={{ position: "absolute", top: "-8px", left: "-8px" }}>
              <path d="M7.5 0v15M0 7.5h15" stroke="rgba(255,255,255,0.45)" strokeWidth="1"></path>
            </svg>
            <div style={{ display: "flex", gap: "10px", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
              <span>
                {"01"}
              </span>
              <span>
                {c.contact}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "15px", lineHeight: "1.4" }}>
              <a href="mailto:hola@extro.com.co" className="foot-link" style={{ color: "rgba(255,255,255,0.86)", textDecoration: "none" }}>
                {"hola@extro.com.co"}
              </a>
              <a href="https://wa.me/573005865312" target="_blank" rel="noopener noreferrer" className="foot-link" style={{ color: "rgba(255,255,255,0.86)", textDecoration: "none" }}>
                {"+57 300 586 5312"}
              </a>
            </div>
          </div>
          <div style={{ position: "relative", borderLeft: "1px solid rgba(255,255,255,0.1)", padding: "14px 20px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "18px", minHeight: "clamp(104px, 15vh, 150px)", boxSizing: "border-box" }}>
            <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true" style={{ position: "absolute", top: "-8px", left: "-8px" }}>
              <path d="M7.5 0v15M0 7.5h15" stroke="rgba(255,255,255,0.45)" strokeWidth="1"></path>
            </svg>
            <div style={{ display: "flex", gap: "10px", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
              <span>
                {"02"}
              </span>
              <span>
                {c.studio}
              </span>
            </div>
            <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.4", color: "rgba(255,255,255,0.86)" }}>
              {c.studioLines[0]}
              <br />
              {c.studioLines[1]}
            </p>
          </div>
          <nav aria-label={c.navAria} style={{ position: "relative", borderLeft: "1px solid rgba(255,255,255,0.1)", padding: "14px 20px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "18px", minHeight: "clamp(104px, 15vh, 150px)", boxSizing: "border-box" }}>
            <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true" style={{ position: "absolute", top: "-8px", left: "-8px" }}>
              <path d="M7.5 0v15M0 7.5h15" stroke="rgba(255,255,255,0.45)" strokeWidth="1"></path>
            </svg>
            <div style={{ display: "flex", gap: "10px", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
              <span>
                {"03"}
              </span>
              <span>
                {c.explore}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 18px", fontSize: "15px", lineHeight: "1.4" }}>
              <a href={`${base}#soluciones`} className="foot-link" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none" }}>{c.exploreLinks.solutions}</a>
              <a href={`${base}#casos`} className="foot-link" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none" }}>{c.exploreLinks.cases}</a>
              <a href={`${base}#proceso`} className="foot-link" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none" }}>{c.exploreLinks.process}</a>
              <a href={`${base}#reserva`} className="foot-link" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none" }}>{c.exploreLinks.booking}</a>
              <a href={`${base}#faq`} className="foot-link" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none" }}>{c.exploreLinks.faq}</a>
            </div>
          </nav>
          <div style={{ position: "relative", borderLeft: "1px solid rgba(255,255,255,0.1)", padding: "14px 20px 18px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "18px", minHeight: "clamp(104px, 15vh, 150px)", boxSizing: "border-box" }}>
            <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true" style={{ position: "absolute", top: "-8px", left: "-8px" }}>
              <path d="M7.5 0v15M0 7.5h15" stroke="rgba(255,255,255,0.45)" strokeWidth="1"></path>
            </svg>
            <div style={{ display: "flex", gap: "10px", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
              <span>
                {"04"}
              </span>
              <span>
                {c.connect}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 18px", fontSize: "15px", lineHeight: "1.4" }}>
              <a href="https://www.linkedin.com/in/sebastian-yepes-dev/" target="_blank" rel="noopener noreferrer" className="foot-link" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none" }}>
                {"LinkedIn"}
              </a>
              <a href="https://github.com/sebast219" target="_blank" rel="noopener noreferrer" className="foot-link" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none" }}>
                {"GitHub"}
              </a>
              <a href={blog} className="foot-link" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none" }}>
                {"Blog"}
              </a>
            </div>
          </div>
          <div style={{ position: "relative", borderLeft: "1px solid rgba(255,255,255,0.1)", borderRight: "1px solid rgba(255,255,255,0.1)", padding: "14px 20px 18px", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", minHeight: "clamp(104px, 15vh, 150px)", boxSizing: "border-box" }}>
            <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true" style={{ position: "absolute", top: "-8px", left: "-8px" }}>
              <path d="M7.5 0v15M0 7.5h15" stroke="rgba(255,255,255,0.45)" strokeWidth="1"></path>
            </svg>
            <a href={`${base}#inicio`} className="ft-top" style={{ display: "inline-flex", alignItems: "center", gap: "18px", color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.02em" }}>
              {c.backToTop}{" "}
              <span className="ft-top-circle" style={{ width: "52px", height: "52px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.24)", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "background-color .15s ease,color .15s ease" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m5 12 7-7 7 7"></path>
                  <path d="M12 19V5"></path>
                </svg>
              </span>
            </a>
          </div>
        </div>
        <div style={{ paddingTop: "14px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-end", gap: "8px 24px", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 24px" }}>
            <a href={`${terms}#datos`} className="foot-link" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", padding: "8px 0" }}>
              {c.legal.data}
            </a>
            <a href={`${terms}#terminos`} className="foot-link" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", padding: "8px 0" }}>
              {c.legal.terms}
            </a>
            <a href={`${terms}#seguridad`} className="foot-link" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", padding: "8px 0" }}>
              {c.legal.security}
            </a>
            <span>
              {c.rights}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

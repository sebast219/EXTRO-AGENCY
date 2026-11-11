// Generated from the Claude Design file Home.dc.html. Static markup only.
import { HOME_COPY } from '@/lib/i18n/home-copy'
import type { Locale } from '@/lib/i18n/config'

export default function HomeHero({ lang }: { lang: Locale }) {
  const c = HOME_COPY[lang].hero

  return (
    <section id="inicio" style={{ position: "relative", zIndex: "1", isolation: "isolate", padding: "168px 24px 0", boxSizing: "border-box", textAlign: "center" }}>
      <div className="h-spot" aria-hidden="true"></div>
      <div aria-hidden="true" style={{ position: "absolute", inset: "0", zIndex: "-1", background: "radial-gradient(ellipse 50% 45% at 50% 62%, rgba(0,102,255,0.20) 0%, transparent 70%)" }}></div>
      <div aria-hidden="true" style={{ position: "absolute", inset: "0", zIndex: "-1", backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "14px 14px", WebkitMaskImage: "radial-gradient(ellipse 55% 50% at 50% 60%, #000 0%, transparent 72%)", maskImage: "radial-gradient(ellipse 55% 50% at 50% 60%, #000 0%, transparent 72%)" }}></div>
      <h1 aria-label={c.titleAria} style={{ margin: "0 auto 24px", maxWidth: "960px", fontFamily: "var(--font-space),sans-serif", fontWeight: "600", fontSize: "clamp(46px, 7vw, 96px)", lineHeight: "0.98", letterSpacing: "-0.045em", textWrap: "balance" }}>
        {c.titleWords.map((word, i) => (
          <span key={`${word}-${i}`}>
            {i > 0 ? " " : null}
            <span className="w" aria-hidden="true">
              <span className="wi grad">{word}</span>
            </span>
          </span>
        ))}
      </h1>
      <p className="h-in" style={{ margin: "0 auto 40px", maxWidth: "620px", fontSize: "clamp(17px, 1.4vw, 20px)", lineHeight: "1.6", color: "rgba(255,255,255,0.6)", textWrap: "pretty" }}>
        {c.subtitle}
      </p>
      <div className="h-in" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginBottom: "72px" }}>
        <a href="#contacto" className="btn-w mag" style={{ display: "inline-flex", alignItems: "center", gap: "10px", minHeight: "48px", padding: "0 22px", borderRadius: "8px", background: "#fafafa", color: "#18181b", fontSize: "15px", fontWeight: "600", textDecoration: "none" }}>
          {c.primary}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </a>
        <a href="#casos" className="btn-g mag" style={{ display: "inline-flex", alignItems: "center", minHeight: "48px", padding: "0 22px", borderRadius: "8px", background: "rgba(9,9,11,0.6)", border: "1px solid #27272a", color: "#fff", fontSize: "15px", fontWeight: "500", textDecoration: "none" }}>
          {c.secondary}
        </a>
      </div>
      <div className="h-win" style={{ position: "relative", maxWidth: "900px", margin: "0 auto", textAlign: "left" }}>
        <div aria-hidden="true" style={{ position: "absolute", left: "10%", right: "10%", top: "-10px", height: "1px", background: "linear-gradient(90deg,transparent,rgba(0,102,255,0.9),transparent)" }}></div>
        <div className="h-win-in" style={{ borderRadius: "16px 16px 0 0", border: "1px solid rgba(255,255,255,0.12)", borderBottom: "0", background: "linear-gradient(180deg,#0e0e10 0%,#08080a 100%)", boxShadow: "0 -20px 80px rgba(0,102,255,0.15)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", gap: "7px" }} aria-hidden="true">
              <span style={{ width: "11px", height: "11px", borderRadius: "999px", background: "rgba(255,255,255,0.14)" }}></span>
              <span style={{ width: "11px", height: "11px", borderRadius: "999px", background: "rgba(255,255,255,0.14)" }}></span>
              <span style={{ width: "11px", height: "11px", borderRadius: "999px", background: "rgba(255,255,255,0.14)" }}></span>
            </div>
            <span style={{ fontFamily: "var(--font-mono),monospace", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
              {c.window.title}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-mono),monospace", fontSize: "12px", color: "#7fb2ff" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: "#0066ff", boxShadow: "0 0 8px #0066ff" }} aria-hidden="true"></span>
              {c.window.live}
            </span>
          </div>
          <div style={{ padding: "26px 28px 34px", fontFamily: "var(--font-mono),monospace", fontSize: "clamp(12px, 1.2vw, 15px)", lineHeight: "2.05", color: "rgba(255,255,255,0.75)", overflowX: "auto" }}>
            <div className="t-line" style={{ whiteSpace: "nowrap" }}>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>{"$"}</span>
              {` ${c.terminal.command} `}
              <span style={{ color: "#fff" }}>{c.terminal.client}</span>
            </div>
            {c.terminal.done.map((line) => (
              <div key={line} className="t-line" style={{ display: "flex", justifyContent: "space-between", gap: "24px", whiteSpace: "nowrap" }}>
                <span>
                  <span style={{ color: "rgb(74, 222, 128)" }}>{"✓"}</span>
                  {` ${line}`}
                </span>
                <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                  <br />
                </span>
              </div>
            ))}
            <div className="t-line" style={{ display: "flex", justifyContent: "space-between", gap: "24px", whiteSpace: "nowrap" }}>
              <span>
                <span style={{ color: "rgb(127, 178, 255)" }}>{"●"}</span>
                {" "}
                <span style={{ color: "rgb(255, 255, 255)" }}>{c.terminal.working}</span>
                <span className="caret" aria-hidden="true"></span>
              </span>
              <span style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                <br />
              </span>
            </div>
            <div className="t-line" style={{ whiteSpace: "nowrap" }}>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>{"→"}</span>
              {` ${c.terminal.url} `}
              <span style={{ color: "rgba(255,255,255,0.4)" }}>{c.terminal.note}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

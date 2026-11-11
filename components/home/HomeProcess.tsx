// Generated from the Claude Design file Home.dc.html. Static markup only.
import { HOME_COPY } from '@/lib/i18n/home-copy'
import type { Locale } from '@/lib/i18n/config'

export default function HomeProcess({ lang }: { lang: Locale }) {
  const c = HOME_COPY[lang].process

  return (
    <section id="proceso" style={{ position: "relative", zIndex: "1", padding: "clamp(96px, 11vw, 150px) 24px", boxSizing: "border-box" }}>
      <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
        <div className="rv" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px", fontFamily: "var(--font-mono),monospace", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "999px", background: "#0066ff", boxShadow: "0 0 12px rgba(0,102,255,0.8)" }} aria-hidden="true"></span>
          {c.eyebrow}
        </div>
        <h2 className="grad rv" style={{ margin: "0 0 18px", maxWidth: "760px", fontFamily: "var(--font-space),sans-serif", fontWeight: "600", fontSize: "clamp(36px, 4.8vw, 64px)", lineHeight: "1", letterSpacing: "-0.04em", textWrap: "balance" }}>
          {c.title}
        </h2>
        <p style={{ margin: "0 0 64px", maxWidth: "580px", fontSize: "18px", lineHeight: "1.6", color: "rgba(255,255,255,0.6)" }}>
          {c.intro}
        </p>
        <div style={{ position: "relative" }}>
          <div className="p-track" aria-hidden="true">
            <div className="p-fill"></div>
          </div>
          <ol className="p-list" style={{ position: "relative", listStyle: "none", margin: "0", padding: "0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(190px, 100%), 1fr))", gap: "36px 24px" }}>
            {c.steps.map((step, i) => (
              <li key={step.title} className="p-step">
                <span className="p-seg" aria-hidden="true"></span>
                <span className="p-dot" aria-hidden="true"></span>
                <div style={{ fontFamily: "var(--font-mono),monospace", fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "10px" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ fontFamily: "var(--font-space),sans-serif", fontSize: "21px", fontWeight: "600", marginBottom: "8px" }}>
                  {step.title}
                </div>
                <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.6", color: "rgba(255,255,255,0.6)" }}>
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

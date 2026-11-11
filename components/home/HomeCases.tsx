/* eslint-disable @next/next/no-img-element */
// Generated from the Claude Design file Home.dc.html. Static markup only.
import { HOME_COPY } from '@/lib/i18n/home-copy'
import type { Locale } from '@/lib/i18n/config'

export default function HomeCases({ lang }: { lang: Locale }) {
  const c = HOME_COPY[lang].cases

  return (
    <section id="casos" className="pg" style={{ position: "relative", zIndex: "2", background: "#050505" }}>
      <div className="pg-stage" style={{ position: "relative", height: "min(100vh, 960px)", minHeight: "640px", overflow: "hidden", background: "#050505", transformOrigin: "50% 0" }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: "0", backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "14px 14px", WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, #000 0%, transparent 75%)", maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, #000 0%, transparent 75%)" }}></div>
        <div aria-hidden="true" className="pg-glow" style={{ position: "absolute", left: "50%", top: "50%", width: "900px", height: "900px", margin: "-450px 0 0 -450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,102,255,0.22) 0%, rgba(0,102,255,0.06) 40%, transparent 68%)" }}></div>
        <div className="pg-field" aria-hidden="true" style={{ position: "absolute", inset: "0" }}>
          <div className="pg-ph" data-d="1" style={{ "--w": "300", position: "absolute", left: "4%", top: "8%", zIndex: "10", opacity: "1" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-08.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
              <span style={{ position: "absolute", left: "10px", bottom: "10px", display: "inline-flex", alignItems: "baseline", gap: "8px", padding: "6px 10px", borderRadius: "10px", background: "rgba(5,5,5,0.72)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", whiteSpace: "nowrap" }}>
                <b style={{ fontFamily: "var(--font-space),sans-serif", fontSize: "17px", fontWeight: "600", letterSpacing: "-0.02em", color: "#fff" }}>
                  {c.metrics[0].value}
                </b>
                <span style={{ fontFamily: "var(--font-mono),monospace", fontSize: "10.5px", color: "rgba(255,255,255,0.6)" }}>
                  {c.metrics[0].label}
                </span>
              </span>
            </div>
          </div>
          <div className="pg-ph" data-d="0.45" style={{ "--w": "190", position: "absolute", left: "26%", top: "-3%", zIndex: "4", opacity: "0.55", filter: "blur(0.9px)" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-01.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
            </div>
          </div>
          <div className="pg-ph" data-d="1" style={{ "--w": "320", position: "absolute", left: "70%", top: "6%", zIndex: "10", opacity: "1" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-14.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
            </div>
          </div>
          <div className="pg-ph" data-d="0.6" style={{ "--w": "220", position: "absolute", left: "88%", top: "36%", zIndex: "6", opacity: "1" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-11.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
            </div>
          </div>
          <div className="pg-ph" data-d="0.75" style={{ "--w": "250", position: "absolute", left: "-3%", top: "45%", zIndex: "7", opacity: "1" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-12.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
            </div>
          </div>
          <div className="pg-ph" data-d="1" style={{ "--w": "330", position: "absolute", left: "12%", top: "70%", zIndex: "10", opacity: "1" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-02.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
              <span style={{ position: "absolute", left: "10px", bottom: "10px", display: "inline-flex", alignItems: "baseline", gap: "8px", padding: "6px 10px", borderRadius: "10px", background: "rgba(5,5,5,0.72)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", whiteSpace: "nowrap" }}>
                <b style={{ fontFamily: "var(--font-space),sans-serif", fontSize: "17px", fontWeight: "600", letterSpacing: "-0.02em", color: "#fff" }}>
                  {c.metrics[1].value}
                </b>
                <span style={{ fontFamily: "var(--font-mono),monospace", fontSize: "10.5px", color: "rgba(255,255,255,0.6)" }}>
                  {c.metrics[1].label}
                </span>
              </span>
            </div>
          </div>
          <div className="pg-ph" data-d="0.9" style={{ "--w": "300", position: "absolute", left: "73%", top: "64%", zIndex: "9", opacity: "1" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-04.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
              <span style={{ position: "absolute", left: "10px", bottom: "10px", display: "inline-flex", alignItems: "baseline", gap: "8px", padding: "6px 10px", borderRadius: "10px", background: "rgba(5,5,5,0.72)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", whiteSpace: "nowrap" }}>
                <b style={{ fontFamily: "var(--font-space),sans-serif", fontSize: "17px", fontWeight: "600", letterSpacing: "-0.02em", color: "#fff" }}>
                  {c.metrics[2].value}
                </b>
                <span style={{ fontFamily: "var(--font-mono),monospace", fontSize: "10.5px", color: "rgba(255,255,255,0.6)" }}>
                  {c.metrics[2].label}
                </span>
              </span>
            </div>
          </div>
          <div className="pg-ph" data-d="0.5" style={{ "--w": "210", position: "absolute", left: "41%", top: "86%", zIndex: "5", opacity: "0.55", filter: "blur(0.6px)" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-06.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
            </div>
          </div>
          <div className="pg-ph" data-d="0.35" style={{ "--w": "170", position: "absolute", left: "53%", top: "-6%", zIndex: "3", opacity: "0.55", filter: "blur(1.5px)" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-05.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
            </div>
          </div>
          <div className="pg-ph" data-d="0.3" style={{ "--w": "150", position: "absolute", left: "29%", top: "31%", zIndex: "3", opacity: "0.55", filter: "blur(1.8px)" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-03.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
            </div>
          </div>
          <div className="pg-ph" data-d="0.3" style={{ "--w": "140", position: "absolute", left: "63%", top: "40%", zIndex: "3", opacity: "0.55", filter: "blur(1.8px)" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-13.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
            </div>
          </div>
          <div className="pg-ph" data-d="0.95" style={{ "--w": "280", position: "absolute", left: "2%", top: "108%", zIndex: "9", opacity: "1" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-09.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
            </div>
          </div>
          <div className="pg-ph" data-d="1" style={{ "--w": "330", position: "absolute", left: "62%", top: "112%", zIndex: "10", opacity: "1" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-07.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
            </div>
          </div>
          <div className="pg-ph" data-d="0.55" style={{ "--w": "220", position: "absolute", left: "34%", top: "128%", zIndex: "5", opacity: "1" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-10.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
            </div>
          </div>
          <div className="pg-ph" data-d="0.7" style={{ "--w": "240", position: "absolute", left: "86%", top: "140%", zIndex: "7", opacity: "1" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-11.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
            </div>
          </div>
          <div className="pg-ph" data-d="0.85" style={{ "--w": "260", position: "absolute", left: "10%", top: "160%", zIndex: "8", opacity: "1" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-14.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
            </div>
          </div>
          <div className="pg-ph" data-d="1" style={{ "--w": "300", position: "absolute", left: "48%", top: "176%", zIndex: "10", opacity: "1" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-12.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
            </div>
          </div>
          <div className="pg-ph" data-d="0.5" style={{ "--w": "200", position: "absolute", left: "76%", top: "190%", zIndex: "5", opacity: "0.55", filter: "blur(0.6px)" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-08.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
            </div>
          </div>
          <div className="pg-ph" data-d="0.95" style={{ "--w": "300", position: "absolute", left: "-2%", top: "205%", zIndex: "9", opacity: "1" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-13.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
            </div>
          </div>
          <div className="pg-ph" data-d="0.4" style={{ "--w": "180", position: "absolute", left: "28%", top: "222%", zIndex: "4", opacity: "0.55", filter: "blur(1.2px)" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-04.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
            </div>
          </div>
          <div className="pg-ph" data-d="1" style={{ "--w": "320", position: "absolute", left: "68%", top: "236%", zIndex: "10", opacity: "1" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-05.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
            </div>
          </div>
          <div className="pg-ph" data-d="0.8" style={{ "--w": "240", position: "absolute", left: "40%", top: "262%", zIndex: "8", opacity: "1" } as React.CSSProperties}>
            <div className="pg-card" style={{ position: "relative", width: "calc(var(--w) * 1px * var(--k, 1))", aspectRatio: "1.53", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.14)", background: "#111113", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.9),0 0 0 1px rgba(0,0,0,0.5)" }}>
              <img data-lazy-src="/images/work/work-06.webp" alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0", filter: "brightness(0.82) saturate(0.9)" }} />
            </div>
          </div>
        </div>
        <div aria-hidden="true" style={{ position: "absolute", inset: "0", pointerEvents: "none", zIndex: "20", background: "linear-gradient(180deg,#050505 0%,rgba(5,5,5,0) 18%,rgba(5,5,5,0) 78%,#050505 100%),radial-gradient(ellipse 34% 30% at 50% 50%, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.6) 55%, transparent 100%)" }}></div>
        <div className="pg-center" style={{ position: "absolute", inset: "0", zIndex: "30", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px", boxSizing: "border-box", pointerEvents: "none" }}>
          <div className="pg-in" style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "20px", padding: "6px 14px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(5,5,5,0.6)", fontFamily: "var(--font-mono),monospace", fontSize: "12.5px", color: "rgba(255,255,255,0.7)" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "999px", background: "#0066ff", boxShadow: "0 0 12px rgba(0,102,255,0.9)" }} aria-hidden="true"></span>
            {c.eyebrow}
          </div>
          <h2 className="grad pg-in" style={{ margin: "0 0 18px", maxWidth: "900px", fontFamily: "var(--font-space),sans-serif", fontWeight: "600", fontSize: "clamp(40px, 6.4vw, 92px)", lineHeight: "0.95", letterSpacing: "-0.05em", textWrap: "balance" }}>
            {c.title}
          </h2>
          <p className="pg-in" style={{ margin: "0 0 34px", maxWidth: "46ch", fontSize: "17px", lineHeight: "1.6", color: "rgba(255,255,255,0.62)" }}>
            {c.body}
          </p>
          <div className="pg-in">
            <a href="#casos" className="pg-btn btn-w mag" style={{ pointerEvents: "auto", display: "inline-flex", alignItems: "center", gap: "12px", height: "60px", padding: "0 10px 0 28px", borderRadius: "999px", background: "#fafafa", color: "#09090b", textDecoration: "none", fontSize: "17px", fontWeight: "600", letterSpacing: "-0.01em", boxShadow: "0 0 0 8px rgba(255,255,255,0.06),0 0 0 1px rgba(255,255,255,0.4),0 20px 60px -10px rgba(0,102,255,0.55)" }}>
              {c.cta}
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "42px", height: "42px", borderRadius: "999px", background: "#09090b" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 7h10v10"></path>
                  <path d="M7 17 17 7"></path>
                </svg>
              </span>
            </a>
          </div>
        </div>
        <p style={{ position: "absolute", left: "0", right: "0", bottom: "22px", zIndex: "30", margin: "0", textAlign: "center", fontFamily: "var(--font-mono),monospace", fontSize: "11.5px", color: "rgba(255,255,255,0.4)" }}>
          {c.note}
        </p>
      </div>
    </section>
  )
}

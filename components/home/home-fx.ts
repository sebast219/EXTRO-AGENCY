// @ts-nocheck
/**
 * Motion layer of the EXTRO home, ported 1:1 from the Claude Design file
 * (Home.dc.html). It drives the static markup in components/home/* through
 * class selectors (.pg, .mq, [data-bx], .cnt, .rv ...), so those class names
 * and data attributes must be kept when editing the markup.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as Motion from 'motion'
import Lenis from 'lenis'

class HomeFx {
  mount() {
    // Reloj del footer: hora real de Medellín (America/Bogota)
    const fmtClock = new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    const tickClock = () => { const t = fmtClock.format(new Date()); document.querySelectorAll('.ft-clock').forEach((el) => { if (el.textContent !== t) el.textContent = t }) }
    tickClock()
    this._clock = setInterval(tickClock, 1000)
    this._boot = setTimeout(() => { this.initFx(); this.initAdmin(); this.initBento(); this.initPlayground(); this.initArc() }, 80)
  }

  unmount() {
    clearInterval(this._clock)
    clearTimeout(this._boot)
    this._bxDead = true
    if (this._arcRaf) cancelAnimationFrame(this._arcRaf)
    if (this._pgFloats) this._pgFloats.forEach((a) => { try { a.stop() } catch (e) {} })
    if (this._pg) this._pg.revert()
    if (this._bx) this._bx.forEach((fn) => { try { fn() } catch (e) {} })
    if (this._cleanup) this._cleanup.forEach((fn) => { try { fn() } catch (e) {} })
    if (this._ctx) this._ctx.revert()
    if (this._lenis) { this._lenis.destroy(); this._lenis = null }
  }

  // Tecnologías · carrusel arqueado: el centro se acerca, los extremos se alejan
  initArc() {
    const mq = document.querySelector('.mq');
    if (!mq || this._arcOn) return;
    const track = mq.querySelector('.mq-track');
    if (!track) return;
    this._arcOn = true;
    const items = Array.prototype.slice.call(track.children);
    const tick = () => {
      const half = mq.clientWidth / 2 || 1;
      const m = getComputedStyle(track).transform;
      let tx = 0;
      if (m && m !== 'none') { const v = m.match(/-?[\d.e]+/g); if (v) tx = parseFloat(v[v.length === 6 ? 4 : 12]) || 0; }
      for (let i = 0; i < items.length; i++) {
        const el = items[i];
        const x = tx + el.offsetLeft + el.offsetWidth / 2;
        let d = (x - half) / half;
        if (d > 1.4) d = 1.4; else if (d < -1.4) d = -1.4;
        const a = Math.abs(d);
        el.style.transform = 'perspective(700px) translateZ(' + (-300 * d * d).toFixed(1) + 'px) rotateY(' + (-48 * d).toFixed(2) + 'deg) translateY(' + (a * a * 6).toFixed(1) + 'px)';
        el.style.opacity = (1 - 0.35 * Math.min(a, 1)).toFixed(3);
      }
      this._arcRaf = requestAnimationFrame(tick);
    };
    tick();
  }

  // Casos · playground a pantalla completa: sube de golpe, se fija y las fotos suben en profundidad
  initPlayground() {
    const gsap = window.gsap, ST = window.ScrollTrigger, M = window.Motion;
    const sec = document.querySelector('.pg');
    if (!gsap || !ST || !sec || this._pg) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const stage = sec.querySelector('.pg-stage');
    const phs = Array.prototype.slice.call(sec.querySelectorAll('.pg-ph'));
    const ins = Array.prototype.slice.call(sec.querySelectorAll('.pg-in'));
    const live = document.documentElement.scrollHeight > window.innerHeight * 1.4;
    const floats = [];
    this._pg = gsap.context(() => {
      // 1 · Entrada: el escenario sube y se expande hasta ocupar toda la vista
      gsap.fromTo(stage, { scale: 0.88, borderRadius: 40, y: 80 }, {
        scale: 1, borderRadius: 0, y: 0, ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top top', scrub: 0.4 }
      });
      if (!live) return;
      // "De golpe": al asomarse bajando, el scroll se engancha arriba de la sección
      let snapping = false;
      ST.create({
        trigger: sec, start: 'top 72%',
        onEnter: () => {
          if (!this._lenis || snapping) return;
          snapping = true;
          this._lenis.scrollTo(sec, { duration: 0.85, easing: (t) => 1 - Math.pow(1 - t, 4), lock: true, onComplete: () => { snapping = false; } });
          setTimeout(() => { snapping = false; }, 1200);
        }
      });
      // 2 · Fijada: las fotos suben a distintas velocidades (sensación de caída)
      const H = stage.offsetHeight;
      const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: '+=' + Math.round(H * 2.2), pin: true, scrub: 0.6, anticipatePin: 1 } });
      phs.forEach((ph) => {
        const d = parseFloat(ph.getAttribute('data-d')) || 0.5;
        tl.fromTo(ph, { y: H * (0.25 + d * 0.35), rotationX: 18 * d, transformPerspective: 1200, scale: 0.92 + d * 0.06 },
          { y: -H * (0.7 + d * 1.25), rotationX: -6 * d, scale: 1 + d * 0.08, ease: 'none', duration: 1 }, 0);
      });
      tl.fromTo(sec.querySelector('.pg-glow'), { scale: 0.8, opacity: 0.6 }, { scale: 1.25, opacity: 1, ease: 'none', duration: 1 }, 0);
      tl.to(sec.querySelector('.pg-center'), { y: -30, ease: 'none', duration: 1 }, 0);
      gsap.set(sec.querySelector('.pg-field'), { perspective: 1200 });
      // 3 · Caída del contenido central con rebote al fijarse
      if (sec.getBoundingClientRect().top > 2) gsap.set(ins, { opacity: 0, y: -140 });
      ST.create({
        trigger: sec, start: 'top 1%', once: true,
        onEnter: () => {
          if (M) {
            ins.forEach((el, i) => M.animate(el, { opacity: [0, 1], y: [-140 - i * 30, 0] }, { type: 'spring', stiffness: 240, damping: 13, mass: 0.9, delay: 0.08 * i }));
            M.animate(stage, { y: [0, 12, -4, 0] }, { duration: 0.55, delay: 0.32, ease: 'easeOut' });
          } else {
            gsap.to(ins, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'bounce.out' });
          }
        }
      });
    }, sec);
    // Flotación continua de cada foto (Motion), para que el espacio nunca quede quieto
    if (M) phs.forEach((ph, i) => {
      const card = ph.querySelector('.pg-card');
      floats.push(M.animate(card, { y: [0, -10 - (i % 3) * 4, 0], rotate: [0, (i % 2 ? 1 : -1) * 0.8, 0] }, { duration: 5 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }));
    });
    this._pgFloats = floats;
    ST.refresh();
  }

  // Bento · micro-UIs animadas con Motion (motor de Framer Motion)
  // 01 · Software administrativo: el panel cambia según el sector elegido
  initAdmin() {
    const c = document.querySelector('[data-bx="admin"]');
    if (!c || this._adm) return;
    const M = window.Motion;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SEC = {
      construccion: { t: 'obra · demo', l: 'Avance de obra', pre: '', suf: ' %', s: 68, d: 1, lo: 0.1, hi: 0.4, max: 79, dl: '+3,2 %',
        init: [['Compra de cemento', '$ 8,4 M'], ['Corte contratista #3', '$ 12,6 M'], ['Presupuesto ejecutado', '61 %']],
        feed: [['Avance torre A', '+2 pisos'], ['Compra de ladrillo', '$ 5,1 M'], ['Corte contratista #4', '$ 9,8 M'], ['Material a bodega', '120 bultos'], ['Informe de residente', 'Nuevo'], ['Presupuesto ejecutado', '62 %']] },
      comercio: { t: 'panel · hoy', l: 'Ventas de hoy', pre: '$ ', suf: ' M', s: 4.82, d: 2, lo: 0.04, hi: 0.16, max: 9.5, dl: '+12,4 %',
        init: [['Factura #2041', '$ 320.000'], ['Pedido #1187', '$ 96.500'], ['Cliente nuevo', 'Sede Norte']],
        feed: [['Factura #2042', '$ 1.240.000'], ['Pedido #1188', '$ 58.000'], ['Cliente nuevo', 'Sede Centro'], ['Factura #2043', '$ 410.000'], ['Pedido #1189', '$ 212.300'], ['Inventario', '+40 u']] },
      logistica: { t: 'flota · hoy', l: 'Entregas completadas', pre: '', suf: ' / 42', s: 31, d: 0, lo: 1, hi: 0.9, max: 41, dl: '+8 %',
        init: [['Ruta 3 · Centro', 'En camino'], ['Pedido #1187', 'Entregado'], ['Ruta 5 · Norte', 'Salió']],
        feed: [['Ruta 3 · Centro', 'Entregado'], ['Ruta 6 · Sur', 'Salió'], ['Pedido #1190', 'Asignado'], ['Ruta 5 · Norte', 'Entregado'], ['Vehículo 12', 'Mantenimiento'], ['Pedido #1191', 'En camino']] },
      servicios: { t: 'agenda · hoy', l: 'Órdenes de servicio', pre: '', suf: ' hoy', s: 24, d: 0, lo: 1, hi: 0.9, max: 38, dl: '+5 %',
        init: [['Orden #0731', 'Asignada'], ['Visita técnica', '14:30'], ['Cotización #212', 'Enviada']],
        feed: [['Orden #0732', 'Asignada'], ['Cotización #213', 'Aprobada'], ['Visita técnica', '16:00'], ['Orden #0731', 'Cerrada'], ['Cliente nuevo', 'Sede Centro'], ['Factura #0518', 'Pagada']] }
    };
    const q = (x) => c.querySelector(x);
    const rows = Array.prototype.slice.call(c.querySelectorAll('.bx-row'));
    const chips = Array.prototype.slice.call(c.querySelectorAll('.bx-chip'));
    const fmt = (v, d) => v.toFixed(d).replace('.', ',');
    const st = this._adm = { key: 'construccion', total: SEC.construccion.s, fi: 0, sec: SEC };
    const mark = () => chips.forEach((b) => {
      const on = b.getAttribute('data-sec') === st.key;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.style.borderColor = on ? 'rgba(0,102,255,0.6)' : 'rgba(255,255,255,0.12)';
      b.style.background = on ? 'rgba(0,102,255,0.16)' : 'transparent';
      b.style.color = on ? '#7fb2ff' : 'rgba(255,255,255,0.7)';
    });
    const paint = (k) => {
      const x = SEC[k];
      st.key = k; st.total = x.s; st.fi = 0;
      q('.bx-tt').textContent = x.t; q('.bx-lb').textContent = x.l;
      q('.bx-pre').textContent = x.pre; q('.bx-suf').textContent = x.suf;
      q('.bx-kpi').textContent = fmt(x.s, x.d); q('.bx-dl').textContent = x.dl;
      rows.forEach((r, i) => { r.querySelector('.bx-ra').textContent = x.init[i][0]; r.querySelector('.bx-rb').textContent = x.init[i][1]; });
      mark();
    };
    chips.forEach((b) => b.addEventListener('click', () => {
      const k = b.getAttribute('data-sec');
      if (k === st.key) return;
      paint(k);
      if (M && !reduce) {
        M.animate(rows, { opacity: [0, 1], x: [-14, 0] }, { delay: M.stagger(0.07), type: 'spring', stiffness: 380, damping: 30 });
        M.animate(0, SEC[k].s, { duration: 0.8, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => { if (st.key === k) q('.bx-kpi').textContent = fmt(v, SEC[k].d); } });
        M.animate(q('.bx-lb'), { opacity: [0, 1], y: [-6, 0] }, { duration: 0.35 });
      }
    }));
    paint('construccion');
  }

  initBento() {
    const M = window.Motion;
    if (!M || this._bx) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const { animate, inView, stagger, hover } = M;
    const stops = [];
    this._bx = stops;
    const qa = (root, s) => Array.prototype.slice.call(root.querySelectorAll(s));
    const card = (k) => document.querySelector('[data-bx="' + k + '"]');
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const SPR = { type: 'spring', stiffness: 380, damping: 30 };
    const POP = { type: 'spring', stiffness: 520, damping: 22 };
    const SOFT = { type: 'spring', stiffness: 170, damping: 20 };
    const EASE = [0.22, 1, 0.36, 1];

    // Corre un ciclo solo mientras la tarjeta está en pantalla
    const loopIn = (el, fn) => {
      if (!el) return;
      let gen = 0;
      const stop = inView(el, () => {
        const id = ++gen;
        const alive = () => id === gen && !this._bxDead;
        fn(alive).catch(() => {});
        return () => { gen++; };
      }, { amount: 0.35 });
      stops.push(stop);
    };

    // Hover: el micro-UI se eleva con resorte
    document.querySelectorAll('[data-bx]').forEach((c) => {
      const ui = c.querySelector('.bx-ui');
      if (!ui) return;
      const lift = c.getAttribute('data-bx') === 'mobile' ? -16 : -6;
      stops.push(hover(c, () => {
        animate(ui, { y: lift, scale: 1.015 }, SOFT);
        return () => animate(ui, { y: 0, scale: 1 }, SOFT);
      }));
    });

    // 01 · Panel administrativo en vivo (los datos dependen del sector elegido)
    const c1 = card('admin');
    loopIn(c1, async (alive) => {
      const st = this._adm;
      if (!st) return;
      const bars = qa(c1, '.bx-bar'), rows = qa(c1, '.bx-row');
      const kpi = c1.querySelector('.bx-kpi'), kpiw = c1.querySelector('.bx-kpiw');
      const cur = () => st.sec[st.key];
      animate(bars, { scaleY: [0, 1] }, { delay: stagger(0.06), type: 'spring', stiffness: 220, damping: 16 });
      animate(c1.querySelector('.bx-spark'), { strokeDashoffset: [1, 0] }, { duration: 1.6, ease: EASE });
      animate(c1.querySelector('.bx-area'), { opacity: [0, 1] }, { duration: 1.2, delay: 0.6 });
      animate(rows, { opacity: [0, 1], x: [-14, 0] }, { delay: stagger(0.09, { startDelay: 0.5 }), ...SPR });
      { const k0 = st.key, x0 = cur(); animate(0, st.total, { duration: 1.8, ease: EASE, onUpdate: (v) => { if (st.key === k0) kpi.textContent = v.toFixed(x0.d).replace('.', ','); } }); }
      await wait(2800);
      while (alive()) {
        const k0 = st.key, x = cur();
        for (let i = rows.length - 1; i > 0; i--) {
          rows[i].querySelector('.bx-ra').textContent = rows[i - 1].querySelector('.bx-ra').textContent;
          rows[i].querySelector('.bx-rb').textContent = rows[i - 1].querySelector('.bx-rb').textContent;
        }
        const f = x.feed[st.fi++ % x.feed.length];
        rows[0].querySelector('.bx-ra').textContent = f[0];
        rows[0].querySelector('.bx-rb').textContent = f[1];
        animate(rows[0], { opacity: [0, 1], y: [-16, 0], backgroundColor: ['rgba(0,102,255,0.18)', 'rgba(0,102,255,0)'] }, { ...SPR, backgroundColor: { duration: 1.4 } });
        animate(rows.slice(1), { y: [-12, 0] }, { delay: stagger(0.04), ...SPR });
        const from = st.total, p = Math.pow(10, x.d);
        let to = Math.round((from + x.lo + Math.random() * x.hi) * p) / p;
        if (to > x.max) to = x.s;
        st.total = to;
        animate(from, to, { duration: 0.9, ease: EASE, onUpdate: (v) => { if (st.key === k0) kpi.textContent = v.toFixed(x.d).replace('.', ','); } });
        animate(kpiw, { scale: [1, 1.06, 1] }, { duration: 0.5, ease: 'easeOut' });
        bars.forEach((b, i) => animate(b, { scaleY: i === bars.length - 1 ? 1 : 0.55 + Math.random() * 0.45 }, { type: 'spring', stiffness: 260, damping: 15, delay: i * 0.035 }));
        await wait(2900);
      }
    });

    // 02 · Notificaciones que se apilan como en iOS
    const c2 = card('mobile');
    loopIn(c2, async (alive) => {
      const ns = qa(c2, '.bx-ntf');
      const slot = (i) => (i < 3 ? { y: i * 56, opacity: 1, scale: 1 } : { y: 150, opacity: 0, scale: 0.92 });
      const order = ns.slice();
      order.forEach((n, i) => animate(n, slot(i), { duration: 0 }));
      order.slice(0, 3).forEach((n, i) => animate(n, { opacity: [0, 1], y: [i * 56 - 24, i * 56], scale: [0.94, 1] }, { ...SOFT, delay: 0.12 * (2 - i) }));
      await wait(2600);
      while (alive()) {
        order.unshift(order.pop());
        order.forEach((n, i) => {
          if (i === 0) {
            animate(n, { y: -30, opacity: 0, scale: 0.94 }, { duration: 0 });
            animate(n, slot(0), { ...SOFT, delay: 0.08 });
          } else {
            animate(n, slot(i), { type: 'spring', stiffness: 260, damping: 24 });
          }
        });
        await wait(2400);
      }
    });

    // 03 · Deploy a producción
    const c3 = card('web');
    loopIn(c3, async (alive) => {
      const type = c3.querySelector('.bx-type'), fill = c3.querySelector('.bx-fill');
      const logs = qa(c3, '.bx-log'), badge = c3.querySelector('.bx-badge');
      while (alive()) {
        type.style.width = '0ch';
        animate(fill, { scaleX: 0 }, { duration: 0 });
        animate(logs, { opacity: 0, y: 8 }, { duration: 0 });
        animate(badge, { opacity: 0, scale: 0.6 }, { duration: 0 });
        await wait(400);
        await animate(type, { width: ['0ch', '19ch'] }, { duration: 1.05, ease: M.steps(19) });
        await animate(fill, { scaleX: [0, 1] }, { duration: 1.3, ease: [0.65, 0, 0.35, 1] });
        await animate(logs, { opacity: [0, 1], y: [8, 0], filter: ['blur(4px)', 'blur(0px)'] }, { delay: stagger(0.14), ...SPR });
        await animate(badge, { opacity: [0, 1], scale: [0.6, 1] }, POP);
        await wait(2800);
        if (!alive()) break;
        await animate([type, fill, badge].concat(logs), { opacity: [1, 0] }, { duration: 0.35 });
        animate(type, { opacity: 1 }, { duration: 0 });
        animate(fill, { opacity: 1 }, { duration: 0 });
      }
    });

    // 04 · Checkout: método de pago y aprobación
    const c4 = card('shop');
    loopIn(c4, async (alive) => {
      const sel = c4.querySelector('.bx-sel'), chips = qa(c4, '.bx-chip');
      const pay = c4.querySelector('.bx-pay'), lab = c4.querySelector('.bx-pay-l');
      const spin = c4.querySelector('.bx-spin'), ok = c4.querySelector('.bx-pay-ok');
      const st = qa(c4, '.bx-st');
      let k = 0;
      while (alive()) {
        k = (k + 1) % chips.length;
        chips.forEach((ch, i) => animate(ch, { color: i === k ? '#ffffff' : '#a1a1aa' }, { duration: 0.25 }));
        animate(sel, { x: chips[k].offsetLeft }, { type: 'spring', stiffness: 420, damping: 32 });
        animate(st, { color: '#71717a' }, { duration: 0.2 });
        animate(st[0], { color: '#7fb2ff' }, { duration: 0.2 });
        await wait(900);
        await animate(pay, { scale: [1, 0.95, 1] }, { duration: 0.32, ease: 'easeOut' });
        animate(lab, { opacity: 0, y: -8 }, { duration: 0.2 });
        animate(pay, { backgroundColor: '#18181b' }, { duration: 0.25 });
        animate(spin, { opacity: 1 }, { duration: 0.2 });
        await animate(spin, { rotate: [0, 720] }, { duration: 1.1, ease: 'linear' });
        animate(spin, { opacity: 0 }, { duration: 0.15 });
        animate(pay, { backgroundColor: '#0066ff' }, { duration: 0.3 });
        animate(ok, { opacity: [0, 1], y: [10, 0], scale: [0.9, 1] }, POP);
        animate(st[1], { color: '#7fb2ff' }, { duration: 0.3 });
        await wait(700);
        animate(st[2], { color: '#7fb2ff' }, { duration: 0.3 });
        await wait(1600);
        if (!alive()) break;
        animate(ok, { opacity: 0, y: -8 }, { duration: 0.2 });
        animate(pay, { backgroundColor: '#fafafa' }, { duration: 0.3 });
        animate(lab, { opacity: [0, 1], y: [8, 0] }, SPR);
        await wait(700);
      }
    });

    // 05 · Conversación por WhatsApp + alerta
    const c5 = card('chat');
    loopIn(c5, async (alive) => {
      const inc = c5.querySelector('.bx-in'), typing = c5.querySelector('.bx-typing'), out = c5.querySelector('.bx-out');
      const dots = qa(c5, '.bx-dot'), ticks = c5.querySelector('.bx-ticks'), toast = c5.querySelector('.bx-toast'), bell = c5.querySelector('.bx-bell');
      while (alive()) {
        animate([inc, out], { opacity: 0, scale: 0.9, y: 10 }, { duration: 0 });
        animate(typing, { opacity: 0, scale: 0.8 }, { duration: 0 });
        animate(toast, { opacity: 0, y: 26 }, { duration: 0 });
        animate(ticks, { stroke: 'rgba(255,255,255,0.55)' }, { duration: 0 });
        await wait(350);
        await animate(inc, { opacity: 1, scale: 1, y: 0 }, POP);
        await wait(350);
        animate(typing, { opacity: 1, scale: 1 }, POP);
        await animate(dots, { y: [0, -4, 0] }, { duration: 0.5, delay: stagger(0.12), repeat: 2, ease: 'easeInOut' });
        animate(typing, { opacity: 0, scale: 0.8 }, { duration: 0.15 });
        await animate(out, { opacity: 1, scale: 1, y: 0 }, POP);
        animate(ticks, { stroke: '#bfdbfe' }, { duration: 0.4, delay: 0.5 });
        await wait(700);
        await animate(toast, { opacity: 1, y: 0 }, SOFT);
        animate(bell, { rotate: [0, -16, 14, -10, 6, 0] }, { duration: 0.7 });
        await wait(2600);
        if (!alive()) break;
        await animate([inc, out, toast], { opacity: 0 }, { duration: 0.35 });
      }
    });

    // 06 · Agente IA: prompt, herramienta y respuesta en streaming
    const c6 = card('ai');
    loopIn(c6, async (alive) => {
      const prompt = c6.querySelector('.bx-prompt'), tool = c6.querySelector('.bx-tool');
      const tspin = c6.querySelector('.bx-tspin'), tok = c6.querySelector('.bx-tok');
      const words = qa(c6, '.bx-w'), orb = c6.querySelector('.bx-orb');
      animate(orb, { scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }, { duration: 5, repeat: Infinity, ease: 'easeInOut' });
      while (alive()) {
        prompt.style.width = '0ch';
        animate(tool, { opacity: 0, y: 6 }, { duration: 0 });
        animate(tok, { opacity: 0, scale: 0.5 }, { duration: 0 });
        animate(words, { opacity: 0 }, { duration: 0 });
        await wait(400);
        await animate(prompt, { width: ['0ch', '24ch'] }, { duration: 1.2, ease: M.steps(24) });
        await animate(tool, { opacity: 1, y: 0 }, SPR);
        animate(tspin, { opacity: 1 }, { duration: 0.1 });
        await animate(tspin, { rotate: [0, 720] }, { duration: 1, ease: 'linear' });
        animate(tspin, { opacity: 0 }, { duration: 0.1 });
        animate(tok, { opacity: 1, scale: 1 }, POP);
        await animate(words, { opacity: [0, 1], filter: ['blur(6px)', 'blur(0px)'], y: [4, 0] }, { delay: stagger(0.07), duration: 0.45, ease: EASE });
        await wait(3000);
        if (!alive()) break;
        await animate([tool].concat(words), { opacity: 0 }, { duration: 0.3 });
      }
    });

    // 07 · Hub de integraciones con peticiones viajando
    const c7 = card('api');
    loopIn(c7, async (alive) => {
      const pl = qa(c7, '.bx-pl'), pr = qa(c7, '.bx-pr'), nl = qa(c7, '.bx-nl rect'), nr = qa(c7, '.bx-nr rect');
      const core = c7.querySelector('.bx-core'), dot = c7.querySelector('.bx-pulse'), req = c7.querySelector('.bx-req');
      const m = c7.querySelector('.bx-m'), p = c7.querySelector('.bx-p'), ms = c7.querySelector('.bx-ms');
      const calls = [['POST', '/v1/pedidos'], ['GET', '/v1/clientes'], ['POST', '/v1/facturas'], ['PUT', '/v1/inventario'], ['POST', '/v1/pagos']];
      const travel = (path, dur) => {
        const len = path.getTotalLength();
        return animate(0, 1, { duration: dur, ease: [0.45, 0, 0.55, 1], onUpdate: (v) => { const pt = path.getPointAtLength(v * len); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y); } });
      };
      const base = 'rgba(255,255,255,0.14)', hot = 'rgba(0,102,255,0.9)';
      let n = 0;
      while (alive()) {
        const a = Math.floor(Math.random() * pl.length), b = Math.floor(Math.random() * pr.length);
        animate(nl[a], { stroke: hot }, { duration: 0.2 });
        animate(dot, { opacity: 1 }, { duration: 0.15 });
        await travel(pl[a], 0.65);
        animate(nl[a], { stroke: base }, { duration: 0.5 });
        animate(core, { scale: [1, 1.14, 1] }, { duration: 0.45, ease: 'easeOut' });
        await travel(pr[b], 0.65);
        animate(dot, { opacity: 0 }, { duration: 0.2 });
        nr.forEach((r, i) => animate(r, { stroke: i === b ? hot : base }, { duration: 0.3 }));
        const c = calls[n++ % calls.length];
        await animate(req, { y: [0, -10], opacity: [1, 0] }, { duration: 0.18 });
        m.textContent = c[0]; p.textContent = c[1]; ms.textContent = (40 + Math.round(Math.random() * 90)) + ' ms';
        animate(req, { y: [10, 0], opacity: [0, 1] }, SPR);
        await wait(900);
      }
    });
  }

  initFx() {
    const gsap = window.gsap, ST = window.ScrollTrigger;
    if (!gsap || !ST || this._ctx) return;
    gsap.registerPlugin(ST);
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    const $ = (q) => Array.prototype.slice.call(document.querySelectorAll(q));
    this._cleanup = [];
    const on = (el, ev, fn) => { el.addEventListener(ev, fn); this._cleanup.push(() => el.removeEventListener(ev, fn)); };

    // Scroll suave tipo Framer (solo cuando la página realmente se desplaza)
    if (!reduce && window.Lenis && document.documentElement.scrollHeight > window.innerHeight * 1.4) {
      const lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true, anchors: { offset: -80 } });
      this._lenis = lenis;
      lenis.on('scroll', ST.update);
      const tick = (t) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      this._cleanup.push(() => gsap.ticker.remove(tick));
    }

    this._ctx = gsap.context(() => {
      const EASE = 'expo.out';

      // Barra de progreso de lectura
      gsap.to('.xp', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

      // Nav que se compacta al bajar
      const nav = document.querySelector('.nav');
      if (nav) ST.create({ start: 80, end: 'max', onToggle: (self) => nav.classList.toggle('is-scrolled', self.isActive) });

      if (reduce) return;

      // ---- HERO: entrada coreografiada ----
      const tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.from('.nav', { y: -30, opacity: 0, duration: 1 }, 0)
        .from('.h-pill', { y: 16, opacity: 0, filter: 'blur(6px)', duration: 0.9 }, 0.1)
        .from('.wi', { yPercent: 115, rotate: 4, duration: 1.2, stagger: 0.055 }, 0.2)
        .from('.h-in', { y: 22, opacity: 0, filter: 'blur(8px)', duration: 1, stagger: 0.1 }, 0.55)
        .from('.h-win', { y: 90, opacity: 0, duration: 1.6 }, 0.7)
        .from('.t-line', { opacity: 0, x: -10, duration: 0.45, stagger: 0.28, ease: 'power2.out' }, 1.3);

      // Ventana de despliegue: se "levanta" en 3D al hacer scroll
      gsap.fromTo('.h-win-in', { rotateX: 14, scale: 0.94 }, {
        rotateX: 0, scale: 1, ease: 'none',
        scrollTrigger: { trigger: '.h-win', start: 'top 95%', end: 'top 25%', scrub: 0.8 }
      });

      // Luz del hero que sigue al cursor
      const spot = document.querySelector('.h-spot'), hero = document.getElementById('inicio');
      if (spot && hero && fine) {
        const xTo = gsap.quickTo(spot, 'x', { duration: 1.2, ease: 'power3' });
        const yTo = gsap.quickTo(spot, 'y', { duration: 1.2, ease: 'power3' });
        on(hero, 'pointermove', (e) => {
          const r = hero.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * 0.6);
          yTo((e.clientY - r.top - r.height * 0.38) * 0.6);
        });
      }

      // ---- Reveal genérico (blur + subida, estilo Framer) ----
      const rise = (targets, extra) => {
        gsap.utils.toArray(targets).forEach((el) => {
          gsap.from(el, Object.assign({
            y: 32, opacity: 0, filter: 'blur(10px)', duration: 1.1, ease: EASE,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true }
          }, extra || {}));
        });
      };
      rise('.rv');
      rise('h2.rv + p');

      // Cifras: celdas + contadores
      ST.batch('section[aria-label="Cifras"] .cell', {
        start: 'top 90%', once: true,
        onEnter: (els) => gsap.from(els, { y: 30, opacity: 0, filter: 'blur(8px)', duration: 1, stagger: 0.09, ease: EASE })
      });
      $('.cnt').forEach((el) => {
        const to = parseFloat(el.getAttribute('data-to')) || 0;
        const o = { v: 0 };
        ST.create({
          trigger: el, start: 'top 92%', once: true,
          onEnter: () => gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v); } })
        });
      });

      // Bento: entrada escalonada + spotlight + inclinación 3D
      gsap.set('.bcard', { transformPerspective: 1100 });
      ST.batch('.bcard', {
        start: 'top 90%', once: true,
        onEnter: (els) => gsap.from(els, { y: 60, opacity: 0, scale: 0.97, filter: 'blur(10px)', duration: 1.2, stagger: 0.1, ease: EASE })
      });
      if (fine) $('.bcard').forEach((card) => {
        const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' });
        const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
        on(card, 'pointermove', (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          card.style.setProperty('--mx', (px * 100) + '%');
          card.style.setProperty('--my', (py * 100) + '%');
          ry((px - 0.5) * 5); rx((0.5 - py) * 5);
        });
        on(card, 'pointerleave', () => { rx(0); ry(0); });
      });

      // Para quién
      ST.batch('.pq', { start: 'top 88%', once: true, onEnter: (els) => gsap.from(els, { y: 40, opacity: 0, filter: 'blur(8px)', duration: 1.1, stagger: 0.12, ease: EASE }) });

      // Casos: entrada + parallax de la captura
      ST.batch('.case', { start: 'top 90%', once: true, onEnter: (els) => gsap.from(els, { y: 70, opacity: 0, duration: 1.2, stagger: 0.12, ease: EASE }) });
      $('.case-img').forEach((img) => {
        gsap.fromTo(img, { scale: 1.18, yPercent: -6 }, { scale: 1, yPercent: 6, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } });
      });

      // Proceso: la línea se llena con el scroll y enciende cada paso
      const steps = $('.p-step'), dots = $('.p-dot');
      if (steps.length) {
        gsap.set(steps, { opacity: 0.35 });
        const pt = gsap.timeline({ scrollTrigger: { trigger: '.p-track', start: 'top 78%', end: 'top 30%', scrub: 0.6 } });
        pt.fromTo('.p-fill', { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 1 }, 0);
        steps.forEach((st, i) => {
          const at = (i / Math.max(1, steps.length - 1)) * 0.96;
          pt.to(st, { opacity: 1, duration: 0.08 }, at)
            .to(dots[i], { backgroundColor: '#0066ff', borderColor: '#0066ff', boxShadow: '0 0 16px rgba(0,102,255,0.9)', scale: 1.25, duration: 0.08 }, at);
        });
      }

      // FAQ y reserva
      rise('#faq .faq-btn', { y: 16, duration: 0.8 });
      rise('.r-card', { y: 60, scale: 0.98 });

      // CTA: las palabras se encienden al hacer scroll
      gsap.fromTo('.cta-w', { opacity: 0.12, y: 18 }, {
        opacity: 1, y: 0, stagger: 0.12, ease: 'none',
        scrollTrigger: { trigger: '#contacto', start: 'top 80%', end: 'top 25%', scrub: 0.6 }
      });

      // Footer
      rise('#footer h2', { y: 60 });

      // Botones magnéticos
      if (fine) $('.mag').forEach((b) => {
        const bx = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3' });
        const by = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3' });
        on(b, 'pointermove', (e) => {
          const r = b.getBoundingClientRect();
          bx((e.clientX - r.left - r.width / 2) * 0.25);
          by((e.clientY - r.top - r.height / 2) * 0.35);
        });
        on(b, 'pointerleave', () => { gsap.to(b, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' }); });
      });
    });
    ST.refresh();
  }

}

export function startHomeFx() {
  window.gsap = gsap
  window.ScrollTrigger = ScrollTrigger
  window.Motion = Motion
  window.Lenis = Lenis
  const fx = new HomeFx()
  fx.mount()
  return () => fx.unmount()
}

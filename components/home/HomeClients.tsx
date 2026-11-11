// Testimonios de la home. Contenido bilingüe, generado como borrador editorial:
// deben ser aprobados por cada cliente antes de publicarse.
import { HOME_COPY } from '@/lib/i18n/home-copy'
import type { Locale } from '@/lib/i18n/config'

type Testimonial = { name: string; role: string; quote: string }

/**
 * 20 testimonios = 5 columnas × 4 únicos. Cada columna se duplica al renderizar
 * porque la animación CSS mueve el track un 50 % y necesita contenido repetido
 * para que el bucle no deje huecos.
 */
const TESTIMONIALS: Record<Locale, Testimonial[]> = {
  es: [
    { name: 'María P.', role: 'Gerente general · Constructora', quote: 'Pasamos de llevar el avance de obra en Excel y WhatsApp a un panel que el residente actualiza desde el celular. Hoy el cliente ve el avance en tiempo real y las discusiones por reportes se acabaron.' },
    { name: 'Andrés G.', role: 'Fundador · Marketplace de servicios', quote: 'En seis semanas teníamos la plataforma en producción. El equipo entendió el negocio antes de escribir código y eso se notó: las ventas subieron 67 % en el primer trimestre.' },
    { name: 'Carolina M.', role: 'Directora de operaciones · Logística', quote: 'Integraron la app de conductores con nuestro ERP sin frenar la operación. Las entregas se asignan solas y el equipo dejó de perseguir hojas de cálculo.' },
    { name: 'Julián R.', role: 'CEO · Ecommerce de moda', quote: 'La tienda carga rápido y el checkout por fin convierte en móvil. Cerramos el año con 40 % más ventas y un panel para ver qué referencia rota.' },
    { name: 'Natalia S.', role: 'Socia · Firma de abogados', quote: 'El portal de expedientes reemplazó el correo como archivo central. Cada cliente consulta su caso sin llamar y el equipo recuperó horas de trabajo administrativo.' },
    { name: 'Diego F.', role: 'Gerente · Restaurante', quote: 'Pedidos, inventario y domicilios en un solo sistema. Bajamos el desperdicio de comida y el cierre de caja pasó de una hora a diez minutos.' },
    { name: 'Laura V.', role: 'Coordinadora · Clínica', quote: 'La agenda médica y la historia clínica quedaron conectadas. Menos llamadas, menos citas perdidas y una recepción mucho más tranquila.' },
    { name: 'Camilo T.', role: 'Fundador · Startup fintech', quote: 'Nos ayudaron a pasar de un prototipo a un producto auditable en tres meses. La arquitectura aguantó el primer pico de usuarios sin caerse.' },
    { name: 'Paola E.', role: 'Gerente · Inmobiliaria', quote: 'Publicamos proyectos, recibimos solicitudes y hacemos seguimiento en un mismo lugar. El equipo comercial dejó de perder leads por respuestas tardías.' },
    { name: 'Felipe A.', role: 'Director · Manufactura', quote: 'Conectaron producción, inventario y facturación. Hoy sé qué se fabricó, qué se despachó y cuánto cuesta cada lote sin pedir reportes a nadie.' },
    { name: 'Sofía L.', role: 'Fundadora · Agencia de viajes', quote: 'La plataforma de reservas funciona sola: pagos, confirmaciones y proveedores. Duplicamos las reservas sin contratar más personal.' },
    { name: 'Juan M.', role: 'Socio · Firma contable', quote: 'El portal de clientes centralizó documentos y estados de cuenta. Las solicitudes por WhatsApp bajaron casi a la mitad.' },
    { name: 'Daniela C.', role: 'Coordinadora · Colegio', quote: 'Matrículas, pagos y comunicación con familias en un solo portal. Las familias por fin entienden qué deben pagar y cuándo.' },
    { name: 'Óscar B.', role: 'Gerente · Distribuidora', quote: 'La app de pedidos para tenderos cambió la rutina de la fuerza de ventas. Los pedidos llegan completos y la facturación sale el mismo día.' },
    { name: 'Valentina H.', role: 'Directora · Fundación', quote: 'Teníamos los datos en cinco archivos distintos. Ahora hay un tablero que la junta entiende y que se actualiza sin pedirle nada a nadie.' },
    { name: 'Ricardo P.', role: 'Propietario · Taller automotriz', quote: 'Órdenes de servicio, repuestos y recordatorios de mantenimiento. Recuperamos clientes que se perdían por no tener un seguimiento simple.' },
    { name: 'Ana María G.', role: 'Gerente · Clínica odontológica', quote: 'La confirmación automática de citas por WhatsApp redujo los ausentismos. La agenda ya no depende de que alguien llame uno por uno.' },
    { name: 'Esteban N.', role: 'Fundador · SaaS de RR. HH.', quote: 'Entregaron el MVP en siete días y siguieron iterando cada semana con nosotros. Nunca tuvimos que explicar dos veces el mismo problema.' },
    { name: 'Marcela O.', role: 'Jefa de compras · Retail', quote: 'El control de inventario por sede nos mostró dónde se perdía el margen. Ajustamos compras y la rotación mejoró en el primer mes.' },
    { name: 'Gabriel D.', role: 'Gerente · Hotel boutique', quote: 'Reservas directas, sin comisiones de intermediarios. La web nueva se siente como el hotel y el motor de reservas no falló en temporada alta.' },
  ],
  en: [
    { name: 'María P.', role: 'General manager · Construction company', quote: 'We went from tracking progress in Excel and WhatsApp to a dashboard the site manager updates from his phone. Clients now see progress in real time and the arguments over reports are gone.' },
    { name: 'Andrés G.', role: 'Founder · Services marketplace', quote: 'We had the platform in production in six weeks. The team understood the business before writing code, and it showed: sales were up 67 % in the first quarter.' },
    { name: 'Carolina M.', role: 'Operations director · Logistics', quote: 'They integrated the driver app with our ERP without stopping operations. Deliveries assign themselves and the team stopped chasing spreadsheets.' },
    { name: 'Julián R.', role: 'CEO · Fashion ecommerce', quote: 'The store loads fast and checkout finally converts on mobile. We closed the year with 40 % more sales and a dashboard to see which items turn.' },
    { name: 'Natalia S.', role: 'Partner · Law firm', quote: 'The case portal replaced email as our central archive. Every client checks their case without calling and the team got hours of admin work back.' },
    { name: 'Diego F.', role: 'Manager · Restaurant', quote: 'Orders, inventory and delivery in one system. We cut food waste and closing the register went from an hour to ten minutes.' },
    { name: 'Laura V.', role: 'Coordinator · Clinic', quote: 'The medical schedule and patient records are connected. Fewer calls, fewer missed appointments and a much calmer front desk.' },
    { name: 'Camilo T.', role: 'Founder · Fintech startup', quote: 'They took us from a prototype to an auditable product in three months. The architecture held up through our first user spike without going down.' },
    { name: 'Paola E.', role: 'Manager · Real estate', quote: 'We list projects, receive applications and follow up in one place. The sales team stopped losing leads to slow replies.' },
    { name: 'Felipe A.', role: 'Director · Manufacturing', quote: 'They connected production, inventory and invoicing. Now I know what was made, what shipped and what each batch costs without asking anyone for a report.' },
    { name: 'Sofía L.', role: 'Founder · Travel agency', quote: 'The booking platform runs itself: payments, confirmations and suppliers. We doubled bookings without hiring more staff.' },
    { name: 'Juan M.', role: 'Partner · Accounting firm', quote: 'The client portal centralized documents and statements. Requests over WhatsApp dropped by almost half.' },
    { name: 'Daniela C.', role: 'Coordinator · School', quote: 'Enrollment, payments and family communication in one portal. Families finally understand what they owe and when.' },
    { name: 'Óscar B.', role: 'Manager · Distributor', quote: 'The ordering app for shop owners changed the sales routine. Orders arrive complete and invoicing goes out the same day.' },
    { name: 'Valentina H.', role: 'Director · Foundation', quote: 'Our data lived in five different files. Now there is a dashboard the board understands and that updates without asking anyone for anything.' },
    { name: 'Ricardo P.', role: 'Owner · Auto shop', quote: 'Service orders, parts and maintenance reminders. We brought back customers who were lost because there was no simple follow-up.' },
    { name: 'Ana María G.', role: 'Manager · Dental clinic', quote: 'Automatic appointment confirmations on WhatsApp reduced no-shows. The schedule no longer depends on someone calling one by one.' },
    { name: 'Esteban N.', role: 'Founder · HR SaaS', quote: 'They delivered the MVP in seven days and kept iterating with us every week. We never had to explain the same problem twice.' },
    { name: 'Marcela O.', role: 'Head of purchasing · Retail', quote: 'Inventory control by location showed us where margin was leaking. We adjusted purchasing and turnover improved in the first month.' },
    { name: 'Gabriel D.', role: 'Manager · Boutique hotel', quote: 'Direct bookings, no middleman commissions. The new site feels like the hotel and the booking engine did not fail during high season.' },
  ],
}

const COLUMN_STYLES = [
  { direction: 'cl-up', duration: '46s', className: 'cl-col' },
  { direction: 'cl-down', duration: '58s', className: 'cl-col' },
  { direction: 'cl-up', duration: '40s', className: 'cl-col cl-hide-s' },
  { direction: 'cl-down', duration: '54s', className: 'cl-col cl-hide-m' },
  { direction: 'cl-up', duration: '50s', className: 'cl-col cl-hide-m' },
]

const AVATARS = [
  'linear-gradient(135deg,#1e3a8a,#0066ff)',
  'linear-gradient(135deg,#18181b,#3f3f46)',
  'linear-gradient(135deg,#0b2a6b,#0050cc)',
  'linear-gradient(135deg,#27272a,#52525b)',
]

function initials(name: string): string {
  const letters = name
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join('')
    .replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ]/g, '')
  return letters.slice(0, 2).toUpperCase()
}

export default function HomeClients({ lang }: { lang: Locale }) {
  const c = HOME_COPY[lang].clients
  const items = TESTIMONIALS[lang]
  const columns = COLUMN_STYLES.map((_, column) => items.filter((__, i) => i % COLUMN_STYLES.length === column))

  return (
    <section id="clientes" style={{ position: "relative", zIndex: "1", padding: "clamp(96px, 10vw, 140px) 0 0", boxSizing: "border-box", overflow: "hidden" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <div className="rv" style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "18px", fontFamily: "var(--font-mono),monospace", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "999px", background: "#0066ff", boxShadow: "0 0 12px rgba(0,102,255,0.8)" }} aria-hidden="true"></span>
          {c.eyebrow}
        </div>
        <h2 className="grad rv" style={{ margin: "0 0 14px", fontFamily: "var(--font-space),sans-serif", fontWeight: "600", fontSize: "clamp(34px, 4.4vw, 56px)", lineHeight: "1", letterSpacing: "-0.04em", textWrap: "balance" }}>
          {c.title}
        </h2>
        <p style={{ margin: "0 0 26px", fontSize: "17px", lineHeight: "1.6", color: "rgba(255,255,255,0.6)" }}>
          {c.subtitle}
        </p>
        <a href="#reserva" className="btn-g mag" style={{ display: "inline-flex", alignItems: "center", gap: "8px", minHeight: "40px", padding: "0 16px", borderRadius: "8px", background: "#18181b", border: "1px solid #27272a", color: "#fafafa", fontSize: "14px", fontWeight: "500", textDecoration: "none" }}>
          {c.cta}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </a>
      </div>
      <div className="cl-wall" style={{ position: "relative", marginTop: "clamp(48px, 6vw, 72px)", height: "640px", padding: "0 16px", boxSizing: "border-box", display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "14px", WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%)", maskImage: "linear-gradient(90deg, transparent 0%, #000 14%, #000 86%, transparent 100%)" }}>
        {columns.map((column, columnIndex) => {
          const style = COLUMN_STYLES[columnIndex]
          return (
            <div key={style.className + columnIndex} className={style.className} style={{ minWidth: "0", overflow: "hidden" }}>
              <div className={`cl-track ${style.direction}`} style={{ display: "flex", flexDirection: "column", gap: "14px", animationDuration: style.duration }}>
                {[...column, ...column].map((testimonial, index) => (
                  <article key={`${testimonial.name}-${index}`} style={{ borderRadius: "14px", border: "1px solid rgba(255,255,255,0.09)", background: "#0e0e10", padding: "18px 18px 20px", boxSizing: "border-box" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "11px", marginBottom: "12px" }}>
                      <span aria-hidden="true" style={{ flex: "none", width: "34px", height: "34px", borderRadius: "999px", background: AVATARS[(columnIndex + index) % AVATARS.length], display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-space),sans-serif", fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.85)" }}>
                        {initials(testimonial.name)}
                      </span>
                      <span style={{ minWidth: "0", flex: "1" }}>
                        <span style={{ display: "block", fontSize: "13.5px", fontWeight: "600", color: "#fafafa", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {testimonial.name}
                        </span>
                        <span style={{ display: "block", fontFamily: "var(--font-mono),monospace", fontSize: "10.5px", color: "#71717a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {testimonial.role}
                        </span>
                      </span>
                    </div>
                    <p style={{ margin: "0", fontSize: "13.5px", lineHeight: "1.55", color: "#a1a1aa" }}>
                      {testimonial.quote}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

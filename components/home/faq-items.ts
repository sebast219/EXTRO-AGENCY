/**
 * FAQ de la home. Única fuente: la UI (HomeFaq) y el JSON-LD de la página la
 * leen de aquí, cada uno en su idioma.
 */
import type { Locale } from '@/lib/i18n/config'

export type FaqItem = { q: string; a: string }

const ES: FaqItem[] = [
  {
    q: '¿Trabajan con emprendimientos o solo con empresas grandes?',
    a: 'Con ambos. Un emprendimiento recibe el mismo nivel de ingeniería que una empresa; lo que cambia es el alcance. Ajustamos el proyecto a tu etapa y a tu presupuesto, sin sacrificar calidad.',
  },
  {
    q: '¿Cómo se define el precio?',
    a: 'Cotizamos por alcance y te damos un precio fijo antes de empezar. Si el alcance cambia en el camino, ajustamos la cotización solo con tu aprobación.',
  },
  {
    q: '¿Cuánto tarda un proyecto?',
    a: 'Empezamos en 48 horas y la primera entrega funcional llega en 7 días. El tiempo total depende del alcance, y cada semana ves avances reales en producción.',
  },
  {
    q: '¿Quién es dueño del código?',
    a: 'Tú. El código, la base de datos y la infraestructura quedan a tu nombre desde el primer día, alojados donde decidas, con acceso completo.',
  },
  {
    q: '¿Qué pasa después de la entrega?',
    a: 'Puedes cerrar ahí o seguir con nosotros para mejoras, nuevas funciones y soporte. Cada nueva fase se cotiza con la misma transparencia.',
  },
  {
    q: '¿Y si no me gusta lo que recibo?',
    a: 'Tienes una garantía de 1 a 3 meses según el nivel del proyecto, con acompañamiento para corregir lo que no te convenza. Revisamos cada avance semanal contigo y ajustamos sobre la marcha.',
  },
  {
    q: '¿Trabajan con empresas que ya tienen equipo de tecnología?',
    a: 'Sí. Nos integramos con tu equipo actual para acelerar tu hoja de ruta o tomar proyectos específicos, sin reemplazar a nadie.',
  },
]

const EN: FaqItem[] = [
  {
    q: 'Do you work with startups or only large companies?',
    a: 'Both. A startup gets the same level of engineering as an enterprise; what changes is the scope. We fit the project to your stage and your budget without sacrificing quality.',
  },
  {
    q: 'How is the price defined?',
    a: 'We quote by scope and give you a fixed price before we start. If the scope changes along the way, we adjust the quote only with your approval.',
  },
  {
    q: 'How long does a project take?',
    a: 'We start within 48 hours and the first working delivery lands in 7 days. Total time depends on scope, and every week you see real progress shipped to production.',
  },
  {
    q: 'Who owns the code?',
    a: 'You do. The code, the database and the infrastructure are in your name from day one, hosted wherever you decide, with full access.',
  },
  {
    q: 'What happens after delivery?',
    a: 'You can stop there or stay with us for improvements, new features and support. Each new phase is quoted with the same transparency.',
  },
  {
    q: 'What if I do not like what I receive?',
    a: 'You get a 1 to 3 month guarantee depending on the project level, with support to fix anything that does not work for you. We review every weekly delivery with you and adjust as we go.',
  },
  {
    q: 'Do you work with companies that already have a tech team?',
    a: 'Yes. We plug into your current team to speed up your roadmap or take specific projects, without replacing anyone.',
  },
]

export function getFaqItems(lang: Locale): FaqItem[] {
  return lang === 'en' ? EN : ES
}

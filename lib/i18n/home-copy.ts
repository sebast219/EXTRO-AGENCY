/**
 * Copy de la home en español e inglés.
 *
 * Vive en un solo módulo para que ambas versiones se revisen juntas y no se
 * desincronicen: si se cambia una cifra, una garantía o un CTA, el cambio se
 * hace en los dos idiomas en el mismo diff.
 */

import type { Locale } from './config'

export type SectorKey = 'construccion' | 'comercio' | 'logistica' | 'servicios'

export type AnswerWord = { text: string; kind?: 'strong' | 'accent' }

export type HomeCopy = {
  nav: {
    aria: string
    homeAria: string
    solutions: string
    cases: string
    process: string
    faq: string
    whatsapp: string
    cta: string
    ctaShort: string
    menu: string
    close: string
    language: string
  }
  hero: {
    badge: string
    titleWords: string[]
    titleAria: string
    subtitle: string
    primary: string
    secondary: string
    guarantees: string[]
    window: { title: string; live: string }
    terminal: {
      command: string
      client: string
      done: string[]
      working: string
      url: string
      note: string
    }
  }
  stats: {
    aria: string
    cells: { label: string; value: string; suffix: string; counter: boolean }[]
  }
  tech: { aria: string }
  solutions: {
    eyebrow: string
    title: string
    intro: string
    admin: {
      title: string
      before: string
      strong: string
      after: string
      sectorAria: string
      sectors: Record<SectorKey, string>
      bullets: string[]
      demo: { window: string; live: string; label: string; value: string; delta: string; rows: { a: string; b: string }[] }
    }
    mobile: {
      title: string
      strong: string
      after: string
      notifications: { title: string; time: string; body: string }[]
    }
    web: {
      title: string
      before: string
      strong: string
      after: string
      url: string
      command: string
      flag: string
      logs: string[]
      badge: string
    }
    shop: {
      title: string
      strong: string
      after: string
      product: string
      qty: string
      price: string
      methods: string[]
      pay: string
      approved: string
      steps: string[]
      stock: { title: string; body: string }
    }
    chat: {
      title: string
      strong: string
      after: string
      incoming: string
      incomingTime: string
      outgoing: string
      outgoingTime: string
      toastTitle: string
      toastBody: string
    }
    ai: {
      title: string
      before: string
      strong: string
      after: string
      prompt: string
      tool: string
      answer: AnswerWord[]
      badges: string[]
    }
    api: {
      title: string
      before: string
      strong: string
      after: string
      nodes: { erp: string; crm: string; store: string; payments: string; invoice: string; whatsapp: string }
      request: { method: string; path: string; status: string; ms: string }
    }
  }
  cases: {
    eyebrow: string
    title: string
    body: string
    cta: string
    note: string
    metrics: { value: string; label: string }[]
  }
  process: {
    eyebrow: string
    title: string
    intro: string
    steps: { title: string; body: string }[]
  }
  cta: {
    heading: string[]
    body: string
    button: string
  }
  booking: {
    title: string
    subtitle: string
    pills: string[]
    steps: string[]
    prevMonth: string
    nextMonth: string
    dayAria: (day: number, month: string, unavailable: boolean) => string
    dayHint: string
    loading: string
    morning: string
    afternoon: string
    back: string
    name: string
    namePlaceholder: string
    email: string
    emailPlaceholder: string
    notes: string
    notesPlaceholder: string
    consentBefore: string
    consentLink: string
    consentAfter: string
    submit: string
    submitting: string
    successTitle: string
    successBody: string
    join: string
    again: string
    error: string
    months: string[]
    days: string[]
  }
  faq: { eyebrow: string; title: string; contact: string }
  clients: { eyebrow: string; title: string; subtitle: string; cta: string }
  footer: {
    homeAria: string
    navAria: string
    role: string[]
    city: string
    clockAria: string
    cta: string
    heading: string[]
    ready: string
    readySub: string
    callNote: string
    contact: string
    studio: string
    explore: string
    connect: string
    studioLines: string[]
    exploreLinks: { solutions: string; cases: string; process: string; booking: string; faq: string }
    backToTop: string
    legal: { data: string; terms: string; security: string }
    rights: string
  }
}

const es: HomeCopy = {
  nav: {
    aria: 'Navegación principal',
    homeAria: 'EXTRO, ir al inicio',
    solutions: 'Soluciones',
    cases: 'Casos',
    process: 'Proceso',
    faq: 'FAQ',
    whatsapp: 'WhatsApp',
    cta: 'Cotizar proyecto',
    ctaShort: 'Cotizar',
    menu: 'Abrir menú',
    close: 'Cerrar menú',
    language: 'Cambiar idioma',
  },
  hero: {
    badge: 'Avances constantes · en producción',
    titleWords: ['Software', 'a', 'medida.', 'En', 'producción', 'en', '7', 'días.'],
    titleAria: 'Software a medida. En producción en 7 días.',
    subtitle:
      'Ingeniería de producto para equipos que no pueden esperar meses. Precio fijo, avances constantes en cada fase y el código es tuyo desde el primer día.',
    primary: 'Agendar llamada de 15 min',
    secondary: 'Ver en producción',
    guarantees: ['+ Precio fijo', '+ Código 100 % tuyo', '+ Empezamos en 48 h'],
    window: { title: 'tu-empresa · producción', live: 'en vivo' },
    terminal: {
      command: 'extro deploy --cliente',
      client: '"tu-empresa"',
      done: ['Alcance y precio fijo aprobados', 'Arquitectura y base de datos', 'Panel administrativo + integraciones'],
      working: 'Desplegando a producción…',
      url: 'app.tu-empresa.com',
      note: '· código entregado a tu repositorio',
    },
  },
  stats: {
    aria: 'Cifras',
    cells: [
      { label: 'Para empezar', value: '48', suffix: ' h', counter: true },
      { label: 'Primera entrega', value: '7', suffix: ' días', counter: true },
      { label: 'El código es tuyo', value: '100', suffix: ' %', counter: true },
      { label: 'De soporte post-entrega', value: '1–3', suffix: ' meses', counter: false },
    ],
  },
  tech: { aria: 'Tecnologías' },
  solutions: {
    eyebrow: 'Soluciones',
    title: 'Lo que tu operación necesita. Construido, desplegado, tuyo.',
    intro:
      'La misma ingeniería para una startup y para una empresa. Lo único que cambia es el alcance.',
    admin: {
      title: 'Software administrativo a la medida',
      before: 'Reemplaza ',
      strong: 'Excel, WhatsApp y papel',
      after: ' con un solo sistema hecho para tu sector.',
      sectorAria: 'Elige tu sector',
      sectors: { construccion: 'Construcción', comercio: 'Comercio', logistica: 'Logística', servicios: 'Servicios' },
      bullets: ['Roles y permisos por usuario', 'Paneles en tiempo real', 'Varias sedes, obras o bodegas'],
      demo: {
        window: 'obra · demo',
        live: 'en vivo',
        label: 'Avance de obra',
        value: '68,0',
        delta: '+3,2 %',
        rows: [
          { a: 'Compra de cemento', b: '$ 8,4 M' },
          { a: 'Corte contratista #3', b: '$ 12,6 M' },
          { a: 'Presupuesto ejecutado', b: '61 %' },
        ],
      },
    },
    mobile: {
      title: 'Apps móviles',
      strong: 'Apps para iOS y Android',
      after: ', para tus clientes o tu equipo en campo.',
      notifications: [
        { title: 'Pedido #1048', time: 'ahora', body: 'Listo para entregar' },
        { title: 'Ruta 3', time: 'ahora', body: 'El repartidor va en camino' },
        { title: 'Pago aprobado', time: 'ahora', body: '$ 189.900 · Tarjeta' },
        { title: 'Nuevo cliente', time: 'ahora', body: 'Ana R. creó su cuenta' },
      ],
    },
    web: {
      title: 'Apps web',
      before: 'Plataformas y portales ',
      strong: 'en producción en semanas',
      after: '. Rápidas desde cualquier navegador.',
      url: 'app.tuempresa.co',
      command: 'extro deploy ',
      flag: '--prod',
      logs: ['build optimizado · 1,2 s', 'CDN · 3 regiones', 'SSL activo'],
      badge: 'En producción',
    },
    shop: {
      title: 'Ecommerce y pagos',
      strong: 'Vende en línea',
      after: ' con catálogo, pagos y envíos integrados.',
      product: 'Kit de inicio',
      qty: 'Cantidad 2',
      price: '$ 189.900',
      methods: ['Tarjeta', 'PSE', 'Nequi'],
      pay: 'Pagar $ 189.900',
      approved: 'Pago aprobado',
      steps: ['Pedido', 'Pago', 'Envío'],
      stock: { title: 'Stock bajo', body: 'Café 500 g · quedan 12 u' },
    },
    chat: {
      title: 'WhatsApp y alertas',
      strong: 'Conecta tu negocio con WhatsApp',
      after: ' y avisos al instante para tu equipo y tus clientes.',
      incoming: 'Hola, ¿mi pedido ya salió?',
      incomingTime: '10:24',
      outgoing: 'Sí, va en camino. Llega hoy entre 3 y 5 p. m.',
      outgoingTime: '10:24',
      toastTitle: 'Stock bajo',
      toastBody: 'Café 500 g · quedan 12 u',
    },
    ai: {
      title: 'IA y agentes',
      before: 'Agentes que ',
      strong: 'atienden y procesan',
      after: ' sobre tus propios datos. 24/7.',
      prompt: 'Resume ventas de octubre',
      tool: 'consultó ventas.db',
      answer: [
        { text: 'Octubre ' },
        { text: 'cerró ' },
        { text: 'en ' },
        { text: '$ 48 M, ', kind: 'strong' },
        { text: '+18 % ', kind: 'accent' },
        { text: 'frente ' },
        { text: 'a ' },
        { text: 'septiembre. ' },
        { text: 'La ' },
        { text: 'sede ' },
        { text: 'Centro ' },
        { text: 'lidera.' },
      ],
      badges: ['Disponibles 24/7', 'Conectados a tus datos'],
    },
    api: {
      title: 'Integraciones y APIs',
      before: 'Conectamos lo que ya usas: ',
      strong: 'ERP, CRM y facturación',
      after: '.',
      nodes: { erp: 'ERP', crm: 'CRM', store: 'Tienda', payments: 'Pagos', invoice: 'Factura', whatsapp: 'WhatsApp' },
      request: { method: 'POST', path: '/v1/facturas', status: '200', ms: '84 ms' },
    },
  },
  cases: {
    eyebrow: 'Casos',
    title: 'Resultados en producción, no promesas.',
    body: 'Plataformas, tiendas, apps y paneles que ya funcionan en producción.',
    cta: 'Abrir el playground',
    note: 'Nombres de clientes omitidos por confidencialidad.',
    metrics: [
      { value: 'Más ventas', label: 'marketplace de servicios' },
      { value: 'Más ventas', label: 'ecommerce de moda' },
      { value: 'Menos trabajo manual', label: 'panel de analítica' },
    ],
  },
  process: {
    eyebrow: 'Proceso',
    title: 'Avances constantes en cada fase',
    intro: 'Con avances constantes en cada fase, ves el producto funcionando en producción, no una presentación.',
    steps: [
      { title: 'Planificación', body: '15 minutos contigo para definir qué se construye esta semana.' },
      { title: 'Arquitectura', body: 'Diseño técnico, modelo de datos y estructura del proyecto.' },
      { title: 'Construcción', body: 'APIs, lógica de negocio e integraciones con tus sistemas.' },
      { title: 'Interfaz', body: 'Pantallas rápidas, claras y probadas en cualquier dispositivo.' },
      { title: 'Despliegue', body: 'El avance queda en producción y en tus manos. En cada fase.' },
    ],
  },
  cta: {
    heading: ['¿Qué', 'vas', 'a', 'construir?'],
    body: '15 minutos. Te decimos cómo lo resolvemos, cuánto cuesta y cuándo queda en producción.',
    button: 'Elegir fecha y hora',
  },
  booking: {
    title: 'Elige fecha y hora',
    subtitle:
      'Una videollamada de 15 minutos para entender tu proyecto, el alcance y una posible fecha de entrega.',
    pills: ['15 minutos', 'Videollamada · el enlace llega a tu correo', 'Hora de Bogotá (GMT-5)'],
    steps: ['01 Fecha', '02 Hora', '03 Datos', '04 Listo'],
    prevMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',
    dayAria: (day, month, unavailable) => `${day} de ${month}${unavailable ? ', no disponible' : ''}`,
    dayHint: 'Selecciona un día disponible · lun a vie',
    loading: 'Consultando disponibilidad…',
    morning: 'Mañana',
    afternoon: 'Tarde',
    back: 'Atrás',
    name: 'Nombre *',
    namePlaceholder: 'Tu nombre',
    email: 'Correo *',
    emailPlaceholder: 'tu@empresa.com',
    notes: '¿Qué quieres construir?',
    notesPlaceholder: 'Cuéntanos en pocas líneas tu proyecto o el problema que quieres resolver.',
    consentBefore: 'Autorizo a EXTRO a tratar mis datos para agendar y atender esta llamada, según la ',
    consentLink: 'política de datos',
    consentAfter: '.',
    submit: 'Confirmar llamada',
    submitting: 'Agendando…',
    successTitle: 'Llamada agendada',
    successBody: 'Te enviamos la invitación con el enlace a tu correo. Hablamos pronto.',
    join: 'Entrar a la reunión',
    again: 'Agendar otra llamada',
    error: 'No se pudo agendar. Intenta de nuevo.',
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    days: ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Respuestas directas',
    contact: '¿Otra duda? Escríbenos a',
  },
  clients: {
    eyebrow: 'Clientes',
    title: 'Lo que dicen quienes construyen con EXTRO',
    subtitle: 'Emprendimientos y empresas que ya tienen su software funcionando.',
    cta: 'Agenda tu llamada',
  },
  footer: {
    homeAria: 'EXTRO, ir al inicio',
    navAria: 'Pie de página',
    role: ['+ Empresa de software', 'con base en Medellín'],
    city: '+ Medellín, Colombia',
    clockAria: 'Hora actual en Medellín',
    cta: 'Cotizar proyecto',
    heading: ['Tu próximo', 'software,', 'en producción'],
    ready: '¿Listo para construir?',
    readySub: 'Cuéntanos qué necesitas. Lo ponemos en producción.',
    callNote: 'Llamada de 15 minutos · sin compromiso',
    contact: 'Escríbenos',
    studio: 'Sede',
    explore: 'Explorar',
    connect: 'Conectar',
    studioLines: ['Medellín, Colombia.', 'Remoto, para todo el mundo.'],
    exploreLinks: { solutions: 'Soluciones', cases: 'Casos', process: 'Proceso', booking: 'Reservar', faq: 'FAQ' },
    backToTop: 'Volver arriba',
    legal: { data: 'Datos personales', terms: 'Términos', security: 'Seguridad' },
    rights: '© 2026 EXTRO. Todos los derechos reservados.',
  },
}

const en: HomeCopy = {
  nav: {
    aria: 'Main navigation',
    homeAria: 'EXTRO, back to home',
    solutions: 'Solutions',
    cases: 'Work',
    process: 'Process',
    faq: 'FAQ',
    whatsapp: 'WhatsApp',
    cta: 'Start a project',
    ctaShort: 'Start',
    menu: 'Open menu',
    close: 'Close menu',
    language: 'Change language',
  },
  hero: {
    badge: 'Continuous progress · shipped to production',
    titleWords: ['Custom', 'software.', 'In', 'production', 'in', '7', 'days.'],
    titleAria: 'Custom software. In production in 7 days.',
    subtitle:
      "Engineering for teams that can't wait months. Fixed price, continuous progress at every phase, and the code is yours from day one.",
    primary: 'Book a 15-min call',
    secondary: 'See it in production',
    guarantees: ['+ Fixed price', '+ 100 % your code', '+ We start in 48 h'],
    window: { title: 'your-company · production', live: 'live' },
    terminal: {
      command: 'extro deploy --client',
      client: '"your-company"',
      done: ['Scope and fixed price approved', 'Architecture and database', 'Admin panel + integrations'],
      working: 'Shipping to production…',
      url: 'app.your-company.com',
      note: '· code delivered to your repository',
    },
  },
  stats: {
    aria: 'Key numbers',
    cells: [
      { label: 'To get started', value: '48', suffix: ' h', counter: true },
      { label: 'First delivery', value: '7', suffix: ' days', counter: true },
      { label: 'The code is yours', value: '100', suffix: ' %', counter: true },
      { label: 'Of post-launch support', value: '1–3', suffix: ' months', counter: false },
    ],
  },
  tech: { aria: 'Technologies' },
  solutions: {
    eyebrow: 'Solutions',
    title: 'What your operation needs. Built, deployed, yours.',
    intro:
      'The same engineering for a startup and an enterprise. Only the scope changes.',
    admin: {
      title: 'Custom operations software',
      before: 'Replace ',
      strong: 'Excel, WhatsApp and paper',
      after: ' with one system built for your industry.',
      sectorAria: 'Choose your industry',
      sectors: { construccion: 'Construction', comercio: 'Retail', logistica: 'Logistics', servicios: 'Services' },
      bullets: ['Roles and permissions per user', 'Real-time dashboards', 'Multiple sites, projects or warehouses'],
      demo: {
        window: 'site · demo',
        live: 'live',
        label: 'Construction progress',
        value: '68.0',
        delta: '+3.2 %',
        rows: [
          { a: 'Cement purchase', b: '$8.4M' },
          { a: 'Contractor payment #3', b: '$12.6M' },
          { a: 'Budget spent', b: '61 %' },
        ],
      },
    },
    mobile: {
      title: 'Mobile apps',
      strong: 'iOS and Android apps',
      after: ', for your customers or your field team.',
      notifications: [
        { title: 'Order #1048', time: 'now', body: 'Ready for delivery' },
        { title: 'Route 3', time: 'now', body: 'The driver is on the way' },
        { title: 'Payment approved', time: 'now', body: '$189,900 · Card' },
        { title: 'New customer', time: 'now', body: 'Ana R. created an account' },
      ],
    },
    web: {
      title: 'Web apps',
      before: 'Platforms and portals ',
      strong: 'in production within weeks',
      after: '. Fast from any browser.',
      url: 'app.yourcompany.com',
      command: 'extro deploy ',
      flag: '--prod',
      logs: ['optimized build · 1.2 s', 'CDN · 3 regions', 'SSL active'],
      badge: 'In production',
    },
    shop: {
      title: 'Ecommerce and payments',
      strong: 'Sell online',
      after: ' with catalog, payments and shipping built in.',
      product: 'Starter kit',
      qty: 'Quantity 2',
      price: '$189,900',
      methods: ['Card', 'PSE', 'Nequi'],
      pay: 'Pay $189,900',
      approved: 'Payment approved',
      steps: ['Order', 'Payment', 'Shipping'],
      stock: { title: 'Low stock', body: 'Coffee 500 g · 12 units left' },
    },
    chat: {
      title: 'WhatsApp and alerts',
      strong: 'Connect your business to WhatsApp',
      after: ' and instant alerts for your team and your customers.',
      incoming: 'Hi, has my order shipped yet?',
      incomingTime: '10:24',
      outgoing: 'Yes, it is on the way. It arrives today between 3 and 5 p.m.',
      outgoingTime: '10:24',
      toastTitle: 'Low stock',
      toastBody: 'Coffee 500 g · 12 units left',
    },
    ai: {
      title: 'AI and agents',
      before: 'Agents that ',
      strong: 'answer and process',
      after: ' on your own data. 24/7.',
      prompt: 'Summarize October sales',
      tool: 'queried sales.db',
      answer: [
        { text: 'October ' },
        { text: 'closed ' },
        { text: 'at ' },
        { text: '$48M, ', kind: 'strong' },
        { text: '+18 % ', kind: 'accent' },
        { text: 'versus ' },
        { text: 'September. ' },
        { text: 'The ' },
        { text: 'Centro ' },
        { text: 'location ' },
        { text: 'leads.' },
      ],
      badges: ['Available 24/7', 'Connected to your data'],
    },
    api: {
      title: 'Integrations and APIs',
      before: 'We connect what you already use: ',
      strong: 'ERP, CRM and invoicing',
      after: '.',
      nodes: { erp: 'ERP', crm: 'CRM', store: 'Store', payments: 'Payments', invoice: 'Invoice', whatsapp: 'WhatsApp' },
      request: { method: 'POST', path: '/v1/invoices', status: '200', ms: '84 ms' },
    },
  },
  cases: {
    eyebrow: 'Work',
    title: 'Results in production, not promises.',
    body: 'Platforms, stores, apps and dashboards already running in production.',
    cta: 'Open the playground',
    note: 'Client names withheld for confidentiality.',
    metrics: [
      { value: 'More sales', label: 'services marketplace' },
      { value: 'More sales', label: 'fashion ecommerce' },
      { value: 'Less manual work', label: 'analytics dashboard' },
    ],
  },
  process: {
    eyebrow: 'Process',
    title: 'Continuous progress at every phase',
    intro: 'With steady progress in every phase, you see the product running in production, not a deck.',
    steps: [
      { title: 'Planning', body: '15 minutes with you to define what gets built this week.' },
      { title: 'Architecture', body: 'Technical design, data model and project structure.' },
      { title: 'Build', body: 'APIs, business logic and integrations with your systems.' },
      { title: 'Interface', body: 'Fast, clear screens tested on every device.' },
      { title: 'Deploy', body: 'The progress lands in production and in your hands. At every phase.' },
    ],
  },
  cta: {
    heading: ['What', 'will', 'you', 'build?'],
    body: '15 minutes. We tell you how we would solve it, what it costs and when it ships.',
    button: 'Pick a date and time',
  },
  booking: {
    title: 'Pick a date and time',
    subtitle: 'A 15-minute video call to understand your project, the scope and a possible delivery date.',
    pills: ['15 minutes', 'Video call · the link arrives by email', 'Bogotá time (GMT-5)'],
    steps: ['01 Date', '02 Time', '03 Details', '04 Done'],
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    dayAria: (day, month, unavailable) => `${month} ${day}${unavailable ? ', unavailable' : ''}`,
    dayHint: 'Pick an available day · Mon to Fri',
    loading: 'Checking availability…',
    morning: 'Morning',
    afternoon: 'Afternoon',
    back: 'Back',
    name: 'Name *',
    namePlaceholder: 'Your name',
    email: 'Email *',
    emailPlaceholder: 'you@company.com',
    notes: 'What do you want to build?',
    notesPlaceholder: 'Tell us in a few lines about your project or the problem you want to solve.',
    consentBefore: 'I authorize EXTRO to process my data to schedule and handle this call, under the ',
    consentLink: 'data policy',
    consentAfter: '.',
    submit: 'Confirm call',
    submitting: 'Scheduling…',
    successTitle: 'Call scheduled',
    successBody: 'We sent the invitation with the link to your email. Talk soon.',
    join: 'Join the meeting',
    again: 'Schedule another call',
    error: 'We could not schedule the call. Please try again.',
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    days: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Straight answers',
    contact: 'Another question? Email us at',
  },
  clients: {
    eyebrow: 'Clients',
    title: 'What the people building with EXTRO say',
    subtitle: 'Startups and companies that already have their software running.',
    cta: 'Book your call',
  },
  footer: {
    homeAria: 'EXTRO, back to home',
    navAria: 'Footer',
    role: ['+ Software company', 'based in Medellín'],
    city: '+ Medellín, Colombia',
    clockAria: 'Current time in Medellín',
    cta: 'Start a project',
    heading: ['Your next', 'software,', 'in production'],
    ready: 'Ready to build?',
    readySub: 'Tell us what you need. We ship it to production.',
    callNote: '15-minute call · no commitment',
    contact: 'Contact',
    studio: 'Base',
    explore: 'Explore',
    connect: 'Connect',
    studioLines: ['Medellín, Colombia.', 'Remote, worldwide.'],
    exploreLinks: { solutions: 'Solutions', cases: 'Work', process: 'Process', booking: 'Book', faq: 'FAQ' },
    backToTop: 'Back to top',
    legal: { data: 'Personal data', terms: 'Terms', security: 'Security' },
    rights: '© 2026 EXTRO. All rights reserved.',
  },
}

export const HOME_COPY: Record<Locale, HomeCopy> = { es, en }

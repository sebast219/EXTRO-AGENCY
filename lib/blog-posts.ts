import { BLOG_SLUGS } from '@/lib/blog-slugs'

export interface BlogPostMeta {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tag: string
}

/**
 * Real English version of a post. It carries its own slug (English URLs rank
 * for English queries), so `/en/blog/<en.slug>` is a different path from the
 * Spanish `/blog/<slug>`. Posts without `en` are Spanish-only: they are not
 * listed under /en/blog and their /en URL answers 301 to the Spanish page.
 */
export interface PostTranslation {
  slug: string
  title: string
  excerpt: string
  tag: string
  content: string[]
}

export interface FallbackPost extends BlogPostMeta {
  content: string[]
  en?: PostTranslation
}

export const fallbackPosts: FallbackPost[] = [
  {
    slug: BLOG_SLUGS['app-cost'].es,
    title: '¿Cuánto cuesta desarrollar una app en Colombia en 2026?',
    excerpt: 'Qué determina el costo de una app a medida en Colombia (alcance, integraciones, plataformas, diseño y soporte) y por qué el precio cerrado es mejor que las horas.',
    date: '2026-08-01',
    readTime: '7 min',
    tag: 'Negocio',
    content: [
      'Es la pregunta que más recibo: "¿cuánto cuesta una app?" La respuesta honesta es que depende del alcance, y por eso no publicamos una tarifa única: dos apps con el mismo número de pantallas pueden costar muy distinto según lo que hay detrás de ellas.',
      'Lo que más mueve el precio es esto: el alcance (qué funciones necesita el primer lanzamiento y cuáles pueden esperar), las integraciones (pagos, facturación, WhatsApp, sistemas que ya usas), las plataformas (web, iOS, Android), el diseño (componentes estándar o un sistema visual propio) y el soporte que quieres después de la entrega. Y lo invisible: autenticación, panel de administración, infraestructura que no se caiga y pruebas automatizadas. Una "app sencilla" sin eso termina costando más en correcciones que un proyecto bien arquitecturado desde el día uno.',
      'El modelo que usamos en EXTRO: cada proyecto se cotiza a medida según su alcance con precio fijo, y se construye con avances constantes en cada fase. Tú sabes desde el primer día cuánto vas a pagar y qué recibes en cada fase. Si quieres el número de tu caso, agenda una llamada de 15 minutos en extro.com.co y sales de ella con una cotización cerrada.',
    ],
    en: {
      slug: BLOG_SLUGS['app-cost'].en,
      title: 'How Much Does It Cost to Build an App in Colombia in 2026?',
      excerpt: 'What determines the cost of a custom app in Colombia (scope, integrations, platforms, design and support) and why a fixed price beats paying by the hour.',
      tag: 'Business',
      content: [
        'It is the question I get the most: "how much does an app cost?" The honest answer is that it depends on the scope, which is why we do not publish a single rate: two apps with the same number of screens can cost very different amounts depending on what is behind them.',
        'What moves the price the most is this: the scope (which features the first release needs and which can wait), the integrations (payments, invoicing, WhatsApp, systems you already use), the platforms (web, iOS, Android), the design (standard components or a custom visual system) and the support you want after delivery. And the invisible parts: authentication, an admin panel, infrastructure that does not go down and automated tests. A "simple app" without those ends up costing more in fixes than a project that was properly architected from day one.',
        'The model we use at EXTRO: every project is quoted to measure by scope at a fixed price and built with steady progress in every phase. You know from day one how much you will pay and what you get in each phase. If you want the number for your case, book a 15-minute call at extro.com.co and you will leave it with a closed quote.',
      ],
    },
  },
  {
    slug: BLOG_SLUGS['choose-agency'].es,
    title: 'Cómo elegir una agencia de software en Medellín',
    excerpt: 'Las 5 preguntas que debes hacerle a cualquier agencia o desarrollador antes de firmar, y las banderas rojas que te ahorran dinero.',
    date: '2026-07-25',
    readTime: '8 min',
    tag: 'Negocio',
    content: [
      'Medellín se convirtió en el polo tecnológico de Colombia, y con eso crecieron las opciones: agencias grandes que cobran por horas con gestores de por medio, freelancers baratos que desaparecen a mitad de proyecto, y empresas de ingeniería pequeñas como EXTRO que apuestan por alcance cerrado y avances constantes en cada fase. Elegir mal cuesta lo mismo que elegir bien dos veces.',
      'Haz siempre estas 5 preguntas: ¿quién escribe el código y hablo directo con esa persona? ¿El precio es fijo o por horas? ¿Qué entregable concreto recibo en cada fase? ¿Quién es dueño del código y la infraestructura? ¿Qué pasa si quiero agregar alcance a mitad de camino? Si una respuesta es vaga, es una bandera roja.',
      'Las señales de una agencia o empresa de software sólida: entregables demostrables en cada fase, contrato claro sobre propiedad del código, stack tecnológico estándar (no tecnologías propietarias que te atan) y disposición a empezar con un alcance pequeño. En EXTRO respondemos esas 5 preguntas en una llamada de 15 minutos, sin compromiso.',
      '¿Buscas una agencia de software? EXTRO es una empresa de ingeniería de software a medida: quien te atiende en la llamada es quien escribe el código, y el alcance y el precio quedan cerrados antes de empezar.',
    ],
    en: {
      slug: BLOG_SLUGS['choose-agency'].en,
      title: 'How to Choose a Software Agency in Medellín',
      excerpt: 'The 5 questions to ask any agency or developer before you sign, and the red flags that will save you money.',
      tag: 'Business',
      content: [
        "Medellín has become Colombia's tech hub, and the options have grown with it: large agencies that bill by the hour with account managers in between, cheap freelancers who disappear halfway through a project, and small engineering companies like EXTRO that bet on a closed scope and steady progress in every phase. Choosing badly costs as much as choosing well twice.",
        'Always ask these 5 questions: who writes the code, and do I talk directly to that person? Is the price fixed or hourly? What concrete deliverable do I get in each phase? Who owns the code and the infrastructure? What happens if I want to add scope halfway through? If any answer is vague, it is a red flag.',
        'The signs of a solid agency or software company: demonstrable deliverables in every phase, a clear contract about code ownership, a standard tech stack (not proprietary technology that locks you in) and a willingness to start with a small scope. At EXTRO we answer those 5 questions in a 15-minute call, no strings attached.',
        'Looking for a software agency? EXTRO is a custom software engineering company: the person who takes your call is the person who writes the code, and scope and price are closed before we start.',
      ],
    },
  },
  {
    slug: BLOG_SLUGS['smb-software'].es,
    title: '¿Por qué tu PYME necesita software propio?',
    excerpt: 'De las planillas de Excel al producto que te diferencia: cuándo tiene sentido invertir en desarrollo a medida y cuándo no.',
    date: '2026-07-20',
    readTime: '6 min',
    tag: 'Negocio',
    content: [
      'La mayoría de las PYMES colombianas opera con la misma infraestructura digital: Excel, WhatsApp y una que otra herramienta SaaS genérica. Eso funciona hasta que creces: los pedidos se pierden, los datos viven en cabezas y la operación depende de procesos manuales que no escalan.',
      '¿Cuándo sí conviene desarrollo a medida? Cuando un proceso repetitivo consume horas cada semana, cuando dependes de herramientas que no se integran entre sí, o cuando tu diferenciador competitivo es digital (atención 24/7, delivery, pagos en línea). Si ninguna de esas tres cosas es cierta, un SaaS genérico alcanza.',
      'La buena noticia es que el software a medida ya no es un lujo de empresas grandes: un proyecto puntual se cotiza según su alcance, y después de la entrega puedes continuar evolucionándolo con un plan mensual. Así una PYME tiene equipo de desarrollo propio sin contratar a nadie — nosotros somos ese equipo.',
    ],
    en: {
      slug: BLOG_SLUGS['smb-software'].en,
      title: 'Why Does Your Small Business Need Its Own Software?',
      excerpt: 'From Excel spreadsheets to the product that sets you apart: when investing in custom development makes sense and when it does not.',
      tag: 'Business',
      content: [
        "Most small and mid-sized businesses run on the same digital infrastructure: Excel, WhatsApp and the occasional generic SaaS tool. That works until you grow: orders get lost, data lives in people's heads and operations depend on manual processes that do not scale.",
        'When does custom development make sense? When a repetitive process eats up hours every week, when you rely on tools that do not integrate with each other, or when your competitive edge is digital (24/7 support, delivery, online payments). If none of those three is true, a generic SaaS is enough.',
        'The good news is that custom software is no longer a luxury for large companies: a one-off project is quoted by scope, and after delivery you can keep evolving it with a monthly plan. That way a small business gets its own development team without hiring anyone — we are that team.',
      ],
    },
  },
  {
    slug: BLOG_SLUGS['fixed-price'].es,
    title: 'Por qué el precio cerrado gana contra el cobro por horas',
    excerpt: 'El modelo de precio cerrado elimina incertidumbre para el cliente y fomenta la eficiencia en el desarrollo. Te explico por qué lo uso.',
    date: '2026-07-15',
    readTime: '5 min',
    tag: 'Negocio',
    content: [
      'El cobro por horas tiene un problema de fondo: el incentivo del que construye queda alineado con tardar más, no con terminar antes. Es un conflicto de intereses silencioso que el cliente rara vez detecta hasta que ve la factura.',
      'Con precio cerrado, el alcance se define antes de escribir la primera línea: qué pantallas, qué funcionalidades, qué entregables, en qué plazo. Con eso fijo un precio que no cambia, y mi incentivo pasa a ser construir eficiente y bien a la primera.',
      '¿Qué pasa si el cliente quiere agregar algo a mitad de camino? Se cotiza aparte, con la misma claridad. Nadie se sorprende, nadie se siente estafado, y la relación se mantiene sana de principio a fin.',
    ],
    en: {
      slug: BLOG_SLUGS['fixed-price'].en,
      title: 'Why Fixed Pricing Beats Hourly Billing',
      excerpt: 'A fixed-price model removes uncertainty for the client and rewards efficient development. Here is why I use it.',
      tag: 'Business',
      content: [
        "Hourly billing has a fundamental problem: the builder's incentive is aligned with taking longer, not with finishing sooner. It is a silent conflict of interest that the client rarely notices until the invoice arrives.",
        'With a fixed price, the scope is defined before the first line is written: which screens, which features, which deliverables, on what timeline. With that locked in, I set a price that does not change, and my incentive becomes building efficiently and getting it right the first time.',
        'What if the client wants to add something halfway through? It is quoted separately, with the same clarity. Nobody is surprised, nobody feels cheated, and the relationship stays healthy from start to finish.',
      ],
    },
  },
  {
    slug: BLOG_SLUGS['sql-latency'].es,
    title: 'Cómo reduje la latencia de una base de datos con el índice correcto',
    excerpt: 'Un caso de e-commerce donde el índice correcto y la reestructuración de las consultas transformaron el rendimiento de la app.',
    date: '2026-07-02',
    readTime: '8 min',
    tag: 'Técnico',
    content: [
      'El listado de productos de una tienda virtual tardaba varios segundos en cargar. El problema no era la infraestructura: era la base de datos. Una query con joins innecesarios, sin índice sobre la columna de filtrado y con una subconsulta que se ejecutaba por cada fila.',
      'El primer cambio fue agregar un índice compuesto sobre las columnas de categoría y precio, que eran las que el cliente usaba para filtrar y ordenar. Ese solo cambio ya redujo el tiempo de carga de forma notable.',
      'El segundo fue reescribir la query: eliminar la subconsulta correlacionada, convertir los joins en un solo query con agregación y paginar en la base en lugar de traer todo a memoria. El listado pasó a cargar de forma casi inmediata, sin cambiar un solo servidor.',
    ],
    en: {
      slug: BLOG_SLUGS['sql-latency'].en,
      title: 'How I Cut Database Latency with the Right Index',
      excerpt: 'An ecommerce case where the right index and a restructured query transformed the performance of the app.',
      tag: 'Technical',
      content: [
        'The product listing of an online store took several seconds to load. The problem was not the infrastructure: it was the database. A query with unnecessary joins, no index on the filtering column and a subquery that ran once per row.',
        'The first change was adding a composite index on the category and price columns, which were the ones the client used to filter and sort. That change alone already cut the load time noticeably.',
        'The second was rewriting the query: removing the correlated subquery, turning the joins into a single query with aggregation and paginating in the database instead of pulling everything into memory. The listing went on to load almost instantly, without changing a single server.',
      ],
    },
  },
  {
    slug: BLOG_SLUGS['whatsapp-api'].es,
    title: 'Integrar WhatsApp Business API en 2026: guía práctica',
    excerpt: 'Todo lo que necesitas saber para conectar tu negocio con WhatsApp: desde la verificación de número hasta flujos automatizados con IA.',
    date: '2026-06-20',
    readTime: '12 min',
    tag: 'Tutorial',
    content: [
      'WhatsApp Business API es la única vía oficial para enviar mensajes automatizados, con plantillas aprobadas y sin riesgo de baneo. El primer paso es tener un número que no esté registrado en la app de WhatsApp para uso personal.',
      'Después viene la verificación del negocio: nombre, categoría y datos de la empresa en Meta Business Suite. Con eso obtienes acceso al número de teléfono y puedes empezar a usar la API a través de proveedores como Twilio, Wati o directamente con la API de Meta.',
      'El siguiente nivel es la automatización con IA: un asistente que clasifica la intención del mensaje, responde preguntas frecuentes con las plantillas aprobadas y escala a un humano cuando lo necesita. Eso es lo que implemento en los proyectos que incluyen atención al cliente.',
    ],
    en: {
      slug: BLOG_SLUGS['whatsapp-api'].en,
      title: 'Integrating the WhatsApp Business API in 2026: A Practical Guide',
      excerpt: 'Everything you need to know to connect your business with WhatsApp: from number verification to automated AI-powered flows.',
      tag: 'Tutorial',
      content: [
        'The WhatsApp Business API is the only official way to send automated messages, with approved templates and no risk of being banned. The first step is to have a phone number that is not registered in the WhatsApp app for personal use.',
        'Next comes business verification: name, category and company details in Meta Business Suite. With that you get access to the phone number and can start using the API through providers such as Twilio, Wati or directly with the Meta API.',
        'The next level is AI automation: an assistant that classifies the intent of a message, answers frequent questions with the approved templates and hands off to a human when needed. That is what I implement in projects that include customer support.',
      ],
    },
  },
  {
    slug: BLOG_SLUGS['mvp-7-days'].es,
    title: 'Cómo entregar un MVP funcional en 7 días',
    excerpt: 'La metodología que uso para pasar de idea a producto en una semana, sin sacrificar calidad ni escalabilidad.',
    date: '2026-06-10',
    readTime: '6 min',
    tag: 'Metodología',
    content: [
      'La clave del MVP en 7 días no es trabajar más rápido: es recortar lo que no aporta. El día 1 se define el flujo principal del producto — la única tarea que el usuario debe poder completar — y todo lo demás queda fuera del alcance inicial.',
      'Los días 2 a 5 se construyen la base de datos, la API y la interfaz del flujo principal. Se usan componentes de sistema de diseño, tablas con esquema pensado para crecer y lógica separada por capas para que el MVP no haya que tirarlo después.',
      'Los días 6 y 7 son para pulir: pruebas de los flujos críticos, ajustes de diseño y deploy. El resultado no es un prototipo descartable: es la primera versión de un producto que puede seguir creciendo sin reescribirse.',
    ],
    en: {
      slug: BLOG_SLUGS['mvp-7-days'].en,
      title: 'How to Ship a Working MVP in 7 Days',
      excerpt: 'The method I use to go from idea to product in one week, without sacrificing quality or scalability.',
      tag: 'Methodology',
      content: [
        "The key to a 7-day MVP is not working faster: it is cutting what does not add value. On day 1 you define the product's main flow — the one task the user must be able to complete — and everything else stays out of the initial scope.",
        'Days 2 to 5 are for building the database, the API and the interface of the main flow. You use design-system components, tables with a schema designed to grow and logic separated into layers so the MVP does not have to be thrown away later.',
        'Days 6 and 7 are for polish: tests of the critical flows, design adjustments and deployment. The result is not a disposable prototype: it is the first version of a product that can keep growing without being rewritten.',
      ],
    },
  },
  {
    slug: BLOG_SLUGS['nextjs-vs-astro'].es,
    title: 'Next.js vs Astro: cuándo usar cada uno',
    excerpt: 'Comparativa técnica y de negocio entre los dos frameworks más populares para sitios modernos en 2026.',
    date: '2026-05-28',
    readTime: '7 min',
    tag: 'Técnico',
    content: [
      'Astro brilla cuando el sitio es mayoritariamente contenido: blogs, landing pages, documentación. Su modelo de islas envía cero JavaScript por defecto y la velocidad de carga es difícil de superar.',
      'Next.js brilla cuando hay interacción real: aplicaciones, dashboards, paneles de administración, formularios con estado complejo, autenticación. El App Router de Next 14 permite que cada ruta decida entre estática, dinámica o híbrida (ISR).',
      'Mi regla práctica: si el proyecto es contenido que se lee, Astro. Si es un producto con el que se interactúa, Next.js. Para este sitio, que combina contenido editorial con un sistema de agendamiento que crea eventos y enlaces de reunión en tiempo real, la elección natural es Next.js.',
    ],
    en: {
      slug: BLOG_SLUGS['nextjs-vs-astro'].en,
      title: 'Next.js vs Astro: When to Use Each',
      excerpt: 'A technical and business comparison of the two most popular frameworks for modern sites in 2026.',
      tag: 'Technical',
      content: [
        'Astro shines when the site is mostly content: blogs, landing pages, documentation. Its islands model ships zero JavaScript by default and the loading speed is hard to beat.',
        'Next.js shines when there is real interaction: applications, dashboards, admin panels, forms with complex state, authentication. The Next 14 App Router lets each route choose between static, dynamic or hybrid (ISR).',
        'My rule of thumb: if the project is content to be read, Astro. If it is a product people interact with, Next.js. For this site, which combines editorial content with a booking system that creates events and meeting links in real time, the natural choice is Next.js.',
      ],
    },
  },
  {
    slug: BLOG_SLUGS['support-automation'].es,
    title: 'Automatización de atención al cliente sin perder humanidad',
    excerpt: 'Cómo diseñar chatbots y flujos de IA que resuelven la mayoría de las consultas repetitivas sin frustrar al usuario.',
    date: '2026-05-15',
    readTime: '9 min',
    tag: 'IA',
    content: [
      'El error más común al automatizar la atención al cliente es tratar de que el bot lo resuelva todo. El objetivo realista es resolver las consultas repetitivas — precios, horarios, estados de pedido — y escalar el resto a un humano sin fricción.',
      'La estructura de un buen flujo: intención clara en el primer mensaje, respuestas cortas con la información exacta, opciones de seguimiento en vez de "¿puedo ayudarte en algo más?" y escalamiento a humano cuando el bot detecta frustración o una consulta fuera de su base.',
      'Con IA generativa, el bot puede redactar respuestas naturales usando las plantillas aprobadas de WhatsApp y el historial del cliente. El resultado: el negocio responde 24/7 y el humano solo entra cuando aporta valor real.',
    ],
    en: {
      slug: BLOG_SLUGS['support-automation'].en,
      title: 'Customer Support Automation Without Losing the Human Touch',
      excerpt: 'How to design chatbots and AI flows that handle most repetitive questions without frustrating the user.',
      tag: 'AI',
      content: [
        'The most common mistake when automating customer support is trying to make the bot solve everything. The realistic goal is to resolve the repetitive questions — prices, opening hours, order status — and hand the rest to a human with no friction.',
        'The structure of a good flow: a clear intent in the first message, short answers with the exact information, follow-up options instead of "can I help you with anything else?" and a handoff to a human when the bot detects frustration or a question outside its knowledge base.',
        "With generative AI, the bot can write natural replies using the approved WhatsApp templates and the customer's history. The result: the business answers 24/7 and the human only steps in when they add real value.",
      ],
    },
  },
]

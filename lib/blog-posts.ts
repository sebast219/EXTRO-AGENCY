export interface BlogPostMeta {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tag: string
}

export interface FallbackPost extends BlogPostMeta {
  content: string[]
}

export const fallbackPosts: FallbackPost[] = [
  {
    slug: 'cuanto-cuesta-desarrollar-app-colombia',
    title: '¿Cuánto cuesta desarrollar una app en Colombia en 2026?',
    excerpt: 'Rangos reales de presupuesto para apps web, móviles y ecommerce en el mercado colombiano, y por qué el precio cerrado es mejor que las horas.',
    date: '2026-08-01',
    readTime: '7 min',
    tag: 'Negocio',
    content: [
      'Es la pregunta que más recibo: "¿cuánto cuesta una app?" La respuesta honesta es que depende del alcance, pero en el mercado colombiano de 2026 los rangos son más predecibles de lo que parece. Una landing con panel simple ronda los 1.500–4.000 USD. Un ecommerce con pagos e inventario, 4.000–9.000 USD. Un SaaS con usuarios, integraciones e IA, 9.000–18.000 USD.',
      'Lo que más mueve el precio no son las pantallas sino lo invisible: autenticación, pagos, panel de administración, integraciones, infraestructura que no se caiga y pruebas automatizadas. Una "app sencilla" sin eso termina costando más en correcciones que un proyecto bien arquitecturado desde el día uno.',
      'El modelo que usamos en EXTRO: cada proyecto se cotiza según su alcance con precio fijo, y se construye con avances funcionales cada viernes. Tú sabes desde el primer día cuánto vas a pagar y qué recibes cada semana. Si quieres el número exacto de tu caso, agenda una llamada de 15 minutos en extro.com.co y sales de ella con un rango cerrado.',
    ],
  },
  {
    slug: 'elegir-agencia-software-medellin',
    title: 'Cómo elegir una agencia de software en Medellín',
    excerpt: 'Las 5 preguntas que debes hacerle a cualquier agencia o desarrollador antes de firmar, y las banderas rojas que te ahorran dinero.',
    date: '2026-07-25',
    readTime: '8 min',
    tag: 'Negocio',
    content: [
      'Medellín se convirtió en el polo tecnológico de Colombia, y con eso crecieron las opciones: agencias grandes que cobran por horas con gestores de por medio, freelancers baratos que desaparecen a mitad de proyecto, y estudios pequeños como EXTRO que apuestan por alcance cerrado y entrega semanal. Elegir mal cuesta lo mismo que elegir bien dos veces.',
      'Haz siempre estas 5 preguntas: ¿quién escribe el código y hablo directo con esa persona? ¿El precio es fijo o por horas? ¿Qué entregable concreto recibo cada semana? ¿Quién es dueño del código y la infraestructura? ¿Qué pasa si quiero agregar alcance a mitad de camino? Si una respuesta es vaga, es una bandera roja.',
      'Las señales de una agencia sólida: entregables semanales demostrables, contrato claro sobre propiedad del código, stack tecnológico estándar (no tecnologías propietarias que te atan) y disposición a empezar con un alcance pequeño. En EXTRO respondemos esas 5 preguntas en una llamada de 15 minutos, sin compromiso.',
    ],
  },
  {
    slug: 'software-pymes-por-que',
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
  },
  {
    slug: 'precio-cerrado-vs-horas',
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
  },
  {
    slug: 'optimizar-consultas-sql',
    title: 'Cómo reducí la latencia de una base de datos en un 75%',
    excerpt: 'Un caso real donde el índice correcto y la reestructuración de queries transformaron el rendimiento de una app de e-commerce.',
    date: '2026-07-02',
    readTime: '8 min',
    tag: 'Técnico',
    content: [
      'Una tienda virtual cargaba su listado de productos en 4.2 segundos. El problema no era la infraestructura: era la base de datos. Una query con joins innecesarios, sin índice sobre la columna de filtrado y con una subconsulta que se ejecutaba por cada fila.',
      'El primer cambio fue agregar un índice compuesto sobre las columnas de categoría y precio, que eran las que el cliente usaba para filtrar y ordenar. Ese solo cambio redujo el tiempo de 4.2s a 1.1s.',
      'El segundo fue reescribir la query: eliminar la subconsulta correlacionada, convertir los joins en un solo query con agregación y paginar en la base en lugar de traer todo a memoria. Resultado final: 1.05 segundos, un 75% menos de latencia, sin cambiar un solo servidor.',
    ],
  },
  {
    slug: 'whatsapp-api-2026',
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
  },
  {
    slug: 'mvp-7-dias',
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
  },
  {
    slug: 'nextjs-vs-astro',
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
  },
  {
    slug: 'automatizar-atencion-cliente',
    title: 'Automatización de atención al cliente sin perder humanidad',
    excerpt: 'Cómo diseñar chatbots y flujos de IA que resuelven el 80% de consultas sin frustrar al usuario.',
    date: '2026-05-15',
    readTime: '9 min',
    tag: 'IA',
    content: [
      'El error más común al automatizar la atención al cliente es tratar de que el bot lo resuelva todo. El objetivo realista es resolver el 80% de las consultas repetitivas — precios, horarios, estados de pedido — y escalar el 20% restante a un humano sin fricción.',
      'La estructura de un buen flujo: intención clara en el primer mensaje, respuestas cortas con la información exacta, opciones de seguimiento en vez de "¿puedo ayudarte en algo más?" y escalamiento a humano cuando el bot detecta frustración o una consulta fuera de su base.',
      'Con IA generativa, el bot puede redactar respuestas naturales usando las plantillas aprobadas de WhatsApp y el historial del cliente. El resultado: el negocio responde 24/7 y el humano solo entra cuando aporta valor real.',
    ],
  },
]

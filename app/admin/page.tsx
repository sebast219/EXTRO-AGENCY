import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { ArrowLeft, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react'
import { authOptions } from '@/lib/auth'
import LogoutButton from './logout-button'

export const metadata = {
  title: 'Admin · EX·TRON',
  description: 'Panel de administración interno.',
  robots: 'noindex, nofollow',
}

const projects = [
  { client: 'App Servicios', type: 'Móvil', status: 'active', progress: 65, delivery: '15 ago 2026', revenue: 8500000 },
  { client: 'Tienda Moda', type: 'E-commerce', status: 'active', progress: 40, delivery: '22 ago 2026', revenue: 4200000 },
  { client: 'Bot WhatsApp', type: 'Automatización', status: 'pending', progress: 10, delivery: '30 ago 2026', revenue: 2800000 },
  { client: 'Dashboard Analytics', type: 'Web App', status: 'active', progress: 80, delivery: '08 ago 2026', revenue: 6500000 },
  { client: 'Landing Fintech', type: 'Web', status: 'done', progress: 100, delivery: '01 ago 2026', revenue: 1500000 },
  { client: 'API Inventario', type: 'Backend', status: 'active', progress: 55, delivery: '18 ago 2026', revenue: 3800000 },
]

const messages = [
  { name: 'Carlos M.', email: 'carlos@email.com', time: 'Hace 2h', text: 'Necesito una app para conectar proveedores de servicios con clientes. ¿Podemos hablar?', status: 'new' },
  { name: 'Ana L.', email: 'ana@empresa.co', time: 'Hace 5h', text: 'Quiero automatizar mi atención al cliente con IA y WhatsApp. ¿Cuál sería el precio aproximado?', status: 'new' },
  { name: 'Luis R.', email: 'luis@retail.com', time: 'Hace 1d', text: 'Necesito un e-commerce con integración a pasarela de pagos y inventario automático.', status: 'replied' },
  { name: 'María G.', email: 'maria@salud.org', time: 'Hace 2d', text: 'Cotización para plataforma de agendamiento médico con recordatorios por WhatsApp.', status: 'replied' },
]

const formatCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const totalRevenue = projects.reduce((a, b) => a + b.revenue, 0)
  const activeProjects = projects.filter(p => p.status === 'active').length
  const avgProgress = Math.round(projects.reduce((a, b) => a + b.progress, 0) / projects.length)

  return (
    <main className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Volver
          </Link>
          <h1 className="text-lg font-medium text-primary">Panel de Administración · EX·TRON</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-tertiary">{new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <LogoutButton />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 border border-border rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-primary" />
              <span className="text-xs text-tertiary uppercase tracking-wider">Ingresos activos</span>
            </div>
            <div className="text-2xl font-medium text-primary tabular-nums">{formatCOP(totalRevenue)}</div>
          </div>
          <div className="p-5 border border-border rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-primary" />
              <span className="text-xs text-tertiary uppercase tracking-wider">Proyectos activos</span>
            </div>
            <div className="text-2xl font-medium text-primary tabular-nums">{activeProjects}</div>
          </div>
          <div className="p-5 border border-border rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-primary" />
              <span className="text-xs text-tertiary uppercase tracking-wider">Progreso promedio</span>
            </div>
            <div className="text-2xl font-medium text-primary tabular-nums">{avgProgress}%</div>
          </div>
          <div className="p-5 border border-border rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-primary" />
              <span className="text-xs text-tertiary uppercase tracking-wider">Entregados (2026)</span>
            </div>
            <div className="text-2xl font-medium text-primary tabular-nums">48</div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="mb-8">
          <h2 className="text-base font-medium text-primary mb-4">Proyectos</h2>
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="text-left py-3 px-4 text-xs text-tertiary uppercase tracking-wider font-medium">Cliente</th>
                  <th className="text-left py-3 px-4 text-xs text-tertiary uppercase tracking-wider font-medium">Tipo</th>
                  <th className="text-left py-3 px-4 text-xs text-tertiary uppercase tracking-wider font-medium">Estado</th>
                  <th className="text-left py-3 px-4 text-xs text-tertiary uppercase tracking-wider font-medium">Progreso</th>
                  <th className="text-left py-3 px-4 text-xs text-tertiary uppercase tracking-wider font-medium">Entrega</th>
                  <th className="text-right py-3 px-4 text-xs text-tertiary uppercase tracking-wider font-medium">Valor</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-surface-raised transition-colors">
                    <td className="py-3 px-4 text-primary font-medium">{p.client}</td>
                    <td className="py-3 px-4 text-secondary">{p.type}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[11px] px-2.5 py-1 rounded-full ${
                        p.status === 'active' ? 'bg-green-50 text-green-600' :
                        p.status === 'done' ? 'bg-gray-50 text-gray-500' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {p.status === 'active' ? 'Activo' : p.status === 'done' ? 'Completado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${p.progress}%` }} />
                        </div>
                        <span className="text-xs text-secondary">{p.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-secondary">{p.delivery}</td>
                    <td className="py-3 px-4 text-right text-primary font-medium tabular-nums">{formatCOP(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Messages */}
        <div>
          <h2 className="text-base font-medium text-primary mb-4">Mensajes recientes</h2>
          <div className="grid gap-3">
            {messages.map((m, i) => (
              <div key={i} className="p-4 border border-border rounded-xl hover:border-primary transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-sm font-medium text-primary">{m.name}</span>
                    <span className="text-xs text-tertiary ml-2">{m.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      m.status === 'new' ? 'bg-primary text-white' : 'bg-surface text-tertiary border border-border'
                    }`}>
                      {m.status === 'new' ? 'Nuevo' : 'Respondido'}
                    </span>
                    <span className="text-xs text-tertiary">{m.time}</span>
                  </div>
                </div>
                <p className="text-sm text-secondary">{m.text}</p>
                <div className="flex gap-2 mt-3">
                  <button className="text-xs px-3 py-1.5 bg-primary text-white rounded-md hover:opacity-85 transition-opacity">
                    Responder
                  </button>
                  <button className="text-xs px-3 py-1.5 border border-border rounded-md text-secondary hover:text-primary transition-colors">
                    Archivar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

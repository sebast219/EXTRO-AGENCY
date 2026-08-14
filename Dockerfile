# M-12: entorno reproducible.
#
# Antes el despliegue dependía del CLI de Vercel desde la máquina de quien
# desplegara — sin forma de reproducir el build en otro sitio, y con la
# diferencia entre "funciona en mi equipo" y producción sin diagnosticar.
#
# Multi-etapa con `output: 'standalone'` (next.config.js): la imagen final lleva
# solo el servidor y sus dependencias reales, no node_modules entero.

# ── Dependencias ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

# libc6-compat: sharp y algunos binarios de Next lo necesitan en Alpine.
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

# ── Build ────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--max-old-space-size=4096

# Las variables NEXT_PUBLIC_* se incrustan en el bundle del cliente, así que
# tienen que estar presentes en tiempo de build, no de arranque.
ARG NEXT_PUBLIC_SANITY_PROJECT_ID
ARG NEXT_PUBLIC_SANITY_DATASET
ARG NEXT_PUBLIC_WHATSAPP_NUMBER
ARG NEXT_PUBLIC_FOMO_SLOTS

RUN npm run build

# ── Runtime ──────────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Usuario sin privilegios: un fallo en el proceso no da root en el contenedor.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# El healthcheck pega al sitemap: es la ruta más barata que ejercita el
# renderizado del servidor, no solo que el puerto esté abierto.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/sitemap.xml').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]

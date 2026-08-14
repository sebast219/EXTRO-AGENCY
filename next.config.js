const withBundleAnalyzer = (() => {
  if (process.env.ANALYZE !== 'true') return (cfg) => cfg
  // En la versión instalada, el propio módulo es la función wrapper.
  return require('@next/bundle-analyzer')({ enabled: true })
})()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // M-12: build autocontenido para la imagen de Docker.
  output: 'standalone',

  images: {
    /**
     * A-5: antes esto era `hostname: '**'`, es decir, un proxy de imágenes
     * abierto: el optimizador aceptaba cualquier host, con el ancho de banda y
     * las peticiones salientes a cargo del proyecto. Solo se permiten los
     * orígenes que realmente se usan.
     */
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/**' }],
    formats: ['image/avif', 'image/webp'],
    // Coincide con los anchos reales de los contenedores del sitio.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [96, 128, 180, 256, 384],
  },

  /**
   * Los encabezados de seguridad se emiten desde proxy.ts, que es donde se
   * genera el nonce de la CSP por petición. Aquí solo queda lo que la proxy
   * no cubre: los assets estáticos, excluidos de su matcher.
   */
  headers: async () => [
    {
      source: '/:path*.(png|jpg|jpeg|webp|avif|svg|ico|woff2)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
  ],
}

module.exports = withBundleAnalyzer(nextConfig)

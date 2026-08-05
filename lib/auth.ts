import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { timingSafeEqual } from 'crypto'
import { rateLimit } from './rate-limit'

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA)
    return false
  }
  return timingSafeEqual(bufA, bufB)
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const ip = (req?.headers?.['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
        const rl = rateLimit(`auth:${ip}`, { windowMs: 60_000, maxRequests: 5 })
        if (!rl.ok) {
          throw new Error('rate_limited')
        }

        const adminEmail = process.env.ADMIN_EMAIL
        const passwordHash = process.env.ADMIN_PASSWORD_HASH
        const legacyPassword = process.env.ADMIN_PASSWORD

        if (!credentials?.email || !credentials.password) {
          return null
        }

        if (adminEmail && !safeCompare(credentials.email, adminEmail)) {
          return null
        }

        if (passwordHash) {
          const valid = await compare(credentials.password, passwordHash)
          if (!valid) return null
        } else if (legacyPassword) {
          console.warn(
            '[auth] ADMIN_PASSWORD (plaintext) detectado. Migra a ADMIN_PASSWORD_HASH con: npx tsx scripts/hash-password.ts'
          )
          if (!safeCompare(credentials.password, legacyPassword)) {
            return null
          }
        } else {
          return null
        }

        return { id: '1', name: 'Admin', email: adminEmail || credentials.email }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
}

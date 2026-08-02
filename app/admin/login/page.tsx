import type { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Acceso · EX·TRON',
  description: 'Acceso al panel de administración.',
  robots: 'noindex, nofollow',
}

export default function LoginPage({ searchParams }: { searchParams: { callbackUrl?: string } }) {
  return <LoginForm callbackUrl={searchParams.callbackUrl} />
}

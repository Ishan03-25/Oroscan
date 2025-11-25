import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/api/auth/signin',
    '/api/auth/signout',
    '/api/auth/session',
    '/api/auth/providers',
    '/api/auth/callback',
    '/api/auth/csrf',
  ]

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))
  
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Get session
  const session = await auth()

  // Redirect to login if not authenticated
  if (!session?.user) {
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }

  // Check admin routes
  if (pathname.startsWith('/admin')) {
    if (session.user.role !== 'ADMIN') {
      const url = new URL('/dashboard', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

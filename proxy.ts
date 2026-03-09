import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

export async function middleware(request: NextRequest) {
    const currentPath = request.nextUrl.pathname

    // Protect /admin and /family-tree
    if (currentPath.startsWith('/admin') || currentPath.startsWith('/family-tree')) {
        const session = request.cookies.get('session')?.value
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        const payload = await decrypt(session)
        if (!payload) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // Redirect /login to /admin if already logged in
    if (currentPath.startsWith('/login')) {
        const session = request.cookies.get('session')?.value
        if (session) {
            const payload = await decrypt(session)
            if (payload) {
                return NextResponse.redirect(new URL('/admin', request.url))
            }
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/family-tree/:path*', '/login'],
}

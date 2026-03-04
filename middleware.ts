import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Pass-through middleware — activer Clerk quand les vraies clés sont disponibles
// Créer un projet sur https://clerk.com, puis remplacer ce fichier par :
// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
// ...
export function middleware(_req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}

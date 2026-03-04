import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook/clerk',
  '/demo(.*)',
])

// Si les clés Clerk ne sont pas configurées → tout est public (dev only)
const clerkKeysConfigured =
  (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.length ?? 0) > 10 &&
  (process.env.CLERK_SECRET_KEY?.length ?? 0) > 10

export default clerkMiddleware(async (auth, req) => {
  if (!clerkKeysConfigured) return // bypass complet si pas de clés
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}

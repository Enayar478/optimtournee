import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Check if Clerk is configured
const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkSecretKey = process.env.CLERK_SECRET_KEY;
const isClerkConfigured = 
  clerkPubKey && 
  !clerkPubKey.includes("pk_test_") &&
  clerkSecretKey &&
  !clerkSecretKey.includes("sk_test_");

// Conditional Clerk import
let clerkMiddleware: typeof import("@clerk/nextjs/server").clerkMiddleware | null = null;
let createRouteMatcher: typeof import("@clerk/nextjs/server").createRouteMatcher | null = null;

if (isClerkConfigured) {
  try {
    const clerk = require("@clerk/nextjs/server");
    clerkMiddleware = clerk.clerkMiddleware;
    createRouteMatcher = clerk.createRouteMatcher;
  } catch {
    // Clerk not available
  }
}

const isProtectedRoute = createRouteMatcher
  ? createRouteMatcher([
      "/dashboard(.*)",
      "/clients(.*)",
      "/teams(.*)",
    ])
  : () => false;

// Export middleware based on Clerk availability
export const middleware = clerkMiddleware
  ? clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        await auth.protect();
      }
    })
  : () => NextResponse.next();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

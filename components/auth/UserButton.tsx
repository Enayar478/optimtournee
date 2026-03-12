"use client";

import Link from "next/link";
import { UserButton as ClerkUserButton } from "@clerk/nextjs";

// Check if Clerk is configured
const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = clerkPubKey && !clerkPubKey.includes("pk_test_");

export function UserButton(
  props: React.ComponentProps<typeof ClerkUserButton>
) {
  if (!isClerkConfigured) {
    return (
      <Link
        href="/sign-in"
        className="bg-forest/10 text-forest hover:bg-forest/20 flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors"
      >
        U
      </Link>
    );
  }

  return <ClerkUserButton {...props} />;
}

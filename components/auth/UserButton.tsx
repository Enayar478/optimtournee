"use client";

import Link from "next/link";
import { UserButton as ClerkUserButton } from "@clerk/nextjs";

// Check if Clerk is configured
const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = clerkPubKey && !clerkPubKey.includes("pk_test_");

export function UserButton(props: React.ComponentProps<typeof ClerkUserButton>) {
  if (!isClerkConfigured) {
    return (
      <Link
        href="/sign-in"
        className="w-9 h-9 rounded-full bg-forest/10 flex items-center justify-center text-forest font-medium text-sm hover:bg-forest/20 transition-colors"
      >
        U
      </Link>
    );
  }

  return <ClerkUserButton {...props} />;
}

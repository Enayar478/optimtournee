import Link from "next/link";
import { SignUp as ClerkSignUp } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = !!clerkPubKey;

export default function SignUpPage() {
  if (!isClerkConfigured) {
    return (
      <div className="flex flex-col items-center text-center">
        <h1 className="text-foreground mb-2 text-2xl font-bold">
          Créer un compte
        </h1>
        <p className="text-muted-foreground mb-6">
          L&apos;authentification n&apos;est pas encore configurée.
        </p>
        <div className="w-full rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="mb-2 font-medium">Configuration requise :</p>
          <p>
            Ajoutez vos clés Clerk dans le fichier{" "}
            <code className="rounded bg-amber-100 px-1 py-0.5">
              .env.local
            </code>
          </p>
          <pre className="mt-2 overflow-x-auto rounded bg-amber-100 p-3 text-left text-xs">
            {`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...`}
          </pre>
        </div>
        <Link
          href="/"
          className="text-forest hover:text-forest-dark mt-6 inline-block font-medium"
        >
          &larr; Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <ClerkSignUp
        forceRedirectUrl="/onboarding"
        appearance={{
          variables: {
            colorPrimary: "#2D5A3D",
            borderRadius: "0.75rem",
          },
          elements: {
            card: "shadow-xl border border-gray-100",
            formButtonPrimary:
              "bg-[#2D5A3D] hover:bg-[#1e3d2a] text-white shadow-sm",
            footerActionLink: "text-[#2D5A3D] hover:text-[#1e3d2a]",
            headerTitle: "text-gray-900",
            headerSubtitle: "text-gray-500",
          },
        }}
      />
    </div>
  );
}

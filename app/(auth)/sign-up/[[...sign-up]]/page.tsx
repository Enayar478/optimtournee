import Link from "next/link";
import { SignUp as ClerkSignUp } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

// Check if Clerk is configured
const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = !!clerkPubKey;

export default function SignUpPage() {
  if (!isClerkConfigured) {
    return (
      <div className="border-forest/10 rounded-2xl border bg-white p-8 shadow-xl">
        <div className="text-center">
          <h1 className="text-foreground mb-2 text-2xl font-bold">
            Créer un compte
          </h1>
          <p className="text-muted-foreground mb-6">
            L&apos;authentification n&apos;est pas encore configurée.
          </p>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <p className="mb-2 font-medium">Configuration requise :</p>
            <p>
              Ajoutez vos clés Clerk dans le fichier{" "}
              <code className="rounded bg-amber-100 px-1 py-0.5">
                .env.local
              </code>{" "}
              :
            </p>
            <pre className="mt-2 overflow-x-auto rounded bg-amber-100 p-3 text-left">
              NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
              CLERK_SECRET_KEY=sk_live_...
            </pre>
          </div>
          <Link
            href="/"
            className="text-forest hover:text-forest-dark mt-6 inline-block font-medium"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border-forest/10 rounded-2xl border bg-white p-8 shadow-xl">
      <div className="mb-6 text-center">
        <h1 className="text-foreground mb-2 text-2xl font-bold">
          Créer un compte
        </h1>
        <p className="text-muted-foreground">
          Commencez à optimiser vos tournées dès maintenant
        </p>
      </div>
      <ClerkSignUp
        forceRedirectUrl="/onboarding"
        appearance={{
          elements: {
            formButtonPrimary: "bg-forest hover:bg-forest-dark text-white",
            footerActionLink: "text-forest hover:text-forest-dark",
          },
        }}
      />
    </div>
  );
}

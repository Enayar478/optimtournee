import Link from "next/link";
import { SignUp as ClerkSignUp } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

// Check if Clerk is configured
const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = clerkPubKey && !clerkPubKey.includes("pk_test_");

export default function SignUpPage() {
  if (!isClerkConfigured) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-forest/10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Créer un compte</h1>
          <p className="text-muted-foreground mb-6">
            L&apos;authentification n&apos;est pas encore configurée.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
            <p className="font-medium mb-2">Configuration requise :</p>
            <p>
              Ajoutez vos clés Clerk dans le fichier <code className="bg-amber-100 px-1 py-0.5 rounded">.env.local</code> :
            </p>
            <pre className="mt-2 text-left bg-amber-100 p-3 rounded overflow-x-auto">
              NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
              CLERK_SECRET_KEY=sk_live_...
            </pre>
          </div>
          <Link
            href="/"
            className="mt-6 inline-block text-forest hover:text-forest-dark font-medium"
          >
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-forest/10">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Créer un compte</h1>
        <p className="text-muted-foreground">
          Commencez à optimiser vos tournées dès maintenant
        </p>
      </div>
      <ClerkSignUp
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

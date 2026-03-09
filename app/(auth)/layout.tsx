import Link from "next/link";
import { Leaf } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-surface via-white to-sky-surface/30 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="bg-forest flex h-10 w-10 items-center justify-center rounded-lg">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <span className="text-foreground text-2xl font-bold">
            OptimTournée
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground">
        <p>© 2025 OptimTournée. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

import Link from "next/link";
import { Leaf } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="from-forest-surface to-sky-surface/30 flex min-h-screen flex-col bg-gradient-to-br via-white">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="flex w-fit items-center gap-2">
          <div className="bg-forest flex h-10 w-10 items-center justify-center rounded-lg">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <span className="text-foreground text-2xl font-bold">
            OptimTournée
          </span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="text-muted-foreground p-6 text-center text-sm">
        <p>© 2025 OptimTournée. Tous droits réservés.</p>
      </footer>
    </div>
  );
}

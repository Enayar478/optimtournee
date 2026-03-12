import { Leaf } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  produit: [
    { label: "Fonctionnalités", href: "/#features" },
    { label: "Tarifs", href: "/#pricing" },
    { label: "Démo", href: "/demo" },
  ],
  entreprise: [{ label: "Contact", href: "mailto:contact@optimtournee.fr" }],
};

export function Footer() {
  return (
    <footer className="bg-foreground py-16 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-forest flex h-8 w-8 items-center justify-center rounded-lg">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">OptimTournée</span>
            </div>
            <p className="max-w-sm text-white/60">
              Optimisez vos tournées d&apos;entretien et gagnez du temps chaque
              jour. Conçu pour les paysagistes, par des paysagistes.
            </p>
          </div>

          {/* Produit */}
          <div>
            <h4 className="mb-4 font-semibold">Produit</h4>
            <ul className="space-y-3">
              {footerLinks.produit.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h4 className="mb-4 font-semibold">Entreprise</h4>
            <ul className="space-y-3">
              {footerLinks.entreprise.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} OptimTournée — Conçu pour les
            paysagistes
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              href="/mentions-legales"
              className="text-white/60 transition-colors hover:text-white"
            >
              Mentions légales
            </Link>
            <Link
              href="/cgu"
              className="text-white/60 transition-colors hover:text-white"
            >
              CGU
            </Link>
            <Link
              href="/confidentialite"
              className="text-white/60 transition-colors hover:text-white"
            >
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

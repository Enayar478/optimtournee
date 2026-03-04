import { Leaf, Linkedin, Twitter, Youtube } from "lucide-react";

const footerLinks = {
  produit: [
    { label: "Fonctionnalités", href: "#features" },
    { label: "Tarifs", href: "#pricing" },
    { label: "Démo", href: "#demo" },
  ],
  ressources: [
    { label: "Blog", href: "#" },
    { label: "Guides", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  entreprise: [
    { label: "À propos", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Recrutement", href: "#" },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="bg-foreground py-16 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-forest flex h-8 w-8 items-center justify-center rounded-lg">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">OptimTournée</span>
            </div>
            <p className="mb-6 max-w-sm text-white/60">
              Optimisez vos tournées d&apos;entretien et gagnez du temps chaque
              jour. Conçu pour les paysagistes, par des paysagistes.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-white/20"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 font-semibold">Produit</h4>
            <ul className="space-y-3">
              {footerLinks.produit.map((link, index) => (
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

          <div>
            <h4 className="mb-4 font-semibold">Ressources</h4>
            <ul className="space-y-3">
              {footerLinks.ressources.map((link, index) => (
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
            © 2025 OptimTournée — Conçu pour les paysagistes 🌳
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="text-white/60 transition-colors hover:text-white"
            >
              Mentions légales
            </a>
            <a
              href="#"
              className="text-white/60 transition-colors hover:text-white"
            >
              CGU
            </a>
            <a
              href="#"
              className="text-white/60 transition-colors hover:text-white"
            >
              Confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { TrackButton } from "@/components/analytics/TrackButton";
import { AnalyticsEvents } from "@/lib/analytics/events";
import { Menu, X, Leaf } from "lucide-react";

const navLinks = [
  { href: "#features", label: "Fonctionnalités" },
  { href: "#demo", label: "Démo" },
  { href: "#pricing", label: "Tarifs" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-border sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-forest flex h-8 w-8 items-center justify-center rounded-lg">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-foreground text-xl font-bold">
              OptimTournée
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <TrackButton
              event={AnalyticsEvents.NAV_CTA_CLICK}
              variant="primary"
              size="sm"
            >
              Demander une démo
            </TrackButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hover:bg-muted rounded-lg p-2 transition-colors md:hidden"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="border-border border-t py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground py-2 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <TrackButton
                event={AnalyticsEvents.NAV_CTA_CLICK}
                variant="primary"
                size="sm"
                className="mt-2 w-full"
              >
                Demander une démo
              </TrackButton>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

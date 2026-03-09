"use client";

import posthog from "posthog-js";
import Link from "next/link";
import { ReactNode } from "react";

interface TrackButtonBaseProps {
  children: ReactNode;
  event: string;
  properties?: Record<string, unknown>;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg" | "default";
  disabled?: boolean;
}

interface TrackButtonAsButton extends TrackButtonBaseProps {
  href?: undefined;
}

interface TrackButtonAsLink extends TrackButtonBaseProps {
  href: string;
}

type TrackButtonProps = TrackButtonAsButton | TrackButtonAsLink;

export function TrackButton({
  children,
  event,
  properties = {},
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  disabled,
  href,
}: TrackButtonProps) {
  const handleClick = () => {
    // Track event in PostHog
    posthog.capture(event, {
      ...properties,
      timestamp: new Date().toISOString(),
      url: typeof window !== "undefined" ? window.location.href : "",
    });

    // Call original onClick if provided
    onClick?.();
  };

  const baseStyles =
    "font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2";

  const variantStyles = {
    primary:
      "bg-forest hover:bg-forest-dark text-white shadow-sm hover:shadow",
    secondary: "bg-forest-surface hover:bg-forest-surface/80 text-forest-dark",
    outline: "border-2 border-forest text-forest hover:bg-forest/5",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    default: "px-5 py-2.5 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  // Si href est fourni, rendre un Link
  if (href) {
    return (
      <Link href={href} className={classes} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  // Sinon rendre un button
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}

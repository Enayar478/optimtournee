"use client";

import Link from "next/link";
import posthog from "posthog-js";

interface TrackButtonProps {
  children: React.ReactNode;
  event: string;
  properties?: Record<string, unknown>;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg" | "default";
  disabled?: boolean;
  href?: string;
}

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
      url: window.location.href,
    });

    // Call original onClick if provided
    onClick?.();
  };

  const baseStyles =
    "font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2";

  const variantStyles = {
    primary:
      "bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    outline: "border-2 border-green-600 text-green-600 hover:bg-green-50",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    default: "px-5 py-2.5 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const buttonClass = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const buttonContent = (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={buttonClass}
    >
      {children}
    </button>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
}

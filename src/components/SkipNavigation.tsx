"use client";

/**
 * Skip navigation link for keyboard users.
 * Allows users to skip directly to main content.
 */
export function SkipNavigation() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-dc-caramel focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-dc-caramel/50 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}

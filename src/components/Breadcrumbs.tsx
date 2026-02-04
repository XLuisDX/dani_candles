"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Map path segments to readable labels
const pathLabels: Record<string, string> = {
  shop: "Shop",
  product: "Product",
  collections: "Collections",
  fragrances: "Fragrances",
  "candle-care": "Candle Care",
  contact: "Contact",
  cart: "Cart",
  checkout: "Checkout",
  account: "Account",
  orders: "Orders",
  admin: "Admin",
  products: "Products",
  search: "Search",
  auth: "Account",
  login: "Sign In",
  register: "Sign Up",
};

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Generate breadcrumbs from path if items not provided
  const breadcrumbs: BreadcrumbItem[] = items || generateBreadcrumbs(pathname);

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-label="Breadcrumb"
      className={`mb-6 ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <svg
                  className="h-3.5 w-3.5 text-dc-ink/30 dark:text-white/30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {isLast || !item.href ? (
                <span className="font-medium text-dc-ink/70 dark:text-white/70">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-dc-ink/50 transition-colors hover:text-dc-caramel dark:text-white/50 dark:hover:text-dc-sand"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
  ];

  let currentPath = "";

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // Skip dynamic segments that look like IDs
    const isId = /^[0-9a-f-]{36}$/i.test(segment);
    if (isId) continue;

    const label =
      pathLabels[segment] ||
      segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    breadcrumbs.push({
      label,
      href: i < segments.length - 1 ? currentPath : undefined,
    });
  }

  return breadcrumbs;
}

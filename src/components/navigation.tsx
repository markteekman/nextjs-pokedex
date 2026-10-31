"use client";

import Link from "next/link";
import {
  Funnel,
  Home,
  Info,
  Search,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

const menuItems: {
  id: number;
  href: string;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    id: 1,
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    id: 2,
    href: "/about",
    label: "About",
    icon: Info,
  },
  {
    id: 3,
    href: "/search",
    label: "Search",
    icon: Search,
  },
  {
    id: 4,
    href: "/filter",
    label: "Filter",
    icon: Funnel,
  },
  {
    id: 5,
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function Navigation() {
  return (
    <nav>
      <ul className="pokedex-nav-list flex flex-col gap-4">
        {menuItems.map(({ id, href, label, icon: Icon }) => (
          <MenuItem key={id} href={href} label={label}>
            <Icon aria-hidden="true" />
          </MenuItem>
        ))}
      </ul>
    </nav>
  );
}

function MenuItem({
  href,
  label,
  children,
}: {
  label: string;
  href: string;
  children: ReactNode;
}) {
  const currentPath = usePathname();

  return (
    <li>
      <Link
        href={href}
        aria-current={currentPath === href ? "page" : undefined}
        className="pokedex-nav-button grid h-16 w-16 place-items-center rounded-md"
      >
        {children}
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
}

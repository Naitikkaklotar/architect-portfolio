"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { site } from "@/lib/site";
import MobileMenu from "./MobileMenu";
import { navLinks } from "./navLinks";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const overHero = isHome && !scrolled && !open;
  const barClass = overHero
    ? "bg-transparent text-white"
    : "border-b border-black/10 bg-[#faf9f7]/95 text-black backdrop-blur-md";

  return (
    <>
      <header className={`sticky top-0 z-40 transition-colors duration-300 ${barClass}`}>
        <nav className="site-container flex h-16 items-center justify-between sm:h-20 md:h-[5.25rem]">
          <Link
            href="/"
            className="min-w-0 font-display text-xl tracking-[0.06em] sm:text-2xl"
            onClick={closeMenu}
          >
            {site.name}
          </Link>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
              <span className="block h-px w-full bg-current" />
              <span className="block h-px w-full bg-current" />
            </span>
          </button>

          <ul className="hidden items-center gap-4 md:flex lg:gap-8 xl:gap-11">
            {navLinks.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <li key={link.href} className="min-w-0">
                  <Link
                    href={link.href}
                    className={`inline-flex min-h-11 items-center text-sm tracking-[0.04em] transition lg:tracking-[0.08em] opacity-75 hover:opacity-100 ${
                      active ? "opacity-100" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <MobileMenu open={open} onClose={closeMenu} pathname={pathname} />
    </>
  );
}

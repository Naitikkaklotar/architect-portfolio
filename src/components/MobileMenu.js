"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { site } from "@/lib/site";
import { navLinks } from "./navLinks";

function subscribeNoop() {
  return () => {};
}

export default function MobileMenu({ open, onClose, pathname }) {
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const closeRef = useRef(null);
  const titleId = useId();
  const panelId = "site-mobile-menu";

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeRef.current?.focus();
    }, 0);

    function onKey(e) {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const root = document.getElementById(panelId);
      if (!root) return;
      const focusable = [
        ...root.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ),
      ];
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    function onResize() {
      if (window.matchMedia("(min-width: 768px)").matches) {
        onClose();
      }
    }

    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, onClose, panelId]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      id={panelId}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[100] flex h-dvh flex-col bg-[#faf9f7] text-black md:hidden motion-safe:animate-fade-in pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-black/10 px-4 sm:h-20 sm:px-6">
        <Link
          href="/"
          id={titleId}
          className="font-display text-xl tracking-[0.06em] sm:text-2xl"
          onClick={onClose}
        >
          {site.name}
        </Link>
        <button
          ref={closeRef}
          type="button"
          className="flex h-11 w-11 items-center justify-center"
          aria-label="Close menu"
          onClick={onClose}
        >
          <span className="relative block h-5 w-5" aria-hidden="true">
            <span className="absolute left-0 top-1/2 block h-px w-5 -translate-y-1/2 rotate-45 bg-black" />
            <span className="absolute left-0 top-1/2 block h-px w-5 -translate-y-1/2 -rotate-45 bg-black" />
          </span>
        </button>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-4 py-8 sm:px-6">
        <ul className="flex flex-col gap-6 sm:gap-8">
          <li>
            <Link
              href="/"
              className={`block min-h-11 font-display text-4xl break-words sm:text-5xl ${
                pathname === "/" ? "text-black" : "text-black/70"
              }`}
              onClick={onClose}
            >
              Home
            </Link>
          </li>
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block min-h-11 font-display text-4xl break-words sm:text-5xl ${
                    active ? "text-black" : "text-black/70"
                  }`}
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>,
    document.body
  );
}

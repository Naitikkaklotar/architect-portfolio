import Link from "next/link";

export default function NotFound() {
  return (
    <div className="site-container flex min-h-[70dvh] flex-col justify-center py-16 md:py-24">
      <h1 className="font-display text-4xl break-words text-black md:text-6xl">Page not found</h1>
      <p className="mt-3 max-w-prose text-[#6b6b6b]">
        That route does not exist in this portfolio.
      </p>
      <Link href="/" className="btn-ghost mt-8 max-w-xs">
        Back home
      </Link>
    </div>
  );
}

import Link from "next/link";
import ProjectImage from "./ProjectImage";
import { productWhatsappUrl } from "@/lib/site";

export default function ProductCard({ product }) {
  const inquireHref = productWhatsappUrl(product);

  return (
    <article className="flex min-w-0 flex-col gap-4">
      <Link
        href={`/products/${product.slug}`}
        className="group block min-w-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e8e6e1]">
          {product.cover ? (
            <ProjectImage
              src={product.cover}
              alt={product.title}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : null}
        </div>
        <div className="mt-4 min-w-0 px-0.5">
          <h2 className="font-display text-2xl break-words text-black md:text-3xl [@media(hover:hover)]:group-hover:opacity-70">
            {product.title}
          </h2>
          <p className="mt-1 text-sm tracking-wide text-[#6b6b6b]">
            {[product.category, product.price].filter(Boolean).join(" · ")}
          </p>
          {product.summary ? (
            <p className="mt-2 max-w-prose text-sm leading-relaxed break-words text-[#4a4a4a]">
              {product.summary}
            </p>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-col gap-2 px-0.5 sm:flex-row">
        <Link href={`/products/${product.slug}`} className="btn-ghost">
          View details
        </Link>
        <a
          href={inquireHref}
          target="_blank"
          rel="noreferrer"
          className="btn-whatsapp"
        >
          Inquire on WhatsApp
        </a>
      </div>
    </article>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectImage from "@/components/ProjectImage";
import Reveal from "@/components/Reveal";
import RevealText from "@/components/RevealText";
import { getProductBySlug, getProductSlugs } from "@/lib/products";
import { productWhatsappUrl, site } from "@/lib/site";

export async function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  const description =
    product.summary || `${product.title} — selected piece for ${site.name}.`;
  const images = product.cover ? [{ url: product.cover }] : undefined;
  return {
    title: product.title,
    description,
    openGraph: { title: product.title, description, images },
    twitter: { card: "summary_large_image", title: product.title, description, images: product.cover ? [product.cover] : undefined },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const inquireHref = productWhatsappUrl(product);

  return (
    <article className="site-container site-section scroll-mt-24">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.16em] text-[#6b6b6b]">
          <Link href="/products" className="[@media(hover:hover)]:hover:text-black">
            Products
          </Link>
          {" · "}Selected piece
        </p>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 gap-10 md:mt-12 md:grid-cols-2 md:gap-14 lg:gap-20">
        <Reveal>
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e8e6e1]">
            {product.cover ? (
              <ProjectImage
                src={product.cover}
                alt={product.title}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : null}
          </div>
        </Reveal>

        <div className="min-w-0 flex flex-col justify-center">
          <RevealText
            as="h1"
            className="font-display text-4xl break-words text-black md:text-5xl xl:text-6xl"
          >
            {product.title}
          </RevealText>
          <p className="mt-3 text-sm tracking-[0.08em] text-[#6b6b6b]">
            {[product.brand, product.category, product.price].filter(Boolean).join(" · ")}
          </p>
          {product.summary ? (
            <Reveal>
              <p className="mt-6 max-w-prose text-base leading-relaxed text-[#3f3f3f] md:text-lg">
                {product.summary}
              </p>
            </Reveal>
          ) : null}
          <Reveal>
            <div
              className="prose-project mt-8 text-base md:text-lg"
              dangerouslySetInnerHTML={{ __html: product.contentHtml }}
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={inquireHref}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
              >
                Inquire about this product
              </a>
              <Link href="/products" className="btn-ghost">
                All products
              </Link>
            </div>
            <p className="mt-3 max-w-prose text-xs leading-relaxed text-[#6b6b6b]">
              Opens WhatsApp with the product name, a short note, and links to
              the photo and this page (WhatsApp cannot auto-attach images from a
              website link).
            </p>
          </Reveal>
        </div>
      </div>
    </article>
  );
}

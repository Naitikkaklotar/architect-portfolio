import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import RevealText from "@/components/RevealText";
import { getAllProducts } from "@/lib/products";
import { site } from "@/lib/site";

export const metadata = {
  title: "Products",
  description: `Selected pieces — sofas, chairs, and finishes curated by ${site.name}.`,
};

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <div className="site-container site-section scroll-mt-24">
      <header className="mb-10 max-w-2xl md:mb-14 lg:mb-16">
        <RevealText
          as="h1"
          className="font-display text-4xl break-words text-black md:text-6xl xl:text-7xl"
        >
          Products
        </RevealText>
        <Reveal>
          <p className="mt-5 max-w-prose text-base leading-relaxed text-[#6b6b6b] md:mt-6 md:text-lg">
            Sofas, chairs, vases, and other pieces selected for our projects.
            Tap a piece for details, or inquire on WhatsApp — we will receive
            your message with a link to the photo.
          </p>
        </Reveal>
      </header>

      {products.length === 0 ? (
        <p className="text-[#6b6b6b]">No products yet. Add some in Admin → Products.</p>
      ) : (
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-3 lg:gap-x-10">
          {products.map((product, i) => (
            <Reveal key={product.slug} delay={i * 60}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

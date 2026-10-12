import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageClient } from "./ProductPageClient";
import { sanitizeScriptContent } from "@/lib/sanitize";
import { getApiUrl, getSiteUrl } from "@/lib/env";

const SITE_URL = getSiteUrl();
const API_BASE = getApiUrl();

type PageProps = {
  params: Promise<{ slug: string; productId: string }>;
};

type ProductSeo = {
  title?: string;
  description?: string | null;
  price?: string | number | null;
  stock_quantity?: number | null;
  image_url?: string | null;
  average_rating?: string | number | null;
  review_count?: number | null;
};

type ProductSeoData = ProductSeo & {
  product?: ProductSeo | null;
};

const PRODUCT_MISSING = "missing" as const;

async function fetchProductSeo(
  slug: string,
  productId: string,
): Promise<ProductSeo | typeof PRODUCT_MISSING | null> {
  try {
    const res = await fetch(
      API_BASE + "/api/v1/public/stores/" + encodeURIComponent(slug) + "/products/" + encodeURIComponent(productId),
      { next: { revalidate: 300 } },
    );
    // Only a definite 404 means the product is gone; other failures fall back to client rendering.
    if (res.status === 404) return PRODUCT_MISSING;
    if (!res.ok) return null;
    const data = (await res.json()) as ProductSeoData;
    return data.product ?? data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, productId } = await params;
  const result = await fetchProductSeo(slug, productId);
  const product = result === PRODUCT_MISSING ? null : result;
  const title = product?.title ?? "محصول";
  const description = product?.description ?? "خرید آنلاین " + title + " در نیشا";
  const canonical = SITE_URL + "/store/" + slug + "/products/" + productId;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      ...(product?.image_url ? { images: [product.image_url] } : {}),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug, productId } = await params;
  const product = await fetchProductSeo(slug, productId);
  if (product === PRODUCT_MISSING) notFound();
  let jsonLdProps: { __html: string } | null = null;
  if (product?.title) {
    const reviewCount = Number(product.review_count ?? 0);
    const jsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      url: SITE_URL + "/store/" + slug + "/products/" + productId,
      ...(product.description ? { description: product.description } : {}),
      ...(product.image_url ? { image: product.image_url } : {}),
      ...(product.price != null
        ? {
            offers: {
              "@type": "Offer",
              // Prices are stored in toman; schema.org needs ISO 4217, and 1 toman = 10 IRR.
              price: String(Number(product.price) * 10),
              priceCurrency: "IRR",
              availability:
                Number(product.stock_quantity ?? 1) > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
          }
        : {}),
      ...(reviewCount > 0 && product.average_rating != null
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: String(product.average_rating),
              reviewCount,
            },
          }
        : {}),
    });
    jsonLdProps = { __html: sanitizeScriptContent(jsonLd) };
  }
  return (
    <>
      {jsonLdProps && <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdProps} />}
      <ProductPageClient slug={slug} productId={Number(productId)} />
    </>
  );
}

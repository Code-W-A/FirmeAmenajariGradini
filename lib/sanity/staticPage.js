import { getStaticPageBySlug } from "./queries";
import { buildMetadataFromSeo } from "./seo";
import { seoCanonical, staticPageSeo } from "@/utils/seoIndexing";

export async function getStaticPageMetadata(slug, fallback) {
  const page = await getStaticPageBySlug(slug);
  const path = `/${slug}`;
  const seo = staticPageSeo(slug, page);

  return buildMetadataFromSeo({
    title: page?.seo?.metaTitle || page?.h1 || page?.title || fallback.title,
    description:
      page?.seo?.metaDescription || page?.intro || fallback.description,
    path: seoCanonical(path, seo),
    image: page?.seo?.socialImage,
    noIndex: seo.noIndex,
  });
}


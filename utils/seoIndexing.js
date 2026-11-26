import { canonicalUrl } from "./siteUrl";

export function seoCanonical(path, seo) {
  const override = seo?.canonical?.trim();
  if (override && /^(\/(?!\/)|https?:\/\/)/i.test(override)) {
    try {
      return canonicalUrl(override);
    } catch {
      return canonicalUrl(path);
    }
  }
  return canonicalUrl(path);
}

export function isIndexablePage(path, seo) {
  return seo?.noIndex !== true && seoCanonical(path, seo) === canonicalUrl(path);
}

const LEGAL_PAGE_SLUGS = new Set(["terms", "politica-confidentialitate", "politica-cookie"]);

export function staticPageSeo(slug, page) {
  return {
    ...page?.seo,
    noIndex: page?.seo?.noIndex === true || (LEGAL_PAGE_SLUGS.has(slug) && !page?.hasBodyText),
  };
}

export function landingPageSeo(page) {
  return {
    ...page?.seo,
    noIndex:
      page?.seo?.noIndex === true ||
      !(page?.intro?.trim() || page?.hasBodyText) ||
      !(page?.matchingCompanyCount > 0),
  };
}

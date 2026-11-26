import { getSitemapContent } from "@/lib/sanity/queries";
import { matchRedirect, STATIC_REDIRECTS } from "@/lib/sanity/redirects";
import { canonicalUrl } from "@/utils/siteUrl";
import { isIndexablePage, landingPageSeo, staticPageSeo } from "@/utils/seoIndexing";
import { buildCompanyPath } from "@/utils/companyPath";
import { companyListPath, companyPageCount } from "@/utils/companyList";
import { isReservedSlug } from "@/utils/reservedPaths";

export const revalidate = 60;

const FIXED_ROUTES = ["/", "/amenajari-gradini", "/blog"];
const CMS_STATIC_SLUGS = [
  "contact",
  "cum-functioneaza",
  "despre-noi",
  "inscrie-firma",
  "politica-confidentialitate",
  "politica-cookie",
  "service",
  "terms",
];

function lastModified(...dates) {
  for (const date of dates) {
    if (!date) continue;
    const parsed = new Date(date);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
}

export default async function sitemap() {
  const { staticPages, counties, landings, companies, companyCount, articles, redirects } =
    await getSitemapContent();
  const staticPagesBySlug = new Map(staticPages.map((page) => [page.slug, page]));
  const redirectRules = [...STATIC_REDIRECTS, ...redirects];
  const entries = new Map();

  function add(path, { seo, date, image } = {}) {
    if (!isIndexablePage(path, seo) || matchRedirect(redirectRules, path)) return;
    const url = canonicalUrl(path);
    if (entries.has(url)) return;
    entries.set(url, {
      url,
      ...(date && { lastModified: date }),
      ...(image && { images: [image] }),
    });
  }

  FIXED_ROUTES.forEach((path) => add(path));
  CMS_STATIC_SLUGS.forEach((slug) => {
    const page = staticPagesBySlug.get(slug);
    add(`/${slug}`, { seo: staticPageSeo(slug, page), date: lastModified(page?._updatedAt) });
  });

  counties.forEach(({ slug, seo, _updatedAt }) => {
    add(`/judet/${slug}`, { seo, date: lastModified(_updatedAt) });
  });
  landings.forEach((page) => {
    if (!isReservedSlug(page.slug)) {
      add(`/${page.slug}`, { seo: landingPageSeo(page), date: lastModified(page._updatedAt) });
    }
  });
  companies.forEach((company) => {
    const path = buildCompanyPath(company);
    if (path?.endsWith(`/${company.slug}`)) {
      add(path, { seo: company.seo, date: lastModified(company._updatedAt), image: company.image });
    }
  });
  for (let page = 2; page <= companyPageCount(companyCount); page++) {
    add(companyListPath(page));
  }
  articles.forEach(({ slug, seo, _updatedAt, publishedAt, image }) => {
    add(`/blog/${slug}`, { seo, date: lastModified(_updatedAt, publishedAt), image });
  });

  return [...entries.values()];
}

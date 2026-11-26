import { isIndexablePage, landingPageSeo } from "./seoIndexing";
import { buildCompanyPath } from "./companyPath";
import { isReservedSlug } from "./reservedPaths";

function normalizePath(path) {
  if (!path || typeof path !== "string") return null;
  const trimmed = path.trim();
  if (!trimmed || /^https?:\/\//i.test(trimmed)) return null;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function normalizeCurrentPath(path) {
  const normalized = normalizePath(path);
  if (!normalized || normalized === "/") return normalized;
  return normalized.replace(/\/+$/, "");
}

export function createInternalLinks(groups = [], currentPath = "") {
  const current = normalizeCurrentPath(currentPath);
  const byPath = new Map();

  groups.flat().forEach((link) => {
    const path = normalizePath(link?.path);
    const label = String(link?.label || "").trim();
    if (!path || !label) return;

    const comparablePath = normalizeCurrentPath(path);
    if (current && comparablePath === current) return;
    if (!byPath.has(comparablePath)) {
      byPath.set(comparablePath, { label, path });
    }
  });

  return Array.from(byPath.values());
}

export function manualLinks(links = []) {
  if (!Array.isArray(links)) return [];
  return links.map((link) => ({
    label: link.label,
    path: link.path,
  }));
}

export function countyLink(county) {
  if (!county?.slug || !county?.name) return [];
  return [{ label: `Firme amenajari gradini in ${county.name}`, path: `/judet/${county.slug}` }];
}

export function serviceCategoryLink(category) {
  if (!category?.name) return [];
  return [{ label: `Firme pentru ${category.name}`, path: "/amenajari-gradini" }];
}

export function linksFromCompanies(companies = [], limit = 6) {
  if (!Array.isArray(companies)) return [];
  return companies
    .filter((company) => company?.slug && company?.siteName)
    .slice(0, limit)
    .map((company) => {
      const path = buildCompanyPath(company);
      if (!path) return null;
      return {
        label: company.siteName,
        path,
      };
    })
    .filter(Boolean);
}

export function linksFromLandingPages(pages = [], limit = 8) {
  if (!Array.isArray(pages)) return [];
  return pages
    .filter(
      (page) =>
        page?.slug &&
        !isReservedSlug(page.slug) &&
      isIndexablePage(`/${page.slug}`, landingPageSeo(page)) &&
        (page?.h1 || page?.title)
    )
    .slice(0, limit)
    .map((page) => ({
      label: page.h1 || page.title,
      path: `/${page.slug}`,
    }));
}

export function linksFromArticles(articles = [], limit = 4) {
  if (!Array.isArray(articles)) return [];
  return articles
    .filter((article) => article?.slug && (article?.siteName || article?.title))
    .slice(0, limit)
    .map((article) => ({
      label: article.siteName || article.title,
      path: `/blog/${article.slug}`,
    }));
}

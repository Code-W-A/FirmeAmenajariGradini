const DEFAULT_SITE_URL = "https://www.firmeamenajarigradina.ro";

export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL
).origin;

const siteHostname = new URL(SITE_URL).hostname;
const publicHostname = siteHostname.replace(/^www\./, "");
const productionHostnames = new Set([
  "firmeamenajarigradina.ro",
  "www.firmeamenajarigradina.ro",
  publicHostname,
  `www.${publicHostname}`,
]);

export function isSiteHostname(hostname) {
  return productionHostnames.has(hostname.toLowerCase());
}

export function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return SITE_URL;

  const value = String(pathOrUrl);
  if (/^https?:\/\//i.test(value)) return value;

  const path = value.startsWith("/") ? value : `/${value}`;
  return `${SITE_URL}${path}`;
}

export function canonicalUrl(pathOrUrl) {
  const value = String(pathOrUrl || "/").trim();
  const url = new URL(value, SITE_URL);
  if (isSiteHostname(url.hostname)) {
    return `${SITE_URL}${url.pathname.replace(/\/+$/, "") || "/"}${url.search}`;
  }

  return `${url.origin}${url.pathname}${url.search}`;
}

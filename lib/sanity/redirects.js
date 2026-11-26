import { isSiteHostname } from "@/utils/siteUrl";

export const STATIC_REDIRECTS = [{ from: "/home-page", to: "/", permanent: true }];

export function normalizePath(value) {
  const path = String(value || "");
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path || "/";
}

export function parseRedirectSource(value) {
  const raw = String(value || "").trim();
  if (!raw || raw.startsWith("//")) return null;

  let path = raw;
  let search = "";

  if (/^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      if (!isSiteHostname(url.hostname)) return null;
      path = url.pathname;
      search = url.search;
    } catch {
      return null;
    }
  } else {
    const queryIndex = raw.indexOf("?");
    if (queryIndex >= 0) {
      path = raw.slice(0, queryIndex);
      search = raw.slice(queryIndex);
    }
  }

  if (!path.startsWith("/")) path = `/${path}`;
  return { path: normalizePath(path), search };
}

export function resolveDestination(value) {
  const raw = String(value || "").trim();
  if (!raw || raw.startsWith("//")) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  return raw.startsWith("/") ? raw : `/${raw}`;
}

export function matchRedirect(redirects, pathname, search = "") {
  const path = normalizePath(pathname);
  const currentSearch = search || "";

  for (const row of redirects || []) {
    const source = parseRedirectSource(row?.from);
    if (!source || source.path !== path) continue;
    if (source.search && source.search !== currentSearch) continue;

    const destination = resolveDestination(row?.to);
    if (!destination) continue;

    const target = parseRedirectSource(destination);
    if (target?.path === path && target.search === currentSearch) continue;

    return {
      destination,
      permanent: row?.permanent !== false,
    };
  }

  return null;
}

let cache = { at: 0, rows: [] };
const CACHE_MS = 60_000;

export async function getSanityRedirects() {
  if (Date.now() - cache.at < CACHE_MS) return cache.rows;

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19";
  if (!projectId) {
    cache = { at: Date.now(), rows: [] };
    return [];
  }

  const query =
    '*[_type == "redirect" && defined(from) && defined(to)]{from, to, permanent}';
  const endpoint = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  const headers = {};
  if (process.env.SANITY_API_READ_TOKEN) {
    headers.Authorization = `Bearer ${process.env.SANITY_API_READ_TOKEN}`;
  }

  try {
    const response = await fetch(endpoint, { headers });
    if (!response.ok) throw new Error(`Sanity redirects returned ${response.status}`);
    const payload = await response.json();
    if (!Array.isArray(payload?.result)) throw new Error("Invalid Sanity redirects response");
    const rows = payload.result;
    cache = { at: Date.now(), rows };
    return rows;
  } catch (error) {
    console.error("Redirect fetch failed:", error);
    return cache.rows;
  }
}

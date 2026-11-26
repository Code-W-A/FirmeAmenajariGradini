import { isReservedSlug } from "./reservedPaths";

function withSearch(path, searchKey) {
  const key = String(searchKey || "").trim();
  if (!key) return path;
  return `${path}?slug=${encodeURIComponent(key)}`;
}

function same(left, right) {
  if (!left && !right) return true;
  return left === right;
}

export function findLandingPath(landings, { citySlug, categorySlug } = {}) {
  const rows = (landings || []).filter(
    (row) => row?.slug && !isReservedSlug(row.slug)
  );
  if (!citySlug && !categorySlug) return null;

  if (citySlug && categorySlug) {
    const match = rows.find(
      (row) => row.citySlug === citySlug && row.categorySlug === categorySlug
    );
    return match ? `/${match.slug}` : null;
  }

  const matches = rows.filter(
    (row) =>
      same(row.citySlug, citySlug) && same(row.categorySlug, categorySlug)
  );
  if (matches.length !== 1) return null;
  return `/${matches[0].slug}`;
}

export function buildSearchPath({
  countySlug,
  citySlug,
  categorySlug,
  searchKey,
  landings,
} = {}) {
  if (citySlug || categorySlug) {
    const landing = findLandingPath(landings, { citySlug, categorySlug });
    return withSearch(landing || "/amenajari-gradini", searchKey);
  }

  if (countySlug) return withSearch(`/judet/${countySlug}`, searchKey);
  return withSearch("/amenajari-gradini", searchKey);
}

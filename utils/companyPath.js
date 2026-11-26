import { slugify, slugifyFirma } from "./slugify";

function normalizeLocalitateSlug(localitateSlug, localitate) {
  const fromReference = slugify(localitateSlug || "");
  if (fromReference) return fromReference;

  const fromName = slugify(localitate || "");
  if (fromName) return fromName;

  return "localitate-necunoscuta";
}

function normalizeCompanySlug(slug, company) {
  const fromField = slugify(slug || "");
  if (fromField) return fromField;

  const fromFallback = slugifyFirma(company);
  if (fromFallback) return fromFallback;

  return "";
}

export function buildCompanyPath(company) {
  if (!company) return null;

  const companySlug = normalizeCompanySlug(company.slug, company);
  if (!companySlug) return null;

  const localitateSlug = normalizeLocalitateSlug(
    company.localitateSlug,
    company.localitate
  );

  return `/firme-amenajari-gradini/${localitateSlug}/${companySlug}`;
}

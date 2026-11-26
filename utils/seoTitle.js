const TITLE_SUFFIX = " | FirmeAmenajariGradina.ro";
const TITLE_MAX = 60;

export function pageTitle(title) {
  const value = String(title || "").trim();
  if (!value) return value;
  if (value.length + TITLE_SUFFIX.length > TITLE_MAX) {
    return { absolute: value };
  }
  return value;
}

const RESERVED_SLUGS = new Set([
  "amenajari-gradini",
  "blog",
  "cauta",
  "contact",
  "cum-functioneaza",
  "despre-noi",
  "inscrie-firma",
  "politica-confidentialitate",
  "politica-cookie",
  "service",
  "terms",
  "judet",
  "firma",
  "firme-amenajari-gradini",
  "studio",
  "dashboard",
  "signin",
  "mesaje",
  "setari",
  "inscrieri",
  "lista-cereri",
  "home-page",
  "404",
  "create-listing",
]);

export function isReservedSlug(slug) {
  const value = String(slug || "").trim().toLowerCase();
  if (!value) return false;
  if (RESERVED_SLUGS.has(value)) return true;
  return value.startsWith("adauga-") || value.startsWith("lista-");
}

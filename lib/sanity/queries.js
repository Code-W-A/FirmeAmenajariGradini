import { groq } from "next-sanity";
import { sanityFetch } from "./client";
import { isReservedSlug } from "@/utils/reservedPaths";

const imageWithAltProjection = groq`{
  "finalUri": image.asset->url,
  "alt": alt,
  "caption": caption,
  "width": image.asset->metadata.dimensions.width,
  "height": image.asset->metadata.dimensions.height
}`;

const seoProjection = groq`{
  metaTitle,
  metaDescription,
  canonical,
  noIndex,
  "socialImage": socialImage${imageWithAltProjection}
}`;

export const companyProjection = groq`{
  _id,
  _updatedAt,
  "documentId": _id,
  "siteName": name,
  name,
  "slug": slug.current,
  "stare": select(published == true => "Publicat", "Nepublicat"),
  "categorie": serviceCategory->name,
  "categorieSlug": serviceCategory->slug.current,
  "judet": county->name,
  "judetSlug": county->slug.current,
  "localitate": city->name,
  "localitateSlug": city->slug.current,
  "adresa": address,
  "codPostal": postalCode,
  "telefonUnu": phonePrimary,
  "telefonDoi": phoneSecondary,
  "emailUnu": emailPrimary,
  "emailDoi": emailSecondary,
  "websiteUnu": websitePrimary,
  "websiteDoi": websiteSecondary,
  facebook,
  "googlePlus": googleBusinessUrl,
  "logo": logo${imageWithAltProjection},
  "imagini": {
    "imgs": coalesce(gallery[]${imageWithAltProjection}, [])
  },
  "articleContentFirst": description,
  "articleContentSecond": null,
  shortDescription,
  "metaTitle": coalesce(seo.metaTitle, name),
  "metaDescription": coalesce(seo.metaDescription, shortDescription),
  structuredData,
  "coordonate": select(defined(coordinates) => {
    "lat": coordinates.lat,
    "lng": coordinates.lng
  }, null),
  "seo": seo${seoProjection}
}`;

const countyProjection = groq`{
  _id,
  _updatedAt,
  name,
  "siteName": name,
  "slug": slug.current,
  intro,
  content,
  faq,
  "seo": seo${seoProjection}
}`;

const cityProjection = groq`{
  _id,
  name,
  "siteName": name,
  "slug": slug.current,
  "judet": county->name,
  "countySlug": county->slug.current,
  shortDescription,
  seoPriority,
  "coordonate": select(defined(coordinates) => {
    "lat": coordinates.lat,
    "lng": coordinates.lng
  }, null)
}`;

const serviceCategoryProjection = groq`{
  _id,
  name,
  "siteName": name,
  "slug": slug.current,
  description,
  "icon": icon${imageWithAltProjection},
  "seo": seo${seoProjection}
}`;

const eligibleLandingCompany = groq`
  _type == "company" && published == true && defined(slug.current)
`;

const landingCompanyMatch = groq`
  (!defined(^.city._ref) || city._ref == ^.city._ref) &&
  (!defined(^.county._ref) || county._ref == ^.county._ref) &&
  (!defined(^.serviceCategory._ref) ||
    serviceCategory._ref == ^.serviceCategory._ref ||
    ^.serviceCategory._ref in services[]._ref)
`;

const landingQualityProjection = groq`
  intro,
  "hasBodyText": length(pt::text(content)) > 0,
  "matchingCompanyCount": select(
    defined(city._ref) || defined(county._ref) || defined(serviceCategory._ref) =>
      count(*[${eligibleLandingCompany} && ${landingCompanyMatch}]),
    0
  )
`;

const landingPageProjection = groq`{
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  h1,
  content,
  faq,
  internalLinks,
  "cityId": city->_id,
  "countyId": county->_id,
  "serviceCategoryId": serviceCategory->_id,
  "city": city->${cityProjection},
  "county": county->${countyProjection},
  "serviceCategory": serviceCategory->${serviceCategoryProjection},
  "featuredCompanyIds": featuredCompanies[]._ref,
  "featuredCompanies": *[
    ${eligibleLandingCompany} && ${landingCompanyMatch} &&
    _id in ^.featuredCompanies[]._ref
  ] ${companyProjection},
  ${landingQualityProjection},
  "seo": seo${seoProjection}
}`;

const articleProjection = groq`{
  _id,
  _createdAt,
  _updatedAt,
  title,
  "siteName": title,
  "slug": slug.current,
  publishedAt,
  "lastUpdateDate": string(_updatedAt),
  "firstUploadDate": coalesce(string(publishedAt), string(_createdAt)),
  author,
  "categoryId": category->_id,
  "category": category->${serviceCategoryProjection},
  excerpt,
  content,
  faq,
  "image": image${imageWithAltProjection},
  "metaTitle": coalesce(seo.metaTitle, title),
  "metaDescription": coalesce(seo.metaDescription, excerpt),
  "seo": seo${seoProjection}
}`;

const staticPageProjection = groq`{
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  h1,
  intro,
  content,
  "hasBodyText": length(pt::text(content)) > 0,
  "seo": seo${seoProjection}
}`;

export async function getSiteSettings() {
  return sanityFetch({
    query: groq`*[_type == "siteSettings"][0]{
      _updatedAt,
      title,
      siteUrl,
      googleSiteVerification,
      "defaultSeo": defaultSeo${seoProjection}
    }`,
    fallback: null,
    tags: ["siteSettings"],
  });
}

export async function getServiceCategories() {
  return sanityFetch({
    query: groq`*[_type == "serviceCategory"] | order(name asc) ${serviceCategoryProjection}`,
    fallback: [],
    tags: ["serviceCategory"],
  });
}

export async function getCounties() {
  return sanityFetch({
    query: groq`*[_type == "county"] | order(name asc) ${countyProjection}`,
    strict: true,
    fallback: [],
    tags: ["county"],
  });
}

export async function getCities() {
  return sanityFetch({
    query: groq`*[_type == "city"] | order(name asc) ${cityProjection}`,
    fallback: [],
    tags: ["city"],
  });
}

export async function getCitiesByCountySlug(countySlug) {
  return sanityFetch({
    query: groq`*[
      _type == "city" &&
      county->slug.current == $countySlug
    ] | order(name asc) ${cityProjection}`,
    params: { countySlug },
    fallback: [],
    tags: ["city", "county", `county:${countySlug}`],
  });
}

export async function getCompanyBySlug(slug) {
  return sanityFetch({
    query: groq`*[_type == "company" && published == true && slug.current == $slug][0] ${companyProjection}`,
    params: { slug },
    strict: true,
    fallback: null,
    tags: ["company", `company:${slug}`],
  });
}

export async function getCompanySlugs() {
  return sanityFetch({
    query: groq`*[_type == "company" && published == true && defined(slug.current)]{"slug": slug.current}`,
    fallback: [],
    tags: ["company"],
    revalidate: 3600,
  });
}

export async function getCompanyRouteParams() {
  return sanityFetch({
    query: groq`*[
      _type == "company" &&
      published == true &&
      defined(slug.current)
    ]{
      "slug": slug.current,
      "localitateSlug": city->slug.current,
      "localitate": city->name
    }`,
    fallback: [],
    tags: ["company", "city"],
    revalidate: 3600,
  });
}

export async function getPublishedCompanies({ limit = 200 } = {}) {
  return sanityFetch({
    query: groq`*[_type == "company" && published == true] | order(name asc) [0...$limit] ${companyProjection}`,
    params: { limit },
    strict: true,
    fallback: [],
    tags: ["company"],
  });
}

export async function getPublishedCompanyCount() {
  return sanityFetch({
    query: groq`count(*[_type == "company" && published == true])`,
    strict: true,
    fallback: 0,
    tags: ["company"],
  });
}

export async function getPublishedCompaniesPage({
  page = 1,
  pageSize = 48,
} = {}) {
  const start = Math.max(0, (page - 1) * pageSize);
  const end = start + pageSize;
  return sanityFetch({
    query: groq`*[_type == "company" && published == true] | order(name asc) [$start...$end] ${companyProjection}`,
    params: { start, end },
    strict: true,
    fallback: [],
    tags: ["company"],
  });
}

export async function getLandingPageRoutes() {
  return sanityFetch({
    query: groq`*[
      _type == "localLandingPage" &&
      published == true &&
      defined(slug.current)
    ]{
      "slug": slug.current,
      "citySlug": city->slug.current,
      "countySlug": county->slug.current,
      "categorySlug": serviceCategory->slug.current
    }`,
    fallback: [],
    tags: ["localLandingPage", "city", "county", "serviceCategory"],
  });
}

export async function getCompaniesByCountySlug(countySlug) {
  return sanityFetch({
    query: groq`*[
      _type == "company" &&
      published == true &&
      county->slug.current == $countySlug
    ] | order(name asc) ${companyProjection}`,
    params: { countySlug },
    strict: true,
    fallback: [],
    tags: ["company", "county", `county:${countySlug}`],
  });
}

export async function getCountyBySlug(slug) {
  return sanityFetch({
    query: groq`*[_type == "county" && slug.current == $slug][0] ${countyProjection}`,
    params: { slug },
    strict: true,
    fallback: null,
    tags: ["county", `county:${slug}`],
  });
}

export async function getCountySlugs() {
  return sanityFetch({
    query: groq`*[_type == "county" && defined(slug.current)]{"id": slug.current}`,
    fallback: [],
    tags: ["county"],
    revalidate: 3600,
  });
}

export async function getLocalLandingPageBySlug(slug) {
  if (isReservedSlug(slug)) return null;

  return sanityFetch({
    query: groq`*[
      _type == "localLandingPage" &&
      published == true &&
      slug.current == $slug
    ][0] ${landingPageProjection}`,
    params: { slug },
    strict: true,
    fallback: null,
    tags: ["localLandingPage", `localLandingPage:${slug}`],
  });
}

export async function getLocalLandingPageSlugs() {
  return sanityFetch({
    query: groq`*[
      _type == "localLandingPage" &&
      published == true &&
      defined(slug.current)
    ]{
      "clinici": slug.current,
      _updatedAt,
      "seo": seo${seoProjection}
    }`,
    fallback: [],
    tags: ["localLandingPage"],
    revalidate: 3600,
  });
}

export async function getLandingPagesByCountySlug(countySlug, { limit } = {}) {
  const bounded = Number.isInteger(limit) && limit >= 0;
  const range = bounded ? `[0...${limit}]` : "";
  return sanityFetch({
    query: groq`*[
      _type == "localLandingPage" &&
      published == true &&
      defined(slug.current) &&
      (county->slug.current == $countySlug ||
        (!defined(county._ref) && city->county->slug.current == $countySlug))
    ] | order(coalesce(city->seoPriority, 0) desc, title asc) ${range} {
      _id,
      title,
      h1,
      "slug": slug.current,
      "city": city->${cityProjection},
      "serviceCategory": serviceCategory->${serviceCategoryProjection},
      ${landingQualityProjection},
      "seo": seo${seoProjection}
    }`,
    params: { countySlug },
    strict: true,
    fallback: [],
    tags: ["localLandingPage", "county", `county:${countySlug}`],
  });
}

export async function getRelatedArticlesForLandingPage(page, { limit = 4 } = {}) {
  const categoryId = page?.serviceCategoryId || null;
  return sanityFetch({
    query: groq`*[
      _type == "article" &&
      published == true &&
      defined(slug.current) &&
      (!defined($categoryId) || category._ref == $categoryId)
    ] | order(coalesce(publishedAt, _createdAt) desc) [0...$limit] ${articleProjection}`,
    params: { categoryId, limit },
    fallback: [],
    tags: ["article", "localLandingPage"],
  });
}

export async function getRelatedLandingPagesForArticle(article, { limit = 4 } = {}) {
  const categoryId = article?.categoryId || null;
  return sanityFetch({
    query: groq`*[
      _type == "localLandingPage" &&
      published == true &&
      defined(slug.current) &&
      (!defined($categoryId) || serviceCategory._ref == $categoryId)
    ] | order(_updatedAt desc) [0...$limit] {
      _id,
      title,
      h1,
      "slug": slug.current,
      "city": city->${cityProjection},
      "county": county->${countyProjection},
      "serviceCategory": serviceCategory->${serviceCategoryProjection},
      ${landingQualityProjection},
      "seo": seo${seoProjection}
    }`,
    params: { categoryId, limit },
    fallback: [],
    tags: ["localLandingPage", "article"],
  });
}

export async function getRelatedCompaniesForArticle(article, { limit = 4 } = {}) {
  const categoryId = article?.categoryId || null;
  return sanityFetch({
    query: groq`*[
      _type == "company" &&
      published == true &&
      (!defined($categoryId) || serviceCategory._ref == $categoryId || $categoryId in services[]._ref)
    ] | order(name asc) [0...$limit] ${companyProjection}`,
    params: { categoryId, limit },
    fallback: [],
    tags: ["company", "article"],
  });
}

export async function getCompaniesForLandingPage(page) {
  if (!page || !(page.cityId || page.countyId || page.serviceCategoryId)) return [];
  if (Array.isArray(page.featuredCompanies) && page.featuredCompanies.length) {
    const byId = new Map(page.featuredCompanies.map((company) => [company._id, company]));
    return page.featuredCompanyIds.map((id) => byId.get(id)).filter(Boolean);
  }

  return sanityFetch({
    query: groq`*[
      ${eligibleLandingCompany} &&
      (!defined($cityId) || city._ref == $cityId) &&
      (!defined($countyId) || county._ref == $countyId) &&
      (!defined($serviceCategoryId) || serviceCategory._ref == $serviceCategoryId || $serviceCategoryId in services[]._ref)
    ] | order(name asc) ${companyProjection}`,
    params: {
      cityId: page.cityId || null,
      countyId: page.countyId || null,
      serviceCategoryId: page.serviceCategoryId || null,
    },
    strict: true,
    fallback: [],
    tags: ["company", "localLandingPage"],
  });
}

export async function getArticles({ limit = 100 } = {}) {
  return sanityFetch({
    query: groq`*[
      _type == "article" &&
      published == true &&
      defined(slug.current)
    ] | order(coalesce(publishedAt, _createdAt) desc) [0...$limit] ${articleProjection}`,
    params: { limit },
    strict: true,
    fallback: [],
    tags: ["article"],
  });
}

export async function getArticleBySlug(slug) {
  return sanityFetch({
    query: groq`*[
      _type == "article" &&
      published == true &&
      slug.current == $slug
    ][0] ${articleProjection}`,
    params: { slug },
    strict: true,
    fallback: null,
    tags: ["article", `article:${slug}`],
  });
}

export async function getArticleSlugs() {
  return sanityFetch({
    query: groq`*[
      _type == "article" &&
      published == true &&
      defined(slug.current)
    ]{"id": slug.current}`,
    fallback: [],
    tags: ["article"],
    revalidate: 3600,
  });
}

export async function getStaticPageBySlug(slug) {
  return sanityFetch({
    query: groq`*[
      _type == "staticPage" &&
      published == true &&
      slug.current == $slug
    ][0] ${staticPageProjection}`,
    params: { slug },
    strict: true,
    fallback: null,
    tags: ["staticPage", `staticPage:${slug}`],
  });
}

export async function getStaticPages() {
  return sanityFetch({
    query: groq`*[
      _type == "staticPage" &&
      published == true &&
      defined(slug.current)
    ] ${staticPageProjection}`,
    fallback: [],
    tags: ["staticPage"],
    revalidate: 3600,
  });
}


const sitemapSeoProjection = groq`{ canonical, noIndex }`;

export async function getSitemapContent() {
  return sanityFetch({
    query: groq`{
      "staticPages": *[_type == "staticPage" && published == true && defined(slug.current)]{
        "slug": slug.current, _updatedAt, "seo": seo${sitemapSeoProjection},
        "hasBodyText": length(pt::text(content)) > 0
      },
      "counties": *[_type == "county" && defined(slug.current)]{
        "slug": slug.current, _updatedAt, "seo": seo${sitemapSeoProjection}
      },
      "landings": *[_type == "localLandingPage" && published == true && defined(slug.current)]{
        "slug": slug.current, _updatedAt, "seo": seo${sitemapSeoProjection},
        ${landingQualityProjection}
      },
      "companies": *[${eligibleLandingCompany}]{
        "slug": slug.current, "localitateSlug": city->slug.current,
        "localitate": city->name, _updatedAt, "seo": seo${sitemapSeoProjection},
        "image": gallery[0].image.asset->url
      },
      "companyCount": count(*[_type == "company" && published == true]),
      "articles": *[_type == "article" && published == true && defined(slug.current)]{
        "slug": slug.current, _updatedAt, publishedAt, "seo": seo${sitemapSeoProjection},
        "image": image.image.asset->url
      },
      "redirects": *[_type == "redirect" && defined(from) && defined(to)]{from, to, permanent}
    }`,
    strict: true,
    revalidate: 60,
    tags: ["sitemap"],
    fallback: {
      staticPages: [], counties: [], landings: [], companies: [],
      companyCount: 0, articles: [], redirects: [],
    },
  });
}

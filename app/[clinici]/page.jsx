import SliderStyle from "@/components/listing-style/slider-style";
import {
  getCompaniesForLandingPage,
  getCounties,
  getCities,
  getLocalLandingPageBySlug,
  getLocalLandingPageSlugs,
  getRelatedArticlesForLandingPage,
  getServiceCategories,
} from "@/lib/sanity/queries";
import { notFound } from "next/navigation";
import JsonLd, { BreadcrumbsJsonLd } from "@/components/common/JsonLd";
import { buildFaqPageLd, buildItemListLd } from "@/utils/schemaOrg";
import { seoCanonical, landingPageSeo } from "@/utils/seoIndexing";
import { DEFAULT_OG_IMAGE } from "@/utils/seoDefaults";
import { pageTitle } from "@/utils/seoTitle";
import { isReservedSlug } from "@/utils/reservedPaths";
import {
  countyLink,
  createInternalLinks,
  linksFromArticles,
  linksFromCompanies,
  manualLinks,
  serviceCategoryLink,
} from "@/utils/internalLinks";

export const revalidate = 60;

export async function generateStaticParams() {
  const pages = await getLocalLandingPageSlugs();
  return pages.filter((page) => page?.clinici && !isReservedSlug(page.clinici));
}

export async function generateMetadata({ params }) {
  const page = await getLocalLandingPageBySlug(params.clinici);
  const title = page?.seo?.metaTitle || page?.h1 || page?.title || "Pagina locala";
  const description =
    page?.seo?.metaDescription ||
    page?.intro ||
    "Firme locale de amenajari gradini si spatii verzi.";
  const seo = landingPageSeo(page);
  const canonical = seoCanonical(`/${params.clinici}`, seo);

  return {
    title: pageTitle(title),
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      images: page?.seo?.socialImage?.finalUri
        ? [
            {
              url: page.seo.socialImage.finalUri,
              width: page.seo.socialImage.width || 1200,
              height: page.seo.socialImage.height || 630,
              alt: page.seo.socialImage.alt || title,
            },
          ]
        : [DEFAULT_OG_IMAGE],
    },
    alternates: {
      canonical,
    },
    robots: seo.noIndex ? { index: false, follow: true } : undefined,
  };
}

const index = async ({ params }) => {
  if (isReservedSlug(params.clinici)) {
    notFound();
  }

  const page = await getLocalLandingPageBySlug(params.clinici);
  if (!page) notFound();

  const [judete, categorii, localitati, firme, relatedArticles] = await Promise.all([
    getCounties(),
    getServiceCategories(),
    getCities(),
    getCompaniesForLandingPage(page),
    getRelatedArticlesForLandingPage(page, { limit: 4 }),
  ]);
  const pagePath = `/${params.clinici}`;
  const h1Title = page.h1 || page.title;

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: h1Title,
    url: seoCanonical(pagePath, page.seo),
    description:
      page?.seo?.metaDescription ||
      page?.intro ||
      "Lista firmelor locale listate pe FirmeAmenajariGradina.ro.",
  };

  const itemListLd = buildItemListLd(firme);
  const faqPageLd = buildFaqPageLd(page.faq, pagePath);

  const breadcrumbs = [{ name: "Acasa", path: "/" }];
  if (page?.county?.name && page.county.slug) {
    breadcrumbs.push({
      name: page.county.name,
      path: `/judet/${page.county.slug}`,
    });
  }
  breadcrumbs.push({ name: h1Title, path: pagePath });
  const internalLinks = createInternalLinks(
    [
      manualLinks(page.internalLinks),
      countyLink(page.county),
      serviceCategoryLink(page.serviceCategory),
      linksFromCompanies(firme, 6),
      linksFromArticles(relatedArticles, 4),
    ],
    pagePath
  );

  return (
    <>
      <JsonLd data={webPageLd} />
      <JsonLd data={itemListLd} />
      <JsonLd data={faqPageLd} />
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <SliderStyle
        params={params.clinici}
        judete={judete}
        categorii={categorii}
        localitati={localitati}
        firme={firme}
        renderMode="listing"
        h1Title={h1Title}
        landingPage={page}
        internalLinks={internalLinks}
      />
    </>
  );
};

export default index;

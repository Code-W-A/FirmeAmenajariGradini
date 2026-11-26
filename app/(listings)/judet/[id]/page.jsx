import Judete from "../../../../components/judete";
import {
  getCitiesByCountySlug,
  getCompaniesByCountySlug,
  getCountyBySlug,
  getCountySlugs,
  getLandingPageRoutes,
  getLandingPagesByCountySlug,
} from "@/lib/sanity/queries";
import { notFound } from "next/navigation";
import { filtrareOferte } from "@/utils/commonUtils";
import JsonLd, { BreadcrumbsJsonLd } from "@/components/common/JsonLd";
import { buildFaqPageLd, buildItemListLd } from "@/utils/schemaOrg";
import { seoCanonical } from "@/utils/seoIndexing";
import { DEFAULT_OG_IMAGE } from "@/utils/seoDefaults";
import { pageTitle } from "@/utils/seoTitle";
import {
  createInternalLinks,
  linksFromLandingPages,
} from "@/utils/internalLinks";

export const revalidate = 60; // revalidate at most every minute , hour at 3600

export async function generateStaticParams() {
  return await getCountySlugs();
}

export async function generateMetadata({ params, searchParams }) {
  const county = await getCountyBySlug(params.id);
  const judetParam = county?.name || params.id;
  const title = `Specialisti in peisagistica si gradinarit ${judetParam}`;
  const description =
    county?.seo?.metaDescription ||
    `Firme serioase de amenajari gradini si spatii verzi din judetul ${judetParam}. Vezi peisagistii recomandati si cere oferta acum.`;
  const canonical = seoCanonical(`/judet/${params.id}`, county?.seo);
  return {
    title: pageTitle(county?.seo?.metaTitle || title),
    description,
    openGraph: {
      title: county?.seo?.metaTitle || title,
      description,
      url: canonical,
      images: county?.seo?.socialImage?.finalUri
        ? [
            {
              url: county.seo.socialImage.finalUri,
              width: county.seo.socialImage.width || 1200,
              height: county.seo.socialImage.height || 630,
              alt: county.seo.socialImage.alt || title,
            },
          ]
        : [DEFAULT_OG_IMAGE],
    },
    alternates: {
      canonical,
    },
    robots: (county?.seo?.noIndex || searchParams?.slug)
      ? { index: false, follow: true }
      : undefined,
  };
}

const index = async ({ params, searchParams }) => {
  const county = await getCountyBySlug(params.id);
  if (!county) notFound();

  const [localitati, firms, landingPages, landingRoutes] = await Promise.all([
    getCitiesByCountySlug(params.id),
    getCompaniesByCountySlug(params.id),
    getLandingPagesByCountySlug(params.id),
    getLandingPageRoutes(),
  ]);
  const searchKey = searchParams?.slug;
  const data = {
    county,
    localitati,
    firms: searchKey ? await filtrareOferte(firms, searchKey) : firms,
  };

  const judetParam = data.county.name;
  const h1Title = `Firme de amenajari gradini si spatii verzi in ${judetParam}`;

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Specialisti in peisagistica si gradinarit ${judetParam}`,
    description: `Firme serioase de amenajari gradini si spatii verzi din judetul ${judetParam}.`,
    url: seoCanonical(`/judet/${params.id}`, county.seo),
  };

  const itemListLd = buildItemListLd(data.firms);
  const faqPageLd = buildFaqPageLd(data.county.faq, `/judet/${params.id}`);
  const internalLinks = createInternalLinks(
    [linksFromLandingPages(landingPages, landingPages.length)],
    `/judet/${params.id}`
  );

  return (
    <>
      <JsonLd data={webPageLd} />
      <JsonLd data={itemListLd} />
      <JsonLd data={faqPageLd} />
      <BreadcrumbsJsonLd
        items={[
          { name: "Acasa", path: "/" },
          { name: "Judete", path: "/amenajari-gradini" },
          { name: judetParam, path: `/judet/${params.id}` },
        ]}
      />

      <Judete
        data={data}
        judet={judetParam}
        h1Title={h1Title}
        params={params}
        searchParams={searchKey}
        internalLinks={internalLinks}
        countySlug={params.id}
        landingRoutes={landingRoutes}
      />
    </>
  );
};

export default index;

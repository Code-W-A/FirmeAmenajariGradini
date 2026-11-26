import SliderStyle from "@/components/listing-style/slider-style";
import { notFound, permanentRedirect } from "next/navigation";
import JsonLd, { BreadcrumbsJsonLd } from "@/components/common/JsonLd";
import { buildLocalBusinessLd } from "@/utils/schemaOrg";
import { seoCanonical } from "@/utils/seoIndexing";
import { buildCompanyPath } from "@/utils/companyPath";
import { DEFAULT_OG_IMAGE } from "@/utils/seoDefaults";
import { pageTitle } from "@/utils/seoTitle";
import { findLandingPath } from "@/utils/searchDestination";
import {
  getCompanyBySlug,
  getCompanyRouteParams,
  getCounties,
  getCities,
  getLandingPageRoutes,
  getServiceCategories,
} from "@/lib/sanity/queries";

export const revalidate = 60;

async function getFirmaBySlug(slug) {
  return getCompanyBySlug(slug);
}

export async function generateStaticParams() {
  try {
    const routes = await getCompanyRouteParams();
    return routes
      .filter((item) => item?.slug)
      .map((item) => {
        const canonicalPath = buildCompanyPath(item);
        if (!canonicalPath) return null;

        const parts = canonicalPath.split("/").filter(Boolean);
        return {
          localitate: parts[1],
          slug: parts[2],
        };
      })
      .filter(Boolean);
  } catch (err) {
    console.error("generateStaticParams firma failed", err);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const firma = await getFirmaBySlug(params.slug);
  const requestedPath = `/firme-amenajari-gradini/${params.localitate}/${params.slug}`;
  const pagePath = firma ? buildCompanyPath(firma) || requestedPath : requestedPath;
  const canonical = seoCanonical(pagePath, firma?.seo);

  if (!firma) {
    return {
      title: pageTitle("Firma negasita"),
      alternates: { canonical },
      robots: { index: false, follow: false },
    };
  }

  const title =
    firma.metaTitle ||
    [firma.siteName, firma.localitate, firma.judet]
      .filter(Boolean)
      .join(" - ");
  const description =
    firma.metaDescription ||
    firma.shortDescription ||
    "Vezi detalii, contact si servicii pe FirmeAmenajariGradina.ro.";
  const image = firma?.imagini?.imgs?.[0] || firma?.logo;

  return {
    title: pageTitle(title),
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      images: image?.finalUri
        ? [
            {
              url: image.finalUri,
              width: image.width || 1200,
              height: image.height || 630,
              alt: image.alt || title,
            },
          ]
        : [DEFAULT_OG_IMAGE],
    },
    alternates: { canonical },
    robots: firma?.seo?.noIndex ? { index: false, follow: true } : undefined,
  };
}

const Page = async ({ params }) => {
  const firma = await getFirmaBySlug(params.slug);
  if (!firma) {
    notFound();
  }

  const pagePath = buildCompanyPath(firma);
  if (!pagePath) {
    notFound();
  }

  const pathParts = pagePath.split("/").filter(Boolean);
  const expectedLocalitate = pathParts[1];
  if (params.localitate !== expectedLocalitate) {
    permanentRedirect(pagePath);
  }

  const [judete, categorii, localitati, landingRoutes] = await Promise.all([
    getCounties(),
    getServiceCategories(),
    getCities(),
    getLandingPageRoutes(),
  ]);

  const localBusinessLd = buildLocalBusinessLd(firma, null, seoCanonical(pagePath, firma.seo));
  const cityLanding =
    findLandingPath(landingRoutes, {
      citySlug: firma.localitateSlug,
      categorySlug: firma.categorieSlug,
    }) ||
    findLandingPath(landingRoutes, { citySlug: firma.localitateSlug });
  const hierarchyLinks = [];
  if (firma.judetSlug && firma.judet) {
    hierarchyLinks.push({
      label: `Firme in ${firma.judet}`,
      path: `/judet/${firma.judetSlug}`,
    });
  }
  if (cityLanding && firma.localitate) {
    hierarchyLinks.push({
      label: `Firme in ${firma.localitate}`,
      path: cityLanding,
    });
  }

  const breadcrumbs = [{ name: "Acasa", path: "/" }];
  if (firma.judetSlug && firma.judet) {
    breadcrumbs.push({
      name: firma.judet,
      path: `/judet/${firma.judetSlug}`,
    });
  }
  if (cityLanding && firma.localitate) {
    breadcrumbs.push({
      name: firma.localitate,
      path: cityLanding,
    });
  }
  if (firma?.siteName) {
    breadcrumbs.push({ name: firma.siteName, path: pagePath });
  }

  return (
    <>
      <JsonLd data={localBusinessLd} />
      <BreadcrumbsJsonLd items={breadcrumbs} />
      <SliderStyle
        params={params.slug}
        judete={judete}
        categorii={categorii}
        localitati={localitati}
        firme={[firma]}
        renderMode="detail"
        h1Title={firma.siteName}
        internalLinks={hierarchyLinks}
      />
    </>
  );
};

export default Page;

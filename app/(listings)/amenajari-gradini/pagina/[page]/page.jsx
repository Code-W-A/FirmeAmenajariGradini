import { notFound, permanentRedirect } from "next/navigation";
import { canonicalUrl } from "@/utils/siteUrl";
import { DEFAULT_OG_IMAGE } from "@/utils/seoDefaults";
import { pageTitle } from "@/utils/seoTitle";
import { companyListPath, companyPageCount } from "@/utils/companyList";
import { getPublishedCompanyCount } from "@/lib/sanity/queries";
import {
  NationalListing,
  loadNationalListing,
} from "@/components/listings/NationalListing";

export const revalidate = 60;

function pageNumber(value) {
  if (!/^[1-9]\d*$/.test(String(value || ""))) return null;
  return Number(value);
}

export async function generateMetadata({ params }) {
  const page = pageNumber(params.page);
  const path = companyListPath(page || 2);
  const title = `Firme de amenajari gradini, pagina ${page || ""}`.trim();
  const description =
    "Continuarea listei nationale de firme de amenajari gradini si spatii verzi.";

  return {
    title: pageTitle(title),
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl(path),
      images: [DEFAULT_OG_IMAGE],
    },
    alternates: { canonical: canonicalUrl(path) },
  };
}

export default async function PaginatedNationalListing({ params }) {
  const page = pageNumber(params.page);
  if (!page) notFound();
  if (page === 1) permanentRedirect("/amenajari-gradini");

  const total = await getPublishedCompanyCount();
  const pageCount = companyPageCount(total);
  if (page > pageCount) notFound();

  const data = await loadNationalListing({ page });

  return (
    <NationalListing
      data={{ ...data, pageCount }}
      page={page}
      path={companyListPath(page)}
      h1Title={`Firme de proiectare, amenajare si intretinere spatii verzi in Romania, pagina ${page}`}
    />
  );
}

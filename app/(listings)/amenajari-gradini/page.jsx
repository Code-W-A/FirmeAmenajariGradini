import { canonicalUrl } from "@/utils/siteUrl";
import { DEFAULT_OG_IMAGE } from "@/utils/seoDefaults";
import { pageTitle } from "@/utils/seoTitle";
import { companyListPath } from "@/utils/companyList";
import {
  NationalListing,
  loadNationalListing,
} from "@/components/listings/NationalListing";

const metadata = {
  title: pageTitle("Firme de proiectare, amenajare si intretinere spatii verzi"),
  description:
    "Cauti un partener de incredere pentru gradina ta rezidentiala sau comerciala? Vezi firmele de amenajari spatii verzi din toata Romania.",
  openGraph: {
    title: "Firme de proiectare, amenajare si intretinere spatii verzi",
    description:
      "Cauti un partener de incredere pentru gradina ta rezidentiala sau comerciala? Vezi firmele de amenajari spatii verzi din toata Romania.",
    url: canonicalUrl("/amenajari-gradini"),
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: {
    canonical: canonicalUrl("/amenajari-gradini"),
  },
};

export function generateMetadata({ searchParams }) {
  if (searchParams?.slug) {
    return { ...metadata, robots: { index: false, follow: true } };
  }
  return metadata;
}

export const revalidate = 60;

const index = async ({ searchParams }) => {
  const searchKey = searchParams?.slug || "";
  const data = await loadNationalListing({ page: 1, searchKey });

  return (
    <NationalListing
      data={searchKey ? { ...data, pageCount: 1 } : data}
      page={1}
      path={companyListPath(1)}
    />
  );
};

export default index;

import CountyDirectory from "./CountyDirectory";
import SliderStyle from "@/components/listing-style/slider-style";
import CompanyPagination from "@/components/common/listing/CompanyPagination";
import { filtrareOferte } from "@/utils/commonUtils";
import JsonLd, { BreadcrumbsJsonLd } from "@/components/common/JsonLd";
import { buildItemListLd } from "@/utils/schemaOrg";
import { canonicalUrl } from "@/utils/siteUrl";
import {
  COMPANY_PAGE_SIZE,
  companyPageCount,
} from "@/utils/companyList";
import {
  getCounties,
  getCities,
  getPublishedCompanies,
  getPublishedCompaniesPage,
  getPublishedCompanyCount,
  getServiceCategories,
} from "@/lib/sanity/queries";

export const NATIONAL_LISTING_H1 =
  "Firme de proiectare, amenajare si intretinere spatii verzi in Romania";

const DESCRIPTION =
  "Cauti un partener de incredere pentru gradina ta rezidentiala sau comerciala? Vezi firmele de amenajari spatii verzi din toata Romania.";

export async function loadNationalListing({ page = 1, searchKey } = {}) {
  const [judete, categorii, localitati, total] = await Promise.all([
    getCounties(),
    getServiceCategories(),
    getCities(),
    getPublishedCompanyCount(),
  ]);
  const pageCount = companyPageCount(total);
  const firme = searchKey
    ? await filtrareOferte(
        await getPublishedCompanies({ limit: 10000 }),
        searchKey
      )
    : await getPublishedCompaniesPage({ page, pageSize: COMPANY_PAGE_SIZE });

  return { judete, categorii, localitati, firme, pageCount, total };
}

export function NationalListing({
  data,
  page = 1,
  path = "/amenajari-gradini",
  h1Title = NATIONAL_LISTING_H1,
}) {
  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: h1Title,
    description: DESCRIPTION,
    url: canonicalUrl(path),
  };

  return (
    <>
      <JsonLd data={webPageLd} />
      <JsonLd data={buildItemListLd(data.firme)} />
      <BreadcrumbsJsonLd
        items={[
          { name: "Acasa", path: "/" },
          { name: "Amenajari gradini", path: "/amenajari-gradini" },
          ...(page > 1 ? [{ name: `Pagina ${page}`, path }] : []),
        ]}
      />
      <SliderStyle
        judete={data.judete}
        categorii={data.categorii}
        localitati={data.localitati}
        firme={data.firme}
        renderMode="listing"
        relatedNavigation={page === 1 ? <CountyDirectory counties={data.judete} /> : null}
        h1Title={h1Title}
        pagination={
          <CompanyPagination page={page} pageCount={data.pageCount} />
        }
      />
    </>
  );
}

import { BreadcrumbsJsonLd } from "@/components/common/JsonLd";
import LegalPageFallback from "@/components/sanity/LegalPageFallback";
import StaticPageContent from "@/components/sanity/StaticPageContent";
import { getStaticPageBySlug } from "@/lib/sanity/queries";
import { getStaticPageMetadata } from "@/lib/sanity/staticPage";

const fallbackMetadata = {
  title: "Termeni si conditii",
  description:
    "Termenii si conditiile de utilizare a portalului FirmeAmenajariGradina.ro.",
};

export async function generateMetadata() {
  return getStaticPageMetadata("terms", fallbackMetadata);
}

const index = async () => {
  const page = await getStaticPageBySlug("terms");
  return (
    <>
      <BreadcrumbsJsonLd
        items={[
          { name: "Acasa", path: "/" },
          { name: "Termeni si conditii", path: "/terms" },
        ]}
      />
      {page?.hasBodyText ? <StaticPageContent page={page} /> : <LegalPageFallback title="Termeni și condiții" />}
    </>
  );
};

export default index;

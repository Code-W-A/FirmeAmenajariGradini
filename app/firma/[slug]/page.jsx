import { notFound, permanentRedirect } from "next/navigation";
import { getCompanyBySlug } from "@/lib/sanity/queries";
import { buildCompanyPath } from "@/utils/companyPath";

export const revalidate = 60;

export default async function LegacyFirmaPage({ params }) {
  const firma = await getCompanyBySlug(params.slug);
  if (!firma) {
    notFound();
  }

  const destinationPath = buildCompanyPath(firma);
  if (!destinationPath) {
    notFound();
  }

  permanentRedirect(destinationPath);
}

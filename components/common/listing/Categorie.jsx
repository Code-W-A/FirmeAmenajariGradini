import Link from "next/link";
import { findLandingPath } from "@/utils/searchDestination";

const Categorie = ({ localitati, countySlug, landingRoutes = [] }) => {
  return (
    <>
      {localitati
        ? localitati.map((localitate, index) => (
            <li key={index}>
              <Link
                href={
                  findLandingPath(landingRoutes, {
                    citySlug: localitate.slug,
                  }) ||
                  (countySlug ? `/judet/${countySlug}` : "/amenajari-gradini")
                }
              >
                <i className="fa fa-caret-right mr10"></i>
                {localitate.siteName}
              </Link>
            </li>
          ))
        : null}
    </>
  );
};

export default Categorie;

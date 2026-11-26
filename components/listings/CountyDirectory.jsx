import Link from "next/link";
import { isIndexablePage } from "@/utils/seoIndexing";

export default function CountyDirectory({ counties }) {
  const links = counties.filter(
    ({ slug, name, seo }) => slug && name && isIndexablePage(`/judet/${slug}`, seo)
  );
  if (links.length === 0) return null;

  return (
    <section className="container py-4" aria-labelledby="county-directory">
      <h2 id="county-directory">Firme de amenajări grădini pe județe</h2>
      <ul className="row row-cols-2 row-cols-md-3 row-cols-lg-4 ps-0 list-unstyled">
        {links.map(({ slug, name }) => (
          <li key={slug} className="col mb-2">
            <Link href={`/judet/${slug}`} prefetch={false}>{name}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

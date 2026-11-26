import Link from "next/link";

export default function InternalLinksSection({ title = "Pagini utile", links = [] }) {
  if (!Array.isArray(links) || links.length === 0) return null;

  return (
    <section className="blog_post_container bgc-f7 pt0 pb30">
      <div className="container">
        <div className="row">
          <div className="col-lg-10 offset-lg-1">
            <h2>{title}</h2>
            <ul>
              {links.map((link) => (
                <li key={link.path}>
                  <Link href={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

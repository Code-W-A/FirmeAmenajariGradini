import RelatedPost from "@/components/blog-details/RelatedPost";
import Footer from "@/components/common/footer/Footer";
import Social from "@/components/common/footer/Social";
import Header from "@/components/common/header/DefaultHeader";
import MobileMenu from "@/components/common/header/MobileMenu";
import Image from "next/image";
import JsonLd, { BreadcrumbsJsonLd } from "@/components/common/JsonLd";
import { buildArticleLd } from "@/utils/schemaOrg";
import {
  getArticleBySlug,
  getArticleSlugs,
  getArticles,
  getRelatedCompaniesForArticle,
  getRelatedLandingPagesForArticle,
} from "@/lib/sanity/queries";
import PortableContent from "@/components/sanity/PortableContent";
import { notFound } from "next/navigation";
import { seoCanonical } from "@/utils/seoIndexing";
import { DEFAULT_OG_IMAGE } from "@/utils/seoDefaults";
import { pageTitle } from "@/utils/seoTitle";
import { parseDateToISO } from "@/utils/timeUtils";
import InternalLinksSection from "@/components/common/InternalLinksSection";
import {
  createInternalLinks,
  linksFromCompanies,
  linksFromLandingPages,
} from "@/utils/internalLinks";

export const revalidate = 60; // revalidate at most every minute , hour at 3600

const FALLBACK_IMAGE = "/assets/categorii/amenajari-gradini-si-spatii-verzi.svg";

export async function generateStaticParams() {
  return await getArticleSlugs();
}

export async function generateMetadata({ params }) {
  const blog = await getArticleBySlug(params.id);

  const title = blog?.metaTitle || blog?.siteName || "Articol blog";
  const description =
    blog?.metaDescription ||
    "Articole si ghiduri despre amenajari gradini si spatii verzi.";
  const image = blog?.image;
  const canonical = seoCanonical(`/blog/${params.id}`, blog?.seo);
  const publishedTime = parseDateToISO(blog?.publishedAt || blog?.firstUploadDate);
  const modifiedTime = parseDateToISO(blog?._updatedAt || blog?.lastUpdateDate);

  return {
    title: pageTitle(title),
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: canonical,
      publishedTime: publishedTime || undefined,
      modifiedTime: modifiedTime || undefined,
      authors: [blog?.author || "FirmeAmenajariGradina.ro"],
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
    alternates: {
      canonical,
    },
    authors: [{ name: blog?.author || "FirmeAmenajariGradina.ro" }],
    robots: blog?.seo?.noIndex ? { index: false, follow: true } : undefined,
  };
}

const BlogDetailsDynamic = async ({ params }) => {
  const blog = await getArticleBySlug(params.id);
  if (!blog) {
    notFound();
  }
  const [articole, landingPages, relatedCompanies] = await Promise.all([
    getArticles({ limit: 6 }),
    getRelatedLandingPagesForArticle(blog, { limit: 4 }),
    getRelatedCompaniesForArticle(blog, { limit: 4 }),
  ]);
  const articleLd = buildArticleLd(blog, null, seoCanonical(`/blog/${params.id}`, blog.seo));
  const internalLinks = createInternalLinks(
    [
      linksFromLandingPages(landingPages, 4),
      linksFromCompanies(relatedCompanies, 4),
    ],
    `/blog/${params.id}`
  );

  return (
    <>
      <JsonLd data={articleLd} />
      <BreadcrumbsJsonLd
        items={[
          { name: "Acasa", path: "/" },
          { name: "Blog", path: "/blog" },
          {
            name: blog?.siteName || "Articol",
            path: `/blog/${params.id}`,
          },
        ]}
      />

      {/* <!-- Main Header Nav --> */}
      <Header />

      {/* <!--  Mobile Menu --> */}
      <MobileMenu />

      {/* <!-- Main Blog Post Content --> */}
      <section className="blog_post_container bgc-f7">
        <div className="container">
          {/* <div className="row">
            <div className="col-xl-6">
              <BreadCrumb2 />
            </div>
          </div> */}
          {/* End .row */}

          <div className="row">
            <div className="col-lg-12">
              <div className="main_blog_post_content">
                <div className="mbp_thumb_post">
                  <h1 className="blog_sp_title">{blog?.siteName}</h1>
                  <ul className="blog_sp_post_meta">
                    <li className="list-inline-item">
                      <span className="flaticon-calendar"></span>
                    </li>
                    <li className="list-inline-item">
                      <span>{blog?.firstUploadDate}</span>
                    </li>
                  </ul>
                  <div className="thumb">
                    <Image
                      width={692}
                      height={414}
                      className="w-100 h-100 cover"
                      src={blog?.image?.finalUri || FALLBACK_IMAGE}
                      alt={blog?.image?.alt || blog?.siteName || "Articol blog"}
                      priority
                    />
                  </div>

                  <div className="details">
                    <PortableContent value={blog?.content} className="mb25" />
                  </div>
                  <ul className="blog_post_share">
                    <li>
                      <p>Distribuire</p>
                    </li>
                    <Social />
                  </ul>
                  {/* End .blog_post_share */}
                </div>
                {/* End .mbp_thumb_post */}

              </div>
              {/* End .main_blog_post_content */}

              <InternalLinksSection
                title="Pagini si firme recomandate"
                links={internalLinks}
              />

              <div className="row">
                <div className="col-lg-12 mb20 mt20">
                  <h2>Alte articole</h2>
                </div>
                <RelatedPost articole={articole} />
              </div>
            </div>
            {/* End .col */}

          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>

      {/* <!-- Our Footer --> */}
      <section className="footer_one">
        <div className="container">
          <div className="row">
            <Footer />
          </div>
        </div>
      </section>

    </>
  );
};

export default BlogDetailsDynamic;

import ListSearch from "@/components/common/ListSearch";
import CopyrightFooter from "../../common/footer/CopyrightFooter";
import Footer from "../../common/footer/Footer";
import GlobalHeroFilter from "../../common/GlobalHeroFilter";
import Header from "../../common/header/DefaultHeader";
import MobileMenu from "../../common/header/MobileMenu";

import FilterTopBar from "../../common/listing/FilterTopBar";
import GridListButton from "../../common/listing/GridListButton";
import ShowFilter from "../../common/listing/ShowFilter";
import SidebarListing3 from "../../common/listing/SidebarListing3";
import BreadCrumbBanner from "./BreadCrumbBanner";
import FeaturedItem from "./FeaturedItem";
import HeroSlider from "./HeroSlider";
import Partners from "@/components/common/Partners";
import Image from "next/image";
import Button from "@/components/common/CommonButton";
import CallToAction from "@/components/common/CallToAction";
import BreadCrumb from "@/components/common/BreadCrumb";
import PortableContent from "@/components/sanity/PortableContent";
import InternalLinksSection from "@/components/common/InternalLinksSection";

import { notFound } from "next/navigation";

const index = async ({
  params,
  categorii,
  localitati,
  firme,
  judete,
  searchParams,
  h1Title,
  landingPage,
  internalLinks = [],
  renderMode, // "home" | "listing" | "detail" (defaults by params presence)
  landingRoutes = [],
  pagination = null,
  relatedNavigation = null,
}) => {
  const pageH1 =
    h1Title ||
    "Firme de proiectare, amenajare si intretinere spatii verzi";
  const mode = renderMode || (typeof params === "string" ? "detail" : "home");
  const hideHero = mode !== "home";
  // if (!data.firme) {
  //   notFound();
  // }

  return (
    <>
      {/* <!-- Main Header Nav --> */}
      <Header />

      {/* <!--  Mobile Menu --> */}
      <MobileMenu />

      {hideHero && mode !== "detail" && <BreadCrumbBanner title={pageH1} />}

      {/* <!-- 6th Home Design --> */}
      {!hideHero && (
        <section className="home-listing-slider hight-fx p0">
          <div className="container-fluid p0">
            <div className="row">
              <div className="col-lg-12">
                <div className="main-banner-wrapper">
                  <div className="banner-style-one arrow-style-2">
                    <HeroSlider />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container home_iconbox_container listing-slider-style">
            <div className="row posr">
              <div className="col-lg-12">
                <div className="home_content listing slider_style pt30">
                  <BreadCrumb csName={"color-white"} />
                  <div className="home-text home6 text-center">
                    <h1 className="fz40 color-white">{pageH1}</h1>
                  </div>
                  {/* End home-text */}
                  <ListSearch
                    className="mt40"
                    judete={judete}
                    categorii={categorii}
                    localitati={localitati}
                    landingRoutes={landingRoutes}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* End container */}
        </section>
      )}

      {landingPage && (
        <section className="blog_post_container bgc-f7 pb30">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 offset-lg-1">
                {landingPage.intro && (
                  <p className="fz18 txt-color-third">{landingPage.intro}</p>
                )}
                <PortableContent value={landingPage.content} />
                {Array.isArray(landingPage.faq) && landingPage.faq.length > 0 && (
                  <div className="mt30">
                    <h2>Intrebari frecvente</h2>
                    {landingPage.faq.map((item) => (
                      <div key={item._key || item.question} className="mb15">
                        <h3 className="fz20">{item.question}</h3>
                        <p>{item.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {landingPage && (
        <InternalLinksSection title="Pagini utile" links={internalLinks} />
      )}

      {/* <!-- Listing Grid View --> */}
      <section className="our-listing bgc-primary pb60-991 md-mt0 categorii-container-section">
        <div className="container">
          <div className="row pt30">
            <div className="col-md-12 col-lg-12">
              <div className="row">
                <FeaturedItem
                  params={params}
                  firme={firme}
                  searchParams={searchParams}
                  renderMode={mode}
                />
              </div>
              {/* End .row */}

              {pagination ? (
                <div className="row">
                  <div className="col-lg-12 mt20">
                    <div className="mbp_pagination">{pagination}</div>
                  </div>
                </div>
              ) : null}

              {/* End .row */}
            </div>
            {/* End  .col */}
          </div>
          {/* End .row */}
        </div>
      </section>

      {!landingPage && internalLinks?.length > 0 && (
        <InternalLinksSection title="Pagini utile" links={internalLinks} />
      )}

      {/* <!-- Start Call to Action --> */}

      {relatedNavigation}
      <CallToAction />

      {/* <!-- Our Footer --> */}
      <section className="footer_one">
        <div className="container">
          <div className="row">
            <Footer />
          </div>
        </div>
      </section>

      {/* <!-- Our Footer Bottom Area --> */}
      {/* <section className="footer_middle_area pt40 pb40">
        <div className="container">
          <CopyrightFooter />
        </div>
      </section> */}
    </>
  );
};

export default index;

"use client";

import { usePathname } from "next/navigation";
import BreadCrumb from "../common/BreadCrumb";
import { formatPathname } from "@/utils/commonUtils";

const BreadCrumbBanner = ({ hasEditorialHeading }) => {
  const Heading = hasEditorialHeading ? "p" : "h1";
  const pathname = usePathname();
  const formattedPathname = formatPathname(pathname);
  return (
    <section className="inner_page_breadcrumb py-3">
      <div className="container">
        <div className="row">
          <div className="col-xl-6">
            <div className="breadcrumb_content">
              <BreadCrumb
                csName={"color-white"}
                title="Acasă"
                subTitle={
                  Array.isArray(formattedPathname)
                    ? formattedPathname.join(" > ")
                    : formattedPathname
                }
              />
              <Heading className="breadcrumb_title color-white">Înscrie-ți firma</Heading>
            </div>
          </div>
          {/* End .col */}
        </div>
      </div>
    </section>
  );
};

export default BreadCrumbBanner;

import Link from "next/link";
import properties from "../../data/properties";
import Image from "next/image";

const HotProperties = () => {
  return (
    <>
      <div className="col-md-6 col-lg-4">
        <div className="item">
          <div className="feat_property home7 style2">
            <div className="thumb">
              <Image
                width={364}
                height={220}
                className="img-whp w-100 h-100 cover"
                src="/assets/images/property/fp16.jpg"
                alt="fp1.jpg"
              />
              <div className="thmb_cntnt">
                <ul className="tag mb0">
                  {["Featured", "For Rent"].map((val, i) => (
                    <li className="list-inline-item" key={i}>
                      <span>{val}</span>
                    </li>
                  ))}
                </ul>
                <ul className="icon mb0">
                  <li className="list-inline-item">
                    <span>
                      <span className="flaticon-transfer-1"></span>
                    </span>
                  </li>
                  <li className="list-inline-item">
                    <span>
                      <span className="flaticon-heart"></span>
                    </span>
                  </li>
                </ul>
                <span className="fp_price">
                  $2313231
                  <small>/mo</small>
                </span>
              </div>
            </div>
            <div className="details">
              <div className="tc_content">
                <p className="text-thm">tip</p>
                <h4>
                  <Link href={`/listing-details-v2/5`}>Titlu</Link>
                </h4>
                <p>
                  <span className="flaticon-placeholder"></span>
                  Locatie
                </p>

                <ul className="prop_details mb0">
                  {[
                    {
                      name: "Beds",
                      number: "4",
                    },
                    {
                      name: "Baths",
                      number: "4",
                    },
                    {
                      name: "SqFt",
                      number: "6280",
                    },
                  ].map((val, i) => (
                    <li className="list-inline-item" key={i}>
                      <span>
                        {val.name}: {val.number}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HotProperties;

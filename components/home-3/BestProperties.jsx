import Link from "next/link";
import properties from "../../data/properties";
import Image from "next/image";

const BestProperties = () => {
  return (
    <>
      {properties.slice(12, 15).map((item) => (
        <div className="col-sm-6 col-lg-4" key={item.id}>
          <div className="item">
            <div className="feat_property home3">
              <div className="thumb">
                <Image
                  width={461}
                  height={276}
                  priority
                  className="img-whp"
                  src={item.img}
                  alt="fp1.jpg"
                />
                <div className="thmb_cntnt">
                  <ul className="tag mb0">
                    {item.saleTag.map((val, i) => (
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

                  <Link
                    href={`/listing-details-v1/${item.id}`}
                    className="fp_price"
                  >
                    ${item.price}
                    <small>/mo</small>
                  </Link>
                </div>
              </div>

              <div className="details">
                <div className="tc_content">
                  <p className="text-thm">{item.type}</p>
                  <h4>
                    <Link href={`/listing-details-v1/${item.id}`}>
                      {item.title}
                    </Link>
                  </h4>
                  <p>
                    <span className="flaticon-placeholder"></span>
                    {item.location}
                  </p>

                  <ul className="prop_details mb0">
                    {item.itemDetails.map((val, i) => (
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
      ))}
    </>
  );
};

export default BestProperties;

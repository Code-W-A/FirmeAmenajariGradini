import Link from "next/link";
import properties from "../../data/properties";
import Image from "next/image";

const FeaturedProperties = () => {
  return (
    <>
      {properties.slice(21, 27).map((item) => (
        <div className="col-md-6 col-lg-4" key={item.id}>
          <div className="item">
            <div className="feat_property">
              <div className="thumb">
                <Image
                  width={343}
                  height={220}
                  className="img-whp w-100 h-100 cover"
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
                <div className="fp_footer">
                  <ul className="fp_meta float-start mb0">
                    <li className="list-inline-item">
                      <Link href="/agent-v2">
                        <Image
                          width={40}
                          height={40}
                          src={item.posterAvatar}
                          alt="pposter1.png"
                        />
                      </Link>
                    </li>
                    <li className="list-inline-item">
                      <Link href="/agent-v2">{item.posterName}</Link>
                    </li>
                  </ul>
                  <div className="fp_pdate float-end">{item.postedYear}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FeaturedProperties;

import Image from "next/image";
import comparePricingContent from "../../data/comparePricing";

const ComparePricing = () => {
  return (
    <>
      {comparePricingContent.map((item) => (
        <li className="list-inline-item" key={item.id}>
          <ul className="mc_child_list two text-center">
            <li>
              <div className="membership_header">
                <div className="thumb">
                  <span>
                    <span className="flaticon-close"></span>
                  </span>
                  <Image
                    width={260}
                    height={180}
                    className="img-fluid w100 h-100 cover"
                    src={item.img}
                    alt="1.jpg"
                  />
                  <div className="price">
                    ${item.price}
                    <span className="mnth">/mo</span>
                  </div>
                </div>
                <div className="details">
                  <h4>{item.propertyName}</h4>
                  <p>{item.propertyType}</p>
                </div>
              </div>
            </li>
            <li>
              <span>{item.city}</span>
            </li>
            <li>
              <span>{item.beds}</span>
            </li>
            <li>
              <span>{item.rooms}</span>
            </li>
            <li>
              <span>{item.garage}</span>
            </li>
            <li>
              <span>{item.buildYear}</span>
            </li>
            <li>
              <span>{item.laundryRoom}</span>
            </li>
            <li>
              <span className="btn pricing_btn">
                {item.status}
              </span>
            </li>
          </ul>
        </li>
      ))}
    </>
  );
};

export default ComparePricing;

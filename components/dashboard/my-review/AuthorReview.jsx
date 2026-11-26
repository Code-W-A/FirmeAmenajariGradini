import Image from "next/image";
import Link from "next/link";

const AuthorReview = () => {
  const reviewContent = [
    {
      id: 1,
      img: "/assets/images/resource/review.png",
      ratings: (
        <>
          {" "}
          <ul>
            <li className="list-inline-item">
              <span>
                <i className="fa fa-star"></i>
              </span>
            </li>
            <li className="list-inline-item">
              <span>
                <i className="fa fa-star"></i>
              </span>
            </li>
            <li className="list-inline-item">
              <span>
                <i className="fa fa-star"></i>
              </span>
            </li>
            <li className="list-inline-item">
              <span>
                <i className="fa fa-star"></i>
              </span>
            </li>
            <li className="list-inline-item">
              <span>
                <i className="fa fa-star"></i>
              </span>
            </li>
          </ul>
        </>
      ),
      reviewOn: "Villa called Archangel",
      text: `Beautiful home, very picturesque and close to everything in jtree! A
      little warm for a hot weekend, but would love to come back during
      the cooler seasons! Lorem ipsum dolor sit amet, consectetur
      adipisicing elit. Accusantium voluptates eum, velit recusandae,
      ducimus earum aperiam commodi error officia optio aut et quae nam
      nostrum!`,
    },
    {
      id: 2,
      img: "/assets/images/resource/review4.png",
      ratings: (
        <>
          {" "}
          <ul>
            <li className="list-inline-item">
              <span>
                <i className="fa fa-star"></i>
              </span>
            </li>
            <li className="list-inline-item">
              <span>
                <i className="fa fa-star"></i>
              </span>
            </li>
            <li className="list-inline-item">
              <span>
                <i className="fa fa-star"></i>
              </span>
            </li>
            <li className="list-inline-item">
              <span>
                <i className="fa fa-star"></i>
              </span>
            </li>
            <li className="list-inline-item">
              <span>
                <i className="fa fa-star"></i>
              </span>
            </li>
          </ul>
        </>
      ),
      reviewOn: "Sunset Studio",
      text: `Beautiful home, very picturesque and close to everything in jtree! A
      little warm for a hot weekend, but would love to come back during
      the cooler seasons! Lorem ipsum dolor sit amet, consectetur
      adipisicing elit. Accusantium voluptates eum, velit recusandae,
      ducimus earum aperiam commodi error officia optio aut et quae nam
      nostrum!`,
    },
  ];
  return (
    <>
      {reviewContent.map((item) => (
        <div className="media mt30" key={item.id}>
          <Image
            width={120}
            height={120}
            className="mr-3"
            src={item.img}
            alt="Review image"
          />
          <div className="media-body">
            <h5 className="review_title mt-0">
              Your review on{" "}
              <Link href="/agentie/1">
                <span className="text-thm">{item.reviewOn}</span>
              </Link>
              <span className="sspd_review float-end">{item.ratings}</span>
            </h5>
            <span className="review_date">
              December 28, 2020
            </span>
            <p className="para">{item.text}</p>

            <ul className="view_edit_delete_list mb0 mt35">
              <li
                className="list-inline-item"
                data-toggle="tooltip"
                data-placement="top"
                title="Edit"
              >
                <span>
                  <span className="flaticon-edit"></span>
                </span>
              </li>
              {/* End edit */}

              <li
                className="list-inline-item"
                data-toggle="tooltip"
                data-placement="top"
                title="Delete"
              >
                <span>
                  <span className="flaticon-garbage"></span>
                </span>
              </li>
              {/* End delete */}
            </ul>
          </div>
        </div>
      ))}
    </>
  );
};

export default AuthorReview;

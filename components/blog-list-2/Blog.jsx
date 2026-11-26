import Link from "next/link";
import blogContent from "../../data/blogs";
import Image from "next/image";

const Blog = () => {
  return (
    <>
      {blogContent.slice(0, 6).map((item) => (
        <div className="col-lg-6" key={item.id}>
          <div className="for_blog feat_property">
            <div className="thumb">
              <Link href={`/blog/${item.id}`}>
                <Image
                  width={343}
                  height={220}
                  className="img-whp w-100 cover"
                  src={item.img}
                  alt={item.img}
                />
              </Link>
              <div className="blog_tag">{item.postMeta}</div>
            </div>
            {/* End .thumb */}

            <div className="details">
              <div className="tc_content">
                <h4 className="mb15">
                  <Link href={`/blog/${item.id}`}>{item.title}</Link>
                </h4>
                <ul className="bpg_meta mb10">
                  <li className="list-inline-item">
                    <span>
                      <i className="flaticon-calendar"></i>
                    </span>
                  </li>
                  <li className="list-inline-item">
                    <span>{item.postedDate}</span>
                  </li>
                </ul>
                <p>{item.postDescriptions.slice(0, 65)}</p>
              </div>
              {/* End .tc_content */}

              <div className="fp_footer">
                <ul className="fp_meta float-start mb0">
                  <li className="list-inline-item">
                    <span>
                      <Image
                        width={40}
                        height={40}
                        src={item.posterAvatar}
                        alt={item.posterAvatar}
                      />
                    </span>
                  </li>
                  <li className="list-inline-item">
                    <span>{item.posterName}</span>
                  </li>
                </ul>
                <span className="fp_pdate float-end text-thm">
                  Read More <span className="flaticon-next"></span>
                </span>
              </div>
              {/* End fb_footer */}
            </div>
            {/* End .thumb */}
          </div>
        </div>
      ))}
    </>
  );
};

export default Blog;

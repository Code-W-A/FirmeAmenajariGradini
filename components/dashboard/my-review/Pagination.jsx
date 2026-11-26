const Pagination = () => {
  return (
    <ul className="page_navigation">
      <li className="page-item disabled">
        <span className="page-link" tabIndex="-1" aria-disabled="true">
          {" "}
          <span className="flaticon-left-arrow"></span>
        </span>
      </li>
      <li className="page-item">
        <span className="page-link">
          1
        </span>
      </li>
      <li className="page-item active" aria-current="page">
        <span className="page-link">
          2 <span className="sr-only">(current)</span>
        </span>
      </li>
      <li className="page-item">
        <span className="page-link">
          3
        </span>
      </li>
      <li className="page-item">
        <span className="page-link">
          ...
        </span>
      </li>
      <li className="page-item">
        <span className="page-link">
          29
        </span>
      </li>
      <li className="page-item">
        <span className="page-link">
          <span className="flaticon-right-arrow"></span>
        </span>
      </li>
    </ul>
  );
};

export default Pagination;

import Link from "next/link";
import { companyListPath } from "@/utils/companyList";

function pageNumbers(page, pageCount) {
  const numbers = new Set([1, pageCount, page - 1, page, page + 1]);
  return [...numbers]
    .filter((number) => number >= 1 && number <= pageCount)
    .sort((left, right) => left - right);
}

const CompanyPagination = ({ page, pageCount }) => {
  if (!pageCount || pageCount <= 1) return null;

  const numbers = pageNumbers(page, pageCount);

  return (
    <nav aria-label="Pagini cu firme">
      <ul className="page_navigation">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          {page === 1 ? (
            <span className="page-link">Inapoi</span>
          ) : (
            <Link className="page-link" href={companyListPath(page - 1)}>
              Inapoi
            </Link>
          )}
        </li>
        {numbers.map((number, index) => {
          const previous = numbers[index - 1];
          const gap = previous && number - previous > 1;
          return (
            <li
              key={number}
              className={`page-item ${number === page ? "active" : ""}`}
            >
              {gap ? <span className="page-link">…</span> : null}
              {number === page ? (
                <span className="page-link" aria-current="page">
                  {number}
                </span>
              ) : (
                <Link className="page-link" href={companyListPath(number)}>
                  {number}
                </Link>
              )}
            </li>
          );
        })}
        <li className={`page-item ${page === pageCount ? "disabled" : ""}`}>
          {page === pageCount ? (
            <span className="page-link">Inainte</span>
          ) : (
            <Link className="page-link" href={companyListPath(page + 1)}>
              Inainte
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default CompanyPagination;

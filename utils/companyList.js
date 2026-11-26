export const COMPANY_PAGE_SIZE = 48;

export function companyPageCount(total) {
  const count = Number(total) || 0;
  if (count <= 0) return 1;
  return Math.ceil(count / COMPANY_PAGE_SIZE);
}

export function companyListPath(page) {
  const number = Number(page) || 1;
  if (number <= 1) return "/amenajari-gradini";
  return `/amenajari-gradini/pagina/${number}`;
}

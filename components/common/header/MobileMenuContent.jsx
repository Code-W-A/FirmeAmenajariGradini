"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Acasa", href: "/" },
  { label: "Cauta firma", href: "/cauta" },
  { label: "Amenajari Gradini", href: "/amenajari-gradini" },
  { label: "Contact", href: "/contact" },
];

const MobileMenuContent = ({ onNavigate = () => {} }) => {
  const pathname = usePathname();

  return (
    <>
      <div className="sidebar-header">
        <Link href="/" className="sidebar-header-inner" onClick={onNavigate}>
          <span className="brand-text">Portal</span>
        </Link>

        <button
          type="button"
          className="fix-icon border-0 bg-transparent p-0"
          aria-label="Inchide meniul"
          onClick={onNavigate}
        >
          <span className="flaticon-close"></span>
        </button>
      </div>

      <nav
        aria-label="Meniu mobil"
        style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}
      >
        <ul className="list-unstyled mb0">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={
                  pathname === item.href ? "ui-active" : "inactive-mobile-menu"
                }
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Link
        href="/inscrie-firma"
        className="btn btn-block btn-lg btn-thm circle inscrie-clinica-link"
        onClick={onNavigate}
      >
        <span className="flaticon-plus"></span> Adauga firma
      </Link>
    </>
  );
};

export default MobileMenuContent;

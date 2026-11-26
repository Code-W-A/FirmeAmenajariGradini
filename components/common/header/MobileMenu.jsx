"use client";

import { useState } from "react";
import MobileMenuContent from "./MobileMenuContent";
import Image from "next/image";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // <!-- Main Header Nav For Mobile -->
    <header>
      <div className="stylehome1 h0 mega-menu-wrapper">
        <div className="mobile-menu">
          <div className="header stylehome1">
            <div className="main_logo_home2 text-center">
              <Image
                width={40}
                height={45}
                className="nav_logo_img contain mt20"
                src="/assets/categorii/amenajari-gradini-si-spatii-verzi.svg"
                alt="header-logo2.png"
              />
              {/* <span className="mt20">Portal</span> */}
            </div>
            {/* main_logo_home2 */}

            <ul className="menu_bar_home2">
              <li className="list-inline-item list_s">
                {/* <Link href="/login">
                <span className="flaticon-user"></span>
              </Link> */}
              </li>

              <li
                className="list-inline-item"
              >
                <button
                  type="button"
                  className="border-0 bg-transparent p-0"
                  aria-controls="offcanvasMenu"
                  aria-expanded={isOpen}
                  aria-label="Deschide meniul"
                  onClick={() => setIsOpen(true)}
                >
                  <span></span>
                </button>
              </li>
            </ul>
            {/* menu_bar_home2 */}
          </div>
        </div>
        {/* <!-- /.mobile-menu --> */}

        <div
          className={`offcanvas offcanvas-end${isOpen ? " show" : ""}`}
          tabIndex="-1"
          id="offcanvasMenu"
          aria-labelledby="offcanvasMenuLabel"
          aria-modal={isOpen}
          role="dialog"
          style={{ visibility: isOpen ? "visible" : "hidden" }}
        >
          <MobileMenuContent onNavigate={() => setIsOpen(false)} />
        </div>
        {isOpen && (
          <button
            type="button"
            className="offcanvas-backdrop fade show border-0"
            aria-label="Inchide meniul"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </header>
  );
};

export default MobileMenu;

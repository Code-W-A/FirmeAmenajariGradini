"use client";

import { useEffect, useMemo, useRef } from "react";
import "photoswipe/style.css";
import Image from "next/image";

const FALLBACK_IMAGE = "/assets/categorii/amenajari-gradini-si-spatii-verzi.svg";

function getImageAlt(image, fallbackAlt, index) {
  return (
    image?.alt ||
    (fallbackAlt
      ? `${fallbackAlt}${index > 0 ? ` (${index + 1})` : ""}`
      : "Imagine firma amenajari gradini")
  );
}

const ListingGallery = ({ firma }) => {
  const lightboxRef = useRef(null);
  const images = useMemo(
    () =>
      firma?.imagini?.imgs?.length
        ? firma.imagini.imgs
        : [
            {
              finalUri: FALLBACK_IMAGE,
              alt: `${firma?.siteName || "Firma"} imagine`,
            },
          ],
    [firma]
  );
  const fallbackAlt = [firma?.siteName, firma?.categorie, firma?.localitate]
    .filter(Boolean)
    .join(" - ");
  const firstImg = images[0];
  const firstAlt = getImageAlt(firstImg, fallbackAlt, 0);
  const lightboxItems = useMemo(
    () =>
      images.map((image, index) => ({
        src: image.finalUri,
        width: image.width || 1200,
        height: image.height || 800,
        alt: getImageAlt(image, fallbackAlt, index),
      })),
    [images, fallbackAlt]
  );

  useEffect(() => {
    return () => {
      lightboxRef.current?.destroy();
      lightboxRef.current = null;
    };
  }, []);

  const openLightbox = async (index) => {
    if (!lightboxRef.current) {
      const [{ default: PhotoSwipeLightbox }, { default: PhotoSwipe }] =
        await Promise.all([import("photoswipe/lightbox"), import("photoswipe")]);

      lightboxRef.current = new PhotoSwipeLightbox({
        dataSource: lightboxItems,
        pswpModule: PhotoSwipe,
      });
      lightboxRef.current.init();
    }

    lightboxRef.current.loadAndOpen(index);
  };

  return (
    <div>
      <div className="row">
        <div className="col-sm-7 col-lg-8">
          <div className="row">
            <div className="col-lg-12">
              <div className="spls_style_two mb30-520">
                <button
                  type="button"
                  className="border-0 bg-transparent p-0 w-100 h-100"
                  onClick={() => openLightbox(0)}
                  aria-label="Deschide galeria foto"
                >
                  <Image
                    width={752}
                    height={450}
                    className="img-fluid w100 lds-1 cover h-100"
                    src={images[0].finalUri}
                    alt={firstAlt}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-5 col-lg-4">
          <div className="row">
            {images.map((val, i) => {
              if (i === 0) return null;

              return (
                <div className="col-6" key={val.finalUri || i}>
                  <div className="spls_style_two img-gallery-box mb24">
                    <button
                      type="button"
                      className="border-0 bg-transparent p-0 w-100"
                      onClick={() => openLightbox(i)}
                      aria-label={`Deschide imaginea ${i + 1} din galerie`}
                    >
                      <Image
                        width={170}
                        height={133}
                        className="img-fluid w100 cover"
                        src={val.finalUri}
                        alt={getImageAlt(val, fallbackAlt, i)}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingGallery;

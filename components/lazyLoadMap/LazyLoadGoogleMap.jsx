"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const LazyLoadGoogleMap = ({ firma }) => {
  const [loadMap, setLoadMap] = useState(false);
  const containerRef = useRef(null);
  const lat = firma?.coordonate?.lat;
  const lng = firma?.coordonate?.lng;
  const addressQuery = [firma?.adresa, firma?.localitate, firma?.judet]
    .filter((value) => typeof value === "string" && value.trim().length > 0)
    .join(", ");
  const hasCoordinates = Number.isFinite(Number(lat)) && Number.isFinite(Number(lng));
  const hasAddressFallback = addressQuery.length > 0;
  const hasMapLocation = hasCoordinates || hasAddressFallback;
  const mapSrc = useMemo(() => {
    if (hasCoordinates) {
      return `https://www.google.com/maps?q=${encodeURIComponent(
        `${lat},${lng}`
      )}&z=15&output=embed`;
    }

    if (hasAddressFallback) {
      return `https://www.google.com/maps?q=${encodeURIComponent(
        addressQuery
      )}&z=15&output=embed`;
    }

    return null;
  }, [addressQuery, hasAddressFallback, hasCoordinates, lat, lng]);

  useEffect(() => {
    const mapContainer = containerRef.current;
    if (!mapContainer || !hasMapLocation || loadMap) return undefined;

    if (!("IntersectionObserver" in window)) {
      setLoadMap(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(mapContainer);

    return () => {
      observer.disconnect();
    };
  }, [hasMapLocation, loadMap]);

  return (
    <div ref={containerRef} id="map-container" style={{ height: "500px" }}>
      {loadMap && mapSrc && (
        <iframe
          title="Google Map"
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      )}
    </div>
  );
};

export default LazyLoadGoogleMap;

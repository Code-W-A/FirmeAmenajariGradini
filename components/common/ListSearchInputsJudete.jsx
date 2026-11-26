"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buildSearchPath } from "@/utils/searchDestination";

const ListSearchInputs = ({
  className = "",
  localitati = [],
  countySlug,
  landingRoutes = [],
}) => {
  const [locations, setLocations] = useState([...localitati]); // State pentru opțiunile din dropdown
  const [selectedLocation, setSelectedLocation] = useState("");
  const [firmName, setFirmName] = useState("");
  const [isSubmittedWithoutLocation, setIsSubmittedWithoutLocation] =
    useState(false);
  const [selectedJudet, setSelectedJudet] = useState("");
  const [selectedLocalitate, setSelectedLocalitate] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("");

  const [isJudetSelected, setIsJudetSelected] = useState(true);
  const [isLocalitateSelected, setIsLocalitateSelected] = useState(true);
  const [isCateogireSelected, setIsCategorieSelected] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const router = useRouter();

  const submitHandler = () => {
    const city = localitati.find((item) => item.siteName === selectedLocalitate);
    router.push(
      buildSearchPath({
        countySlug,
        citySlug: city?.slug,
        searchKey: firmName,
        landings: landingRoutes,
      })
    );
  };

  return (
    <div className={`home1-advnc-search ${className}`}>
      <ul className="h1ads_1st_list mb0">
        <li className="list-inline-item">
          <div className="search_option_two">
            <div className="candidate_revew_select">
              <select
                aria-label="Alege Localitate"
                className={`selectpicker w100 form-select show-tick ${
                  isSubmittedWithoutLocation ? "border-danger" : ""
                }`}
                value={selectedLocalitate}
                onChange={(e) => {
                  setSelectedLocalitate(e.target.value);
                  // if (e.target.value) {
                  //   setIsSubmittedWithoutLocation(false); // Resetăm starea de atenționare la schimbarea selecției
                  // }
                }}
              >
                <option value="">Localitati</option>
                {locations.map((location, index) => (
                  <option key={index} value={location.siteName}>
                    {location.siteName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </li>
        <li className="list-inline-item">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Nume firma..."
              onChange={(e) => setFirmName(e.target.value)}
              value={firmName}
            />
          </div>
        </li>
        <li className="list-inline-item">
          <div className="search_option_button">
            <button
              onClick={submitHandler}
              type="submit"
              className="bgc-accent btn btn-thm"
            >
              Search
            </button>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ListSearchInputs;

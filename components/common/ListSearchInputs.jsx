"use client";

import {
  addKeyword,
  addLocation,
} from "../../features/properties/propertiesSlice";
import PricingRangeSlider from "./PricingRangeSlider";
import CheckBoxFilter from "./CheckBoxFilter";
import GlobalSelectBox from "./GlobalSelectBox";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buildSearchPath } from "@/utils/searchDestination";

const ListSearchInputs = ({
  className = "",
  judete = [],
  categorii = [],
  localitati: allLocalitati = [],
  landingRoutes = [],
}) => {
  const router = useRouter();
  const [selectedJudet, setSelectedJudet] = useState("");
  const [selectedLocalitate, setSelectedLocalitate] = useState("");
  const [selectedCategorie, setSelectedCategorie] = useState("");
  const [localitati, setLocalitati] = useState([]);
  const [isJudetSelected, setIsJudetSelected] = useState(true);
  const [isLocalitateSelected, setIsLocalitateSelected] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const [isCateogireSelected, setIsCategorieSelected] = useState(true);

  // Handler pentru schimbarea selectiei de judete
  const handleJudetChange = async (e) => {
    const judetSelectedName = e.target.value; // Numele județului selectat, un string
    setSelectedJudet(judetSelectedName);
    setSelectedLocalitate("");
    setIsLocalitateSelected(true);
    setIsJudetSelected(!!judetSelectedName);

    // Găsește obiectul județului selectat bazat pe `siteName`
    const judetSelected = judete.find(
      (judet) => judet.siteName === judetSelectedName
    );

    if (judetSelected) {
      const filteredLocalitati = allLocalitati.filter(
        (location) =>
          location.judet === judetSelected.siteName ||
          location.countySlug === judetSelected.slug
      );
      setLocalitati(filteredLocalitati);
    } else {
      // Dacă nu găsim județul selectat, resetăm localitățile
      setLocalitati([]);
    }
  };

  const handleLocalitateChange = (e) => {
// Acesta ar trebui să arate numele localității ca string
    setSelectedLocalitate(e.target.value);
    setIsLocalitateSelected(!!e.target.value);
  };

  // submit handler
  const submitHandler = () => {
    const county = judete.find((item) => item.siteName === selectedJudet);
    const city = localitati.find((item) => item.siteName === selectedLocalitate);
    const category = categorii.find((item) => item.siteName === selectedCategorie);

    router.push(
      buildSearchPath({
        countySlug: county?.slug,
        citySlug: city?.slug,
        categorySlug: category?.slug,
        searchKey,
        landings: landingRoutes,
      })
    );
  };
  return (
    <div className={`home1-advnc-search ${className}`}>
      <ul className="h1ads_1st_list mb0">
        <li className="list-inline-item">
          <div className="search_option_two_suplimentar">
            <div className="candidate_revew_select">
              <select
                aria-label="Alege categorie"
                className={`selectpicker w100 form-select show-tick ${
                  !isJudetSelected ? "border-danger" : ""
                }`}
                onChange={(e) => setSelectedCategorie(e.target.value)}
                value={selectedCategorie}
              >
                <option value="">Alege categorie</option>
                {categorii &&
                  categorii.map((categorie, index) => (
                    <option key={index} value={categorie.siteName}>
                      {categorie.siteName}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </li>
        {/* End li */}
        <li className="list-inline-item">
          <div className="search_option_two">
            <div className="candidate_revew_select">
              <select
                aria-label="Alege judet"
                className={`selectpicker w100 form-select show-tick ${
                  !isJudetSelected ? "border-danger" : ""
                }`}
                onChange={handleJudetChange}
                value={selectedJudet}
              >
                <option value="">Judete</option>
                {judete &&
                  judete.map((judet, index) => (
                    <option key={index} value={judet.siteName}>
                      {judet.siteName}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </li>
        {/* End li */}
        <li className="list-inline-item">
          <div className="search_option_two">
            <div className="candidate_revew_select">
              <select
                aria-label="Alege localitate"
                className={`selectpicker w100 form-select show-tick ${
                  !isLocalitateSelected ? "border-danger" : ""
                }`}
                onChange={handleLocalitateChange}
                value={selectedLocalitate}
                disabled={!selectedJudet}
              >
                <option value="">
                  {selectedJudet
                    ? "Localitati"
                    : "Selecteaza mai intai judetul"}
                </option>
                {localitati.map((location, index) => (
                  <option key={index} value={location.siteName}>
                    {location.siteName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </li>
        {/* End li */}
        <li className="list-inline-item">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Nume firma..."
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>
        </li>
        {/* End li */}

        <li className="list-inline-item">
          <div className="search_option_button">
            <button
              onClick={submitHandler}
              type="submit"
              className="bgc-accent btn btn-thm "
            >
              Cauta
            </button>
          </div>
        </li>
        {/* End li */}
      </ul>
    </div>
  );
};

export default ListSearchInputs;

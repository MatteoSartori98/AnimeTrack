/* eslint-disable react/prop-types */
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import styles from "./filter.module.css";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { animeApi } from "../../services/api";

export default function Filter({ initialSearchQuery, onFilterSubmit, selectedFiltersIds }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [actualSearchQuery, setActualSearchQuery] = useState("");
  const [actualFiltersIds, setActualFiltersIds] = useState([]);
  const dropdownRef = useRef(null);

  const { data: genresData, isError } = useQuery({
    queryKey: ["genres"],
    queryFn: animeApi.getGenres,
  });

  const genres = useMemo(() => genresData?.data || [], [genresData]);

  const getFilterById = useCallback(
    (filterId) => {
      return genres.find((g) => g.mal_id === +filterId);
    },
    [genres]
  );

  const actualFilters = useMemo(() => {
    return actualFiltersIds.map((f) => getFilterById(f)).filter((f) => f !== undefined);
  }, [actualFiltersIds, getFilterById]);

  function handleSelection(genre, isChecked) {
    setActualFiltersIds((prevFilterIds) => (isChecked ? [...prevFilterIds, genre.mal_id] : prevFilterIds.filter((filterId) => filterId !== genre.mal_id)));
  }

  function handleSubmit() {
    onFilterSubmit(actualSearchQuery, actualFiltersIds);
  }

  useEffect(() => {
    setActualFiltersIds(selectedFiltersIds);
    setActualSearchQuery(initialSearchQuery || "");

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedFiltersIds, initialSearchQuery]);

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div className={styles.componentContainer}>
      <div className={styles.filterContainer}>
        <div className={styles.inputSearch}>
          <input type="text" placeholder="Cerca..." value={actualSearchQuery} onChange={(e) => setActualSearchQuery(e.target.value)} onKeyDown={handleKeyPress} />
        </div>

        <div className={styles.dropdownContainer} ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen((prev) => !prev)} className={styles.dropdownButton} disabled={isError}>
            Generi {!isDropdownOpen ? <ChevronDown /> : <ChevronUp />}
          </button>

          {isDropdownOpen && (
            <div className={styles.filtersBox}>
              {genres.map((genre) => (
                <div key={genre.mal_id} className={styles.checkboxItem} style={{}}>
                  <input
                    type="checkbox"
                    value={genre.name}
                    onChange={(event) => handleSelection(genre, event.target.checked)}
                    id={genre.mal_id}
                    checked={actualFiltersIds.some((filter) => filter === genre.mal_id)}
                  />
                  <label style={{ cursor: "pointer", width: "100%", margin: "-8px -25px", padding: "8px 25px" }} htmlFor={genre.mal_id}>
                    {genre.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className={styles.buttonn} onClick={handleSubmit}>
          Filtra
        </button>
      </div>

      {actualFiltersIds.length > 0 && (
        <div className={styles.selectedFilterContainer}>
          <div className={styles.selectedFilters}>
            Filtri attivi:
            {actualFilters.map((actualFilter) => (
              <span key={actualFilter.mal_id} className={styles.selectedTag}>
                {actualFilter.name}
                <X
                  style={{ marginTop: "2px", marginLeft: "5px" }}
                  width={20}
                  height={20}
                  onClick={() => setActualFiltersIds(actualFiltersIds.filter((actualFilterId) => actualFilterId !== actualFilter.mal_id))}
                />
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

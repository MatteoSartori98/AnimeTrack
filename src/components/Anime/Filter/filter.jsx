/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import styles from "./filter.module.css";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { animeApi } from "../../../services/api";

export default function Filter({ initialSearchQuery, onFilterSubmit }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || "");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const dropdownRef = useRef(null);

  const { data: genresData, isError } = useQuery({
    queryKey: ["genres"],
    queryFn: animeApi.getGenres,
  });

  const genres = genresData?.data || [];

  function handleSelection(genre, isChecked) {
    setSelectedFilters((prevFilters) => (isChecked ? [...prevFilters, genre] : prevFilters.filter((filter) => filter.name !== genre.name)));
  }

  function handleSubmit() {
    onFilterSubmit(searchQuery, selectedFilters);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div className={styles.componentContainer}>
      <div className={styles.filterContainer}>
        <div className={styles.inputSearch}>
          <input type="text" placeholder="Cerca..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyPress} />
        </div>

        <div className={styles.dropdownContainer} ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen((prev) => !prev)} className={styles.dropdownButton} disabled={isError}>
            Generi {!isDropdownOpen ? <ChevronDown /> : <ChevronUp />}
          </button>

          {isDropdownOpen && (
            <div className={styles.filtersBox}>
              {genres.map((genre) => (
                <div key={genre.mal_id} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    value={genre.name}
                    onChange={(event) => handleSelection(genre, event.target.checked)}
                    id={genre.mal_id}
                    checked={selectedFilters.some((filter) => filter.name === genre.name)}
                  />
                  <label htmlFor={genre.mal_id}>{genre.name}</label>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className={styles.buttonn} onClick={handleSubmit}>
          Filtra
        </button>
      </div>

      {selectedFilters.length > 0 && (
        <div className={styles.selectedFilterContainer}>
          <div className={styles.selectedFilters}>
            Filtri attivi:
            {selectedFilters.map((filter) => (
              <span key={filter.mal_id} className={styles.selectedTag}>
                {filter.name}
                <X
                  style={{ marginTop: "2px", marginLeft: "5px" }}
                  width={20}
                  height={20}
                  onClick={() => setSelectedFilters(selectedFilters.filter((f) => f.name !== filter.name))}
                />
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

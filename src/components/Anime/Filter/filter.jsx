import { useEffect, useState, useRef } from "react";
import styles from "./filter.module.css";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function Filter() {
  const [genres, setGenres] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function fetchGenres() {
      const response = await fetch("https://api.jikan.moe/v4/genres/anime");
      const data = await response.json();
      setGenres(data.data);
    }
    fetchGenres();
  }, []);

  function handleSelection(event) {
    const genre = event.target.value;
    const isChecked = event.target.checked;

    setSelectedFilters((prevFilters) =>
      isChecked
        ? [...prevFilters, genre]
        : prevFilters.filter((filter) => filter !== genre)
    );
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

  return (
    <div className={styles.componentContainer}>
      <div className={styles.filterContainer}>
        <div className={styles.inputSearch}>
          <input type="text" placeholder="Cerca..." />
        </div>

        <div className={styles.dropdownContainer} ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className={styles.dropdownButton}
          >
            Generi {!isDropdownOpen ? <ChevronDown /> : <ChevronUp />}
          </button>

          {isDropdownOpen && (
            <div className={styles.filtersBox}>
              {genres.map((genre) => (
                <div key={genre.mal_id} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    value={genre.name}
                    onChange={handleSelection}
                    id={genre.mal_id}
                    checked={selectedFilters.includes(genre.name)}
                  />
                  <label htmlFor={genre.mal_id}>{genre.name}</label>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className={styles.buttonn}>Filtra</button>
      </div>

      {selectedFilters.length > 0 && (
        <div className={styles.selectedFilterContainer}>
          <div className={styles.selectedFilters}>
            Filtri attivi:
            {selectedFilters.map((filter, index) => (
              <span key={index} className={styles.selectedTag}>
                {filter}
                <Trash2
                  width={15}
                  color="red"
                  onClick={() =>
                    setSelectedFilters(
                      selectedFilters.filter((f) => f !== filter)
                    )
                  }
                />
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

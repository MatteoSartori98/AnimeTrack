import { useState } from "react";
import { Search, BookOpen, Heart, User } from "lucide-react";
import styles from "./navbar.module.css";
import { Link, useNavigate } from "react-router";

export default function Navbar() {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  function handleKey(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  }

  function handleSearch() {
    if (searchInputValue.trim()) {
      navigate("/search", { state: { query: searchInputValue.trim() }, replace: true });
      setSearchInputValue("");
    }
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <h1 className={styles.logo}>
          <Link to="/">
            Anime<span className={styles.logoAccent}>Track</span>
          </Link>
        </h1>
        <div className={styles.navbarControls}>
          <div className={`${styles.searchContainer} ${isSearchFocused ? "focused" : ""}`}>
            <input
              type="text"
              placeholder="Cerca anime..."
              value={searchInputValue}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onKeyDown={handleKey}
              onChange={(event) => setSearchInputValue(event.target.value)}
              className={styles.searchInput}
            />
            <button className={styles.searchButton} onClick={handleSearch}>
              <Search className={styles.searchIcon} />
            </button>
          </div>
          <div className={styles.navControls}>
            <button className={styles.navButton}>
              <BookOpen />
            </button>
            <button className={styles.navButton}>
              <Heart />
            </button>
            <div className={styles.navDivider}></div>
            <div className={styles.userAvatar}>
              <User />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

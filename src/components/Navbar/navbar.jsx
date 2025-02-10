import { useState } from "react";
import { Search, BookOpen, Heart, User } from "lucide-react";
import styles from "./navbar.module.css";

export default function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <h1 className={styles.logo}>
          Anime<span className={styles.logoAccent}>Track</span>
        </h1>
        <div className={styles.navbarControls}>
          <div
            className={`${styles.searchContainer} ${
              isSearchFocused ? "focused" : ""
            }`}
          >
            <input
              type="text"
              placeholder="Search anime..."
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={styles.searchInput}
            />
            <Search className={styles.searchIcon} />
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

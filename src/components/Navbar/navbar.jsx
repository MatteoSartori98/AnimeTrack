import { useState, useEffect, useContext, useRef } from "react";
import { Search, BookOpen, Heart, User } from "lucide-react";
import styles from "./navbar.module.css";
import { createSearchParams, Link, useLocation, useNavigate } from "react-router";
import supabase from "../../supabase/client";
import SessionContext from "../../context/Session/SessionContext";

const avatars = ["/media/avatar2.jpg", "/media/avatar3.jpg", "/media/avatar4.jpg", "/media/avatar5.jpg"];

export default function Navbar() {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { session, user } = useContext(SessionContext);
  const dropdownRef = useRef(null);

  function handleKey(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  }

  function handleSearch() {
    if (searchInputValue.trim()) {
      const queryParams = createSearchParams({
        q: searchInputValue.trim(),
      });
      navigate({
        pathname: "/search",
        search: queryParams.toString(),
      });
      setSearchInputValue("");
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleDropdown(event) {
    event.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  }

  async function signOut() {
    setIsDropdownOpen(false);
    await supabase.auth.signOut();
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <h1 className={styles.logo}>
          <Link to="/">
            <span style={{ color: "white" }}>Anime</span>
            <span className={styles.logoAccent}>Track</span>
          </Link>
        </h1>
        <div className={styles.navbarControls}>
          {location.pathname !== "/search" && (
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
          )}
          <div className={styles.navControls}>
            <Link to="/search" className={styles.navButton}>
              <BookOpen />
            </Link>
            <button className={styles.navButton}>
              <Heart />
            </button>
            <div className={styles.navDivider}></div>

            <div className={session && styles.userAvatar}>
              {!session ? (
                <div>
                  <Link to="/login" className={styles.login}>
                    Login
                  </Link>
                </div>
              ) : (
                <>
                  <div className={styles.avatar} onClick={(event) => handleDropdown(event)}>
                    <img src={"/media/avatarDefault.png"} alt="Profile avatar" />
                  </div>
                  <div ref={dropdownRef} className={`${styles.dropdownContainer} ${isDropdownOpen ? styles.show : null}`}>
                    <Link to="/profile" className={styles.profile}>
                      Profilo
                    </Link>
                    <hr style={{ marginBottom: "6px" }} />
                    <div>
                      <button onClick={signOut}>Logout</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

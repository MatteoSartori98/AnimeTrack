import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import styles from "./searchResults.module.css";
import SearchCard from "../../components/Anime/SearchCard/searchCard";
import toast, { Toaster } from "react-hot-toast";
import Filter from "../../components/Anime/Filter/filter";

export default function SearchResults() {
  const location = useLocation();
  const initialSearchQuery = location.state?.query || "";
  const [errored, setErrored] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useState({
    searchQuery: initialSearchQuery,
    filters: [],
  });

  useEffect(() => {
    async function fetchAnime() {
      setLoading(true);
      setErrored(false);

      try {
        const { searchQuery, filters } = searchParams;
        const genreIds = filters.map((filter) => filter.mal_id).join(",");
        const genreParam = genreIds ? `&genres=${genreIds}` : "";
        const searchParam = searchQuery ? `&q=${searchQuery}` : "";
        const result = await fetch(
          `https://api.jikan.moe/v4/anime?page=${page}${searchParam}${genreParam}`
        );

        if (!result.ok) {
          throw new Error("Errore durante la richiesta, riprova più tardi.");
        }

        const data = await result.json();

        if (!data || !data.data || data.data.length === 0) {
          throw new Error("Nessun risultato trovato.");
        }

        setResults(data.data);
        setTotalPages(data.pagination.last_visible_page);
      } catch (error) {
        toast.error(error.message);
        setErrored(true);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAnime();
  }, [searchParams, page]);

  function handleFilterSubmit(newSearchQuery, newFilters) {
    setSearchParams({
      searchQuery: newSearchQuery,
      filters: newFilters,
    });
    setPage(1);
  }

  function showList() {
    return (results.length > 0 || loading) && !errored;
  }

  function handleNextPage() {
    if (page < totalPages) setPage(page + 1);
  }

  function handlePrevPage() {
    if (page > 1) setPage(page - 1);
  }

  return (
    <div className={styles.container}>
      <Toaster position="top-right" />
      <Filter
        initialSearchQuery={searchParams.searchQuery || initialSearchQuery}
        onFilterSubmit={handleFilterSubmit}
      />
      {loading ? (
        <div className={styles.loadingContainer}>
          <span>Caricamento...</span>
        </div>
      ) : showList() ? (
        <>
          <div className={styles.container}>
            {results.map((anime, index) => (
              <SearchCard key={`${anime.mal_id}-${index}`} anime={anime} />
            ))}
          </div>
          <div className={styles.pagination}>
            <button onClick={handlePrevPage} disabled={page === 1}>
              Precedente
            </button>
            <span>
              Pagina {page} di {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={page === totalPages}>
              Successiva
            </button>
          </div>
        </>
      ) : (
        <div className={styles.errorContainer}>
          <img
            src={`/media/error.jpg?${new Date().getTime()}`}
            className={styles.errorImage}
            alt="Errore"
          />
        </div>
      )}
    </div>
  );
}

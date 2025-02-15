import { useState } from "react";
import { useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import styles from "./searchResults.module.css";
import SearchCard from "./SearchCard/searchCard";
import { Toaster } from "react-hot-toast";
import Filter from "../../components/Filter/filter";
import { animeApi } from "../../services/api";

export default function SearchResults() {
  const location = useLocation();
  const initialSearchQuery = location.state?.query || "";
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useState({
    searchQuery: initialSearchQuery,
    filters: [],
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["searchAnime", page, searchParams],
    queryFn: () =>
      animeApi.searchAnime({
        page,
        searchQuery: searchParams.searchQuery,
        genres: searchParams.filters.map((f) => f.mal_id).join(","),
      }),
    enabled: !!(searchParams.searchQuery || searchParams.filters.length),
  });

  const results = data?.data || [];
  const totalPages = data?.pagination?.last_visible_page || 1;

  function handleFilterSubmit(newSearchQuery, newFilters) {
    setSearchParams({
      searchQuery: newSearchQuery,
      filters: newFilters,
    });
    setPage(1);
  }

  function showList() {
    return (results.length > 0 || isLoading) && !isError;
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
      <Filter initialSearchQuery={initialSearchQuery} onFilterSubmit={handleFilterSubmit} />
      {isLoading ? (
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
        <div className={styles.emptyContainer}>
          <p style={{ color: "white" }}>
            {isError ? "Si è verificato un errore. Riprova più tardi." : 'Inserisci una ricerca o seleziona dei filtri e clicca "Filtra"'}
          </p>
        </div>
      )}
    </div>
  );
}

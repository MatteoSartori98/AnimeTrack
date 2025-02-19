import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styles from "./searchResults.module.css";
import SearchCard from "./SearchCard/searchCard";
import { Toaster } from "react-hot-toast";
import Filter from "../../components/Filter/filter";
import { animeApi } from "../../services/api";
import { useSearchParams } from "react-router";
import Banner from "../../components/Banner/banner";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  const searchQuery = useMemo(() => {
    return searchParams.get("q");
  }, [searchParams]);
  const filterIds = useMemo(() => {
    const genres = searchParams.get("g");
    if (genres === null || genres === undefined || genres.length === 0) return [];

    return genres?.split(",").map((f) => +f);
  }, [searchParams]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["searchAnime", page, searchParams.toString()],
    queryFn: () =>
      animeApi.searchAnime({
        page,
        searchQuery,
        genres: filterIds,
      }),
    enabled: !!(searchQuery || filterIds),
  });

  const results = data?.data || [];
  const totalPages = data?.pagination?.last_visible_page || 1;

  function handleFilterSubmit(searchedString, newFilterIds) {
    setSearchParams({ q: searchedString, g: newFilterIds.join(",") });

    setPage(1);
  }

  function onGenreClick(filterId) {
    setSearchParams({ g: filterId });
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
    <>
      <Banner />
      <div className={styles.container} style={{ marginRight: results.length == 0 ? "auto + 10" : "auto" }}>
        <Filter initialSearchQuery={searchQuery} onFilterSubmit={handleFilterSubmit} selectedFiltersIds={filterIds} />
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <span>Caricamento...</span>
          </div>
        ) : showList() ? (
          <>
            <div className={styles.container}>
              {results.map((anime, index) => (
                <SearchCard key={`${anime.mal_id}-${index}`} anime={anime} onGenreClick={onGenreClick} />
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
            <p style={{ color: "white" }}>{isError ? "Si è verificato un errore. Riprova più tardi." : 'Inserisci una ricerca o seleziona dei filtri e clicca "Filtra"'}</p>
          </div>
        )}
        <Toaster
          containerStyle={{
            top: 85,
            right: 0,
          }}
          position="top-right"
          reverseOrder={false}
          style={{ marginTop: "50px" }}
        />
      </div>
    </>
  );
}

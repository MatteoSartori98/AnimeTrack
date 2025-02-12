import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import styles from "./searchResults.module.css";
import SearchCard from "../../components/Anime/SearchCard/searchCard";
import toast, { Toaster } from "react-hot-toast";
import Filter from "../../components/Anime/Filter/filter";

export default function SearchResults() {
  const location = useLocation();
  const searchQuery = location.state?.query;
  const [errored, setErrored] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      const abortController = new AbortController();
      let isCurrentRequest = true;

      async function fetchQueryResults() {
        setLoading(true);
        setErrored(false);

        try {
          const result = await fetch(
            `https://api.jikan.moe/v4/anime?q=${searchQuery}`,
            { signal: abortController.signal }
          );

          if (!isCurrentRequest) return;

          if (!result.ok) {
            throw new Error(
              "Errore durante la richiesta, riprova più tardi o chiama l'assistenza"
            );
          }

          const data = await result.json();

          if (!isCurrentRequest) return;

          if (!data || !data.data || data.data.length === 0) {
            throw new Error("Nessun risultato trovato");
          }

          setResults(data.data);
        } catch (error) {
          if (error.name === "AbortError") {
            return;
          }
          if (isCurrentRequest) {
            toast.error(error.message);
            setErrored(true);
          }
        } finally {
          if (isCurrentRequest) {
            setLoading(false);
          }
        }
      }

      fetchQueryResults();

      return () => {
        isCurrentRequest = false;
        abortController.abort();
      };
    }
  }, [searchQuery]);

  const showList = () => {
    return (results.length > 0 || loading) && !errored;
  };

  return (
    <div className={styles.container}>
      <Toaster position="top-right" />
      <Filter />
      {showList() ? (
        results.map((anime, index) => (
          <SearchCard
            key={`${anime.mal_id}-${anime.rank}-${index}`}
            anime={anime}
          />
        ))
      ) : (
        <div className="error-container">
          <span></span>
          <img
            src={`/media/error.jpg?${new Date().getTime()}`}
            className="error-image"
            alt="Errore"
          />
        </div>
      )}
    </div>
  );
}

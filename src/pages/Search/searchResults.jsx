import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import styles from "./searchResults.module.css";
import SearchCard from "../../components/Anime/SearchCard/searchCard";
import toast, { Toaster } from "react-hot-toast";

export default function SearchResults() {
  const location = useLocation();
  const searchQuery = location.state?.query;
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (searchQuery) {
      async function fetchQueryResults() {
        try {
          const result = await fetch(
            `https://api.jikan.moe/v4/anime?q=${searchQuery}`
          );
          if (!result.ok) {
            throw new Error("Nessun risultato trovato");
          }
          const data = await result.json();
          if (!data || !data.data || data.data.length === 0) {
            throw new Error("Nessun risultato trovato");
          }
          setResults(data.data);
        } catch (error) {
          console.error("Errore durante la fetch:", error);
          setError(error.message);
        }
      }
      fetchQueryResults();
    }
  }, [searchQuery]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
    console.log(error);
  }, [error]);

  return (
    <div className={styles.container}>
      <Toaster position="top-right" />
      {results.length > 0 ? (
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

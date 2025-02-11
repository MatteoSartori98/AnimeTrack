import styles from "./popular.module.css";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowLeft, TrendingUp } from "lucide-react";

export default function Popular() {
  const [populars, setPopulars] = useState([]);
  const [visibleEpisodes, setVisibleEpisodes] = useState(7);
  const [startIndex, setStartIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPopulars() {
      try {
        const result = await fetch(`https://api.jikan.moe/v4/top/anime`);
        if (!result.ok) {
          throw new Error(
            "Qualcosa è andato storto. Prova a ricaricare la pagina o riprova più tardi"
          );
        }
        const data = await result.json();
        if (!data || !data.data || data.data.length === 0) {
          throw new Error(
            "Qualcosa è andato storto. Prova a ricaricare la pagina o riprova più tardi"
          );
        }
        setPopulars(data.data);
        setRemaining(data.data.length - 7);
      } catch (error) {
        console.error("Errore durante il fetch:", error);
        setError(error.message);
      }
    }
    fetchPopulars();
  }, []);

  const loadNextEpisodes = () => {
    setRemaining(remaining - 7);
    setStartIndex(startIndex + 7);
    setVisibleEpisodes(visibleEpisodes + 7);
  };

  const loadPrevEpisodes = () => {
    if (startIndex > 0) {
      setRemaining(remaining + 7);
      setStartIndex(startIndex - 7);
      setVisibleEpisodes(visibleEpisodes - 7);
    }
  };

  return (
    <div className={styles.container}>
      <h3>
        <TrendingUp style={{ marginRight: 8 }} />
        Popolari
      </h3>
      {error ? (
        <p className="error-text">{error}</p>
      ) : (
        <>
          <div className={styles.row}>
            {populars.slice(startIndex, visibleEpisodes).map((episode) => {
              return (
                <Link
                  key={episode.mal_id}
                  className={styles.card}
                  style={{
                    backgroundImage: `url(${episode.images.jpg.large_image_url})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className={styles.cardBody}>
                    <h2 className={styles.animeTitle}>
                      {episode.title.length > 40
                        ? episode.title.slice(0, 40) + "..."
                        : episode.title}
                    </h2>
                  </div>
                </Link>
              );
            })}
          </div>
          <div
            className={styles.navigationButtons}
            style={{
              justifyContent: startIndex > 0 ? "space-between" : " flex-end",
            }}
          >
            {startIndex > 0 && (
              <button
                className={styles.showMoreBtn}
                style={{ marginLeft: 10 }}
                onClick={loadPrevEpisodes}
              >
                <ArrowLeft />
                Indietro
              </button>
            )}
            {startIndex + 6 < populars.length && remaining >= 6 ? (
              <button className={styles.showMoreBtn} onClick={loadNextEpisodes}>
                Avanti
                <ArrowRight />
              </button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

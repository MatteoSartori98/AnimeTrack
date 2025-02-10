import styles from "./popular.module.css";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowLeft, TrendingUp } from "lucide-react";

export default function Popular() {
  const [populars, setPopulars] = useState([]);
  const [visibleEpisodes, setVisibleEpisodes] = useState(6);
  const [startIndex, setStartIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    async function fetchPopulars() {
      const response = await fetch(`https://api.jikan.moe/v4/top/anime`);
      const data = await response.json();
      setPopulars(data.data);
      setRemaining(data.data.length - 6);
    }
    fetchPopulars();
  }, []);

  const loadNextEpisodes = () => {
    setRemaining(remaining - 6);
    setStartIndex(startIndex + 6);
    setVisibleEpisodes(visibleEpisodes + 6);
  };

  const loadPrevEpisodes = () => {
    if (startIndex > 0) {
      setRemaining(remaining + 6);
      setStartIndex(startIndex - 6);
      setVisibleEpisodes(visibleEpisodes - 6);
    }
  };

  return (
    <div className={styles.container}>
      <h3>
        <TrendingUp style={{ marginRight: 8 }} />
        Popolari
      </h3>
      <div className={styles.row}>
        {populars.slice(startIndex, visibleEpisodes).map((episode) => {
          return (
            <a
              key={episode.mal_id}
              className={styles.card}
              style={{
                backgroundImage: `url(${episode.images.jpg.large_image_url})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <Link className={styles.cardBody}>
                <h2 className={styles.animeTitle}>
                  {episode.title.length > 40
                    ? episode.title.slice(0, 40) + "..."
                    : episode.title}
                </h2>
              </Link>
            </a>
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
    </div>
  );
}

import styles from "./lastReleases.module.css";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowLeft, Flame } from "lucide-react";

export default function LastReleases() {
  const [newEpisodes, setNewEpisodes] = useState([]);
  const [visibleEpisodes, setVisibleEpisodes] = useState(6);
  const [startIndex, setStartIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    async function fetchNewEpisodes() {
      const response = await fetch(`https://api.jikan.moe/v4/watch/episodes`);
      const data = await response.json();
      setNewEpisodes(data.data);
      setRemaining(data.data.length - 6);
    }
    fetchNewEpisodes();
  }, []);

  const availableEpisodes = newEpisodes.filter(
    (episode) => !episode.region_locked
  );

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
        <Flame fill="white" style={{ marginRight: 4 }} />
        Ultimi episodi
      </h3>
      <div className={styles.row}>
        {availableEpisodes.slice(startIndex, visibleEpisodes).map((episode) => {
          return (
            <a
              key={episode.entry.mal_id}
              className={styles.card}
              style={{
                backgroundImage: `url(${episode.entry.images.jpg.large_image_url})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <Link className={styles.cardBody}>
                <h2 className={styles.animeTitle}>
                  {episode.entry.title.length > 40
                    ? episode.entry.title.slice(0, 40) + "..."
                    : episode.entry.title}
                </h2>
                <h2 className="episode-number">{`Episodio ${
                  episode.episodes[0].title.split(" ")[1]
                }`}</h2>
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
        {startIndex + 6 < availableEpisodes.length && remaining >= 6 ? (
          <button className={styles.showMoreBtn} onClick={loadNextEpisodes}>
            Avanti
            <ArrowRight />
          </button>
        ) : null}
      </div>
    </div>
  );
}

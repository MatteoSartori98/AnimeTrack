import styles from "./lastReleases.module.css";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowLeft, Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { animeApi } from "../../../services/api";

export default function LastReleases() {
  const [visibleEpisodes, setVisibleEpisodes] = useState(8);
  const [startIndex, setStartIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["watchEpisodes"],
    queryFn: animeApi.getWatchEpisodes,
  });

  const availableEpisodes = data?.data?.filter((episode) => !episode.region_locked) || [];

  useEffect(() => {
    setRemaining(availableEpisodes.length - visibleEpisodes);
  }, [availableEpisodes, visibleEpisodes]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <p className="error-text">{isError}</p>;

  const loadNextEpisodes = () => {
    setRemaining(remaining - 8);
    setStartIndex(startIndex + 8);
    setVisibleEpisodes(visibleEpisodes + 8);
  };

  const loadPrevEpisodes = () => {
    if (startIndex > 0) {
      setRemaining(remaining + 8);
      setStartIndex(startIndex - 8);
      setVisibleEpisodes(visibleEpisodes - 8);
    }
  };

  return (
    <div className={styles.container}>
      <h3>
        <Flame fill="white" style={{ marginRight: 4 }} />
        Ultimi episodi
      </h3>
      <div className={styles.row}>
        {availableEpisodes.slice(startIndex, visibleEpisodes).map((episode) => (
          <Link
            // to={`/detail/${episode.entry.mal_id}`}
            state={{ episode }}
            key={episode.entry.mal_id}
            className={styles.card}
            style={{
              backgroundImage: `url(${episode.entry.images.jpg.large_image_url})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className={styles.cardBody}>
              <h2 className={styles.animeTitle}>{episode.entry.title.length > 40 ? episode.entry.title.slice(0, 40) + "..." : episode.entry.title}</h2>
              <h2 className="episode-number">{`Episodio ${episode.episodes[0]?.title?.split(" ")[1] || "?"}`}</h2>
            </div>
          </Link>
        ))}
        <div
          className={styles.navigationButtons}
          style={{
            justifyContent: startIndex > 0 ? "space-between" : "flex-end",
          }}
        >
          {startIndex > 0 && (
            <button className={styles.showMoreBtn} style={{ marginLeft: 10 }} onClick={loadPrevEpisodes}>
              <ArrowLeft />
              Indietro
            </button>
          )}
          {startIndex + 6 < availableEpisodes.length && remaining >= 6 ? (
            <button className={styles.showMoreBtn} style={{ marginRight: 10 }} onClick={loadNextEpisodes}>
              Avanti
              <ArrowRight />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

import styles from "./popular.module.css";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowLeft, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { animeApi } from "../../../services/api";

export default function Popular() {
  const [visibleEpisodes, setVisibleEpisodes] = useState(7);
  const [startIndex, setStartIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["popular"],
    queryFn: animeApi.getPopular,
  });

  useEffect(() => {
    if (data?.data) {
      setRemaining(data.data.length - visibleEpisodes);
    }
  }, [data, visibleEpisodes]);

  if (isLoading) return <div>Caricamento...</div>;
  if (isError) return <p className="error-text">Failed to load popular anime</p>;

  const populars = data?.data || [];

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
      <div className={styles.row}>
        {populars.slice(startIndex, visibleEpisodes).map((episode) => (
          <Link
            to={`/detail/${episode.mal_id}`}
            state={{ episode }}
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
              <h2 className={styles.animeTitle}>{episode.title.length > 40 ? episode.title.slice(0, 40) + "..." : episode.title}</h2>
            </div>
          </Link>
        ))}
      </div>
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
        {startIndex + 6 < populars.length && remaining >= 6 ? (
          <button className={styles.showMoreBtn} style={{ marginRight: 10 }} onClick={loadNextEpisodes}>
            Avanti
            <ArrowRight />
          </button>
        ) : null}
      </div>
    </div>
  );
}

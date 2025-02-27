/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "./searchCard.module.css";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

const possibleStatuses = {
  FINISHED_AIRING: "Finished Airing",
  CURRENTLY_AIRING: "Currently Airing",
  NOT_YET_AIRED: "Not yet aired",
  DEFAULT: null,
};

const statusConfigs = {
  [possibleStatuses.FINISHED_AIRING]: {
    backgroundColor: "rgb(220, 252, 231)",
    color: "#165c50",
    translation: "Completed",
  },
  [possibleStatuses.CURRENTLY_AIRING]: {
    backgroundColor: "rgb(199, 210, 252)",
    color: "rgb(28 62 116)",
    translation: "In progress",
  },
  [possibleStatuses.NOT_YET_AIRED]: {
    backgroundColor: "rgb(199, 210, 252)",
    color: "rgb(28 62 116)",
    translation: "Coming soon",
  },
  [possibleStatuses.DEFAULT]: {
    backgroundColor: "rgb(199, 210, 252)",
    color: "rgb(28 62 116)",
    translation: "Unknow",
  },
};

const fetchImage = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Image fetch failed");
  }
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export default function SearchCard({ anime, onGenreClick }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: imageUrl, isLoading } = useQuery({
    queryKey: ["animeImage", anime.images.jpg.large_image_url],
    queryFn: () => fetchImage(anime.images.jpg.large_image_url),
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60 * 24,
  });

  function createStatusTagbox(status) {
    const statusConfig = statusConfigs[status];
    return (
      <div
        className={styles.status}
        style={{
          backgroundColor: statusConfig.backgroundColor,
          color: statusConfig.color,
        }}
      >
        {statusConfig.translation}
      </div>
    );
  }

  function handleClick(event) {
    event.preventDefault();
    setIsExpanded(!isExpanded);
  }

  function handleTagClick(genre, event) {
    event.preventDefault();
    const genreObject = {
      mal_id: genre,
      name: anime.genres.find((g) => g.mal_id === genre)?.name,
    };

    onGenreClick(genreObject.mal_id);
  }

  return (
    <>
      <Link to={`/detail/${anime.mal_id}`} state={{ episode: anime }} key={anime.mal_id} className={styles.card}>
        <div
          style={{
            position: "relative",
            display: "flex",
          }}
        >
          <div className={styles.shadow}></div>
          <div className={styles.rating}>
            <Star width={18} style={{ color: "#ffd500" }} />
            {anime.score}
          </div>
          {isLoading ? (
            <div className={styles.imagePlaceholder}></div>
          ) : (
            <img
              src={imageUrl}
              alt={anime.title}
              loading="lazy"
              onError={(e) => {
                e.target.src = "/fallback-image.jpg";
              }}
            />
          )}
        </div>
        <div className={styles.cardBody}>
          <div className={styles.cardHeader}>
            <h3 className={styles.h3}>{anime.title}</h3>
            <h5 className={styles.h5}>{anime.title_japanese}</h5>
            <div className={styles.status}>{createStatusTagbox(anime.status)}</div>
          </div>
          <div style={{ display: "flex" }}>
            <p>
              {!isExpanded ? (
                anime.synopsis?.length > 500 ? (
                  <>
                    <span className={styles.textOverflow}>{anime.synopsis}</span>
                    <button style={{ background: "none", color: "#3b82f6", border: "0", fontSize: "15px", fontWeight: "bold", cursor: "pointer" }} onClick={handleClick}>
                      leggi di più
                    </button>
                  </>
                ) : (
                  anime.synopsis
                )
              ) : (
                <>
                  {anime.synopsis}
                  <button style={{ background: "none", color: "#3b82f6", border: "0", fontSize: "15px", fontWeight: "bold", cursor: "pointer" }} onClick={handleClick}>
                    nascondi
                  </button>
                </>
              )}
            </p>
          </div>
          <div className={styles.tagsContainer}>
            {anime.genres.map((el) => (
              <button key={el.mal_id} className={styles.tags} onClick={(event) => handleTagClick(el.mal_id, event)}>
                {el.name}
              </button>
            ))}
          </div>
          <div className={styles.infoDuration} style={{ display: "flex" }}>
            <div style={{ marginRight: "20px" }}>{anime.episodes === null ? "Unknown" : anime.episodes} episodes </div>
            <div>{anime.duration.split(" ").slice(0, 2)} duration </div>
          </div>
        </div>
      </Link>
    </>
  );
}

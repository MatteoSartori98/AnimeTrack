/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "./searchCard.module.css";

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

export default function SearchCard({ anime }) {
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <div className={styles.card}>
      <div style={{ position: "relative", display: "flex" }}>
        <img src={anime.images.jpg.large_image_url} alt={anime.title} />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <h3 className={styles.h3}>{anime.title}</h3>
          <h5 className={styles.h5}>{anime.title_japanese}</h5>
          <div className={styles.status}>
            {createStatusTagbox(anime.status)}
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <p>
            {!isExpanded ? (
              anime.synopsis?.length > 500 ? (
                <>
                  <span className={styles.textOverflow}>{anime.synopsis}</span>
                  <a onClick={handleClick}> leggi di più</a>
                </>
              ) : (
                anime.synopsis
              )
            ) : (
              <>
                {anime.synopsis}
                <a onClick={handleClick}> nascondi</a>
              </>
            )}
          </p>
        </div>
        <div className={styles.tagsContainer}>
          {anime.genres.map((el) => (
            <button key={el.mal_id} className={styles.tags}>
              {el.name}
            </button>
          ))}
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "20px" }}>
            {anime.episodes === null ? "Unknown" : anime.episodes} episodes{" "}
          </div>
          <div>{anime.duration.split(" ").slice(0, 2)} duration </div>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable react/prop-types */
import styles from "./searchCard.module.css";
import { useState } from "react";

export default function SearchCard({ anime }) {
  const [isExpanded, setIsExpanded] = useState(false);

  function handleClick(event) {
    event.preventDefault();
    setIsExpanded(!isExpanded);
  }

  return (
    <div className={styles.card}>
      <img src={anime.images.jpg.large_image_url} alt={anime.title} />
      <div className={styles.cardBody}>
        <h3 className={styles.h3}>{anime.title}</h3>
        <p>
          {!isExpanded ? (
            anime.synopsis?.length > 300 ? (
              <>
                <span className={styles.textOverflow}>{anime.synopsis}</span>
                <a onClick={handleClick}> Leggi di più</a>
              </>
            ) : (
              anime.synopsis
            )
          ) : (
            <>
              {anime.synopsis}
              <a onClick={handleClick}> Nascondi</a>
            </>
          )}
        </p>
        <div className={styles.tagsContainer}>
          {anime.genres.map((el) => (
            <button key={el.mal_id} className={styles.tags}>
              {el.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

import styles from "./detail.module.css";
import { useLocation } from "react-router";
import { animeApi } from "../../services/api";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function Detail() {
  const [isExpanded, setIsExpanded] = useState(false);

  const location = useLocation();
  const episode = location.state?.episode;
  console.log(episode);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["animeEpisodesURL", episode.mal_id],
    queryFn: () =>
      animeApi
        .getAllEpisodesURL({
          animeID: episode.mal_id,
        })
        .then((res) => res.json()),
  });
  const episodes = data?.data || [];

  if (!episode) return <p>Dati non disponibili</p>;
  if (isError) return;
  if (isLoading) return <p>Caricament....</p>;

  function handleClick(event) {
    event.preventDefault();
    setIsExpanded(!isExpanded);
  }

  return (
    <>
      <div className={styles.banner}></div>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.leftBox}>
            <div className={styles.imgBox}>
              <img className={styles.img} src={episode.images.jpg.large_image_url} alt={episode.title} />
            </div>
          </div>

          <div className={styles.rightBox}>
            <div className={styles.top}>
              <h2>{episode.title}</h2>
              <h5 className={styles.h5}>{episode.title_japanese}</h5>
            </div>

            <div className={styles.bottom}>
              <div className={styles.infoBox}>
                <h4> Studio: {episode.studios[0].name}</h4>
                <h4> Sudio</h4>
                <h4> Sudio</h4>
                <h4> Sudio</h4>
              </div>
              <div className={styles.tagBox}>
                {episode.genres.map((genre) => (
                  <button key={genre.name} className={styles.tags}>
                    {genre.name}
                  </button>
                ))}
              </div>
              <div className={styles.descriptionBox}>
                <h4 style={{ marginBottom: "0px" }}>Trama:</h4>
                {!isExpanded ? (
                  episode.synopsis?.length > 500 ? (
                    <>
                      <p className={styles.textOverflow}>{episode.synopsis}</p>
                      <a onClick={handleClick}> leggi di più</a>
                    </>
                  ) : (
                    <p>{episode.synopsis}</p>
                  )
                ) : (
                  <>
                    <p>{episode.synopsis}</p>
                    <a onClick={handleClick}> nascondi</a>
                  </>
                )}
              </div>
              <div className={styles.episodesBox}>
                <h3 style={{ padding: " 0 3px" }}>Episodi</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: " 0 3px" }}>
                  {!isLoading &&
                    !isError &&
                    episodes.map((episode) => (
                      <a className={styles.episodeButton} key={episode.mal_id} href={episode.url} target="blank">
                        Episodio {episode.mal_id}
                      </a>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import styles from "./detail.module.css";
import styless from "../Home/Popular/popular.module.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { createSearchParams, Link } from "react-router";
import { useLocation } from "react-router";
import { animeApi } from "../../services/api";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, Star, Youtube, Clapperboard, ListVideo, BookText } from "lucide-react";
import Banner from "../../components/Banner/banner";
import supabase from "../../supabase/client";
import SessionContext from "../../context/Session/SessionContext";
import toast, { Toaster } from "react-hot-toast";
import FavouritesContext from "../../context/Favourites/FavouritesContext";

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

const fetchAnimeDetails = async (animeID) => {
  const response = await animeApi.getAnimeData({ animeID });
  return response.data;
};

export default function Detail() {
  const location = useLocation();
  const [episode, setEpisode] = useState(location.state?.episode);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const { session } = useContext(SessionContext);
  const { favourites, setFavourites } = useContext(FavouritesContext);

  function isAlreadyFavourite() {
    return favourites.find((el) => el.anime_id === episode.mal_id);
  }

  useEffect(() => {
    if (episode) {
      setIsFilled(isAlreadyFavourite());
    }
  }, [episode, favourites]);

  async function handleAddToFavourites(episode) {
    if (isAlreadyFavourite(episode.mal_id)) {
      return toast.error("Anime già aggiunto.");
    }

    const { error } = await supabase
      .from("favourites")
      .insert([{ profile_id: session.user.id, anime_id: episode.mal_id, anime_title: episode.title }])
      .select();

    if (error) {
      toast.error("Azione fallita.");
    } else {
      toast.success("Anime aggiunto ai preferiti!");
      setIsFilled(true);
      setFavourites((prevFavourites) => [...prevFavourites, { anime_id: episode.mal_id, anime_title: episode.title }]);
    }
  }

  async function handleRemoveFromFavourites(episode) {
    const { error } = await supabase.from("favourites").delete().eq("anime_id", episode.mal_id).eq("profile_id", session.user.id);

    if (error) {
      toast.error("Errore nella rimozione");
    } else {
      toast.success("Anime rimosso dai preferiti");
      setIsFilled(false);
      setFavourites((prevFavourites) => prevFavourites.filter((fav) => fav.anime_id !== episode.mal_id));
    }
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["animeEpisodesURL", episode.mal_id],
    queryFn: () =>
      animeApi.getAllEpisodesURL({
        animeID: episode.mal_id,
      }),
    enabled: !!episode?.mal_id,
  });

  const episodes = data?.data || [];

  const { data: recommendedData } = useQuery({
    queryKey: ["animeRecommendations", episode.mal_id],
    queryFn: () =>
      animeApi.getRecommendedAnime({
        animeID: episode.mal_id,
      }),
    enabled: !!episode?.mal_id,
  });

  const recommended = recommendedData?.data || [];

  if (!episode) return <p>Dati non disponibili</p>;
  if (isError) return;
  if (isLoading) return;

  function createStatusTagbox(status) {
    const statusConfig = statusConfigs[status];
    return <span>{statusConfig.translation}</span>;
  }

  function handleClick(event) {
    event.preventDefault();
    setIsExpanded(!isExpanded);
  }

  const date = episode?.aired?.prop?.from || { day: "-", month: "-", year: "-" };

  const formatDate = ({ day, month, year }) => {
    const pad = (num) => String(num).padStart(2, "0");
    return `${pad(day)}/${pad(month)}/${year}`;
  };

  const handleRecommendationClick = async (animeID) => {
    const newAnimeData = await fetchAnimeDetails(animeID);
    setEpisode(newAnimeData);
  };

  return (
    <>
      <Banner />

      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles.leftBox}>
            <div className={styles.imgBox}>
              <img className={styles.img} src={episode.images.jpg.large_image_url} alt={episode.title} />
            </div>
            <div className={styles.trailerBox}>
              <a href={episode.trailer.url} target="blank" className={styles.trailer}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-youtube"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </svg>
                <span style={{ marginLeft: "3px" }}>Trailer</span>
              </a>
            </div>
            <div className={styles.preferiteBox}>
              <h4 style={{ textAlign: "center", marginBottom: "8px", fontSize: "18px" }}>Aggiungi ai preferiti</h4>
              <button
                className={styles.preferite}
                onClick={() => {
                  if (!isAlreadyFavourite(episode.mal_id)) {
                    return handleAddToFavourites(episode);
                  } else {
                    return handleRemoveFromFavourites(episode);
                  }
                }}
              >
                <Heart width={33} height={33} fill={isFilled ? "red" : "none"} color={isFilled ? "red" : "white"} />
              </button>
            </div>
            <div className={styles.scoreBox}>
              <h4 style={{ textAlign: "center", marginBottom: "8px", fontSize: "18px" }}>Vota</h4>
              <div className={styles.score}>
                <Star width={33} height={33} />
                <Star width={33} height={33} />
                <Star width={33} height={33} />
                <Star width={33} height={33} />
                <Star width={33} height={33} />
              </div>
              <h5>Anime votato da altre 6 persone</h5>
            </div>
          </div>

          <div className={styles.rightBox}>
            <div className={styles.top}>
              <h2>{episode.title}</h2>
              <h5 className={styles.h5}>{episode.title_japanese}</h5>
            </div>

            <div className={styles.bottom}>
              <div className={styles.infoBox}>
                <h4> Studio: {episode.studios[0]?.name || "N/A"}</h4>
                <h4> Stato: {createStatusTagbox(episode.status)}</h4>
                <h4> Data di uscita: {formatDate(date)}</h4>
                <h4> Episodi: {episodes.length === 0 ? "1" : episodes.length}</h4>
                <h4> Durata episodi: {episode.duration.split(" ").slice(0, 2)}</h4>
                <h4> Visualizzazioni: {episode.members}</h4>
                <h4 style={{ display: "flex", alignItems: "center" }}>
                  <Star width={20} height={20} /> <span style={{ marginLeft: "5px" }}>Voto: {episode.score}</span>
                </h4>
              </div>
              <div className={styles.tagBox}>
                {episode.genres.map((genre) => {
                  const queryParams = createSearchParams({
                    g: genre.mal_id,
                  });
                  return (
                    <Link
                      key={genre.mal_id}
                      to={{
                        pathname: "/search",
                        search: queryParams.toString(),
                      }}
                    >
                      <button className={styles.tags}>{genre.name}</button>
                    </Link>
                  );
                })}
              </div>
              <div className={styles.descriptionBox}>
                <div style={{ padding: "0 0px 4px", display: "flex", gap: "5px" }}>
                  <BookText />
                  <h3>Trama:</h3>
                </div>
                {!isExpanded ? (
                  episode.synopsis?.length > 700 ? (
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
              {episodes.length > 0 && (
                <div className={styles.episodesBox}>
                  <div style={{ padding: "0 3px", display: "flex", gap: "5px" }}>
                    <ListVideo />
                    <h3>Episodi</h3>
                  </div>
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
              )}
            </div>
          </div>
        </div>
        {recommended.length > 1 && (
          <div className={styles.bottomBox}>
            <div style={{ padding: "3px 16px 16px", display: "flex", gap: "5px" }}>
              <Clapperboard />
              <h3>Correlati</h3>
            </div>
            <Swiper
              navigation={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              modules={[Navigation, Autoplay]}
              className={styles.swiper}
              slidesPerView={7}
              style={{ marginLeft: "0" }}
            >
              {recommended.map((el) => (
                <SwiperSlide key={el.entry.mal_id}>
                  <Link
                    to={`/detail/${el.entry.mal_id}`}
                    onClick={() => handleRecommendationClick(el.entry.mal_id)}
                    key={el.entry.mal_id}
                    className={styless.card}
                    style={{
                      backgroundImage: `url(${el.entry.images.jpg.large_image_url})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <div className={styless.cardBody}>
                      <h2 className={styless.animeTitle}>{el.entry.title.length > 40 ? el.entry.title.slice(0, 40) + "..." : el.entry.title}</h2>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
      <Toaster
        containerStyle={{
          top: 85,
          right: 0,
        }}
        position="bottom-center"
        reverseOrder={false}
        style={{ marginTop: "50px" }}
      />
    </>
  );
}

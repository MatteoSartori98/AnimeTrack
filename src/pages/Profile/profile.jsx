import { useContext, useState, useEffect } from "react";
import styles from "./profile.module.css";
import Banner from "../../components/Banner/banner";
import { Calendar, Heart, Mail, Star, UserRoundPen, X } from "lucide-react";
import SessionContext from "../../context/Session/SessionContext";
import FavouritesContext from "../../context/Favourites/FavouritesContext";
import ReviewsContext from "../../context/Reviews/ReviewsContext";
import { animeApi } from "../../services/api";
import { useQueries } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import supabase from "../../supabase/client";
import { Link } from "react-router";
import AvatarContext from "../../context/Avatar/AvatarContext";
import { disableScroll, enableScroll } from "../../utils/ScrollHandler.jsx";

const avatars = [
  "/media/avatar2.jpg",
  "/media/avatar3.jpg",
  "/media/avatar4.jpg",
  "/media/avatar5.jpg",
  "/media/avatar6.png",
  "/media/avatar7.png",
  "/media/avatar8.jpg",
  "/media/avatar9.jpeg",
  "/media/avatar10.jpeg",
  "/media/avatar11.jpg",
  "/media/avatar12.jpg",
  "/media/avatar13.jpg",
];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [avatar, setAvatar] = useState("/media/avatarDefault.png");
  const [bio, setBio] = useState("");
  const [editedBio, setEditedBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reviewAnimeId, setReviewAnimeId] = useState(null);
  const [reviewScore, setReviewScore] = useState(1);
  const [reviewDescription, setReviewDescription] = useState("");
  const [reviewAnimeTitle, setReviewAnimeTitle] = useState("");
  const session = useContext(SessionContext) || { user: null };
  const { updateAvatar, avatarUrl } = useContext(AvatarContext);
  const [selectedAvatar, setSelectedAvatar] = useState(avatarUrl);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionTarget, setActionTarget] = useState(null);
  const [actionType, setActionType] = useState("");
  const [actionIsAdd, setActionIsAdd] = useState(false);

  const { favourites, setFavourites } = useContext(FavouritesContext);
  const { review, setReview } = useContext(ReviewsContext);

  const uniqueAnimeIds = [...new Set([...(favourites || []).map((fav) => fav.anime_id), ...(review || []).map((rev) => rev.anime_id)])];

  const queryResults = useQueries({
    queries: uniqueAnimeIds.map((animeId) => ({
      queryKey: ["animeList", animeId],
      queryFn: () =>
        animeApi.getAnimeData({
          animeID: animeId,
        }),
      enabled: !!animeId,
    })),
  });

  const getAnimeData = queryResults.map((result) => result.data);
  const isDataLoading = queryResults.some((result) => result.isLoading);
  const error = queryResults.find((result) => result.error);

  useEffect(() => {
    const fetchUserDetails = async () => {
      let { data: userDetails } = await supabase.from("profiles").select("avatar_url, user_bio").eq("id", session.user.id).single();
      if (userDetails) {
        setAvatar(userDetails.avatar_url || "/media/avatarDefault.png");
        setBio(userDetails.user_bio || "Nessuna descrizione ;(");
      }
    };

    if (session.user?.id) {
      fetchUserDetails();
    }
  }, [session.user?.id]);

  useEffect(() => {
    setSelectedAvatar(avatarUrl);
  }, [avatarUrl]);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select(
            `
            id,
            anime_id,
            description,
            score,
            created_at
          `
          )
          .eq("profile_id", session.user.id)
          .order("created_at", { ascending: false });

        if (reviewsError) {
          console.error("Error fetching reviews:", reviewsError);
        } else {
          setReview(reviewsData || []);
        }

        const { data: favouritesData, error: favouritesError } = await supabase
          .from("favourites")
          .select(
            `
            id,
            anime_id,
            created_at
          `
          )
          .eq("profile_id", session.user.id);

        if (favouritesError) {
          console.error("Error fetching favourites:", favouritesError);
        } else {
          setFavourites(favouritesData || []);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session.user?.id) {
      fetchUserData();
    }
  }, [session.user?.id, setReview, setFavourites]);

  useEffect(() => {
    if (isConfirmModalOpen || isModalOpen || isReviewModalOpen) {
      disableScroll();
    } else {
      enableScroll();
    }

    return () => enableScroll();
  }, [isConfirmModalOpen, isModalOpen, isReviewModalOpen]);

  if (session.user === null) return;

  const data = new Date(session.user.created_at);

  const dataFormattata = data.toLocaleDateString("it-IT", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  function editProfile(event) {
    event.preventDefault();
    setIsModalOpen(true);
    setIsEditing(true);
  }

  function handleCloseModal(event) {
    event.preventDefault();
    setIsEditing(false);
    setIsModalOpen(false);
    setSelectedAvatar(avatar);
    setEditedBio(bio);
  }

  function handleCloseReviewModal() {
    setIsReviewModalOpen(false);
    setReviewAnimeId(null);
    setReviewScore(0);
    setReviewDescription("");
    setReviewAnimeTitle("");
    toast.error("Recensione annullata");
  }

  function handleConfirm(event) {
    event.preventDefault();

    const avatarToUpdate = selectedAvatar || avatar;

    if (avatarToUpdate !== avatar) {
      updateAvatar(avatarToUpdate);
      handleModifyAvatar(avatarToUpdate);
    }

    const bioToUpdate = editedBio !== "" ? editedBio : bio;
    if (bioToUpdate !== bio) {
      setBio(bioToUpdate);
      handleModifyBio(bioToUpdate);
    }

    setIsEditing(false);
    setIsModalOpen(false);
    setSelectedAvatar(null);

    toast.success("Profilo modificato!");
  }

  function handleAvatarSelection(src) {
    setSelectedAvatar(src);
  }

  async function handleAddReview() {
    if (!reviewAnimeId || reviewScore === 0) {
      toast.error("Seleziona un voto prima di confermare");
      return;
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          profile_id: session.user.id,
          anime_id: reviewAnimeId,
          description: reviewDescription || null,
          score: reviewScore,
        },
      ])
      .select();

    if (error) {
      toast.error("Azione fallita.");
    } else {
      const newReviewData = {
        id: data[0].id,
        anime_id: reviewAnimeId,
        description: reviewDescription || null,
        score: reviewScore,
        created_at: new Date().toISOString(),
      };

      setReview((prevReviews) => [...prevReviews, newReviewData]);
      toast.success("Recensione aggiunta con successo!");

      setIsReviewModalOpen(false);
      setReviewAnimeId(null);
      setReviewScore(0);
      setReviewDescription("");
      setReviewAnimeTitle("");
    }
  }

  async function toggleFavourite(anime_id, isAdd) {
    if (isAdd) {
      const { error } = await supabase.from("favourites").insert([{ profile_id: session.user.id, anime_id }]);

      if (error) {
        toast.error("Errore nell'aggiunta ai preferiti");
      } else {
        const newFavourite = { profile_id: session.user.id, anime_id, created_at: new Date().toISOString() };
        setFavourites([...favourites, newFavourite]);
        toast.success("Anime aggiunto ai preferiti");
      }
    } else {
      const { error } = await supabase.from("favourites").delete().eq("anime_id", anime_id).eq("profile_id", session.user.id);

      if (error) {
        toast.error("Errore nella rimozione dai preferiti");
      } else {
        const newFavourites = favourites.filter((fav) => fav.anime_id !== anime_id);
        setFavourites(newFavourites);
        toast.success("Anime rimosso dai preferiti");
      }
    }
  }

  async function toggleReview(anime_id, isAdd) {
    if (isAdd) {
      const animeData = getAnimeData.find((anime) => anime?.data?.mal_id === anime_id);
      if (animeData) {
        setReviewAnimeId(anime_id);
        setReviewAnimeTitle(animeData.data.title);
        setIsReviewModalOpen(true);
      } else {
        toast.error("Dati anime non disponibili");
      }
    } else {
      const reviewToRemove = review.find((rev) => rev.anime_id === anime_id);
      if (!reviewToRemove) return;

      const { error } = await supabase.from("reviews").delete().eq("id", reviewToRemove.id);

      if (error) {
        toast.error("Errore nella rimozione della recensione");
      } else {
        const newReviews = review.filter((rev) => rev.anime_id !== anime_id);
        setReview(newReviews);
        toast.success("Recensione rimossa con successo");
      }
    }
  }

  async function handleModifyBio(bio) {
    const { error } = await supabase.from("profiles").update({ user_bio: bio }).eq("id", session.user.id);

    if (error) {
      toast.error("Errore nell'aggiornamento della bio");
    }
  }

  async function handleModifyAvatar(newAvatar) {
    let { data: user, error: fetchError } = await supabase.from("profiles").select("avatar_url").eq("id", session.user.id).single();

    if (fetchError) {
      toast.error("Errore nel recupero dell'avatar.");
      return;
    }

    if (user?.avatar_url && user.avatar_url !== newAvatar) {
      const fileName = user.avatar_url.split("/").pop();

      const { error: error } = await supabase.storage.from("avatars").remove([fileName]);
    }

    const { error: updateError } = await supabase.from("profiles").update({ avatar_url: newAvatar }).eq("id", session.user.id);

    if (updateError) {
      toast.error("Errore nell'aggiornamento dell'avatar.");
    } else {
      setAvatar(newAvatar);
    }
  }

  function renderStars(score) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<Star key={i} width={16} height={16} fill={i <= score ? "yellow" : "none"} color={i <= score ? "yellow" : "white"} />);
    }
    return stars;
  }

  function renderStarSelection(score) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          width={30}
          height={30}
          fill={i <= reviewScore ? "yellow" : "none"}
          color={i <= reviewScore ? "yellow" : "white"}
          onClick={() => setReviewScore(i)}
          className={styles.starSelection}
        />
      );
    }
    return stars;
  }

  function openConfirmModal(type, id, isAdd) {
    setActionType(type);
    setActionTarget(id);
    setActionIsAdd(isAdd);
    setIsConfirmModalOpen(true);
  }

  function handleConfirmAction() {
    if (!actionTarget) {
      toast.error("Nessun elemento selezionato.");
      return;
    }

    if (actionType === "favourite") {
      toggleFavourite(actionTarget, actionIsAdd);
    } else if (actionType === "review") {
      toggleReview(actionTarget, actionIsAdd);
    }

    setIsConfirmModalOpen(false);
    setActionTarget(null);
    setActionType("");
    setActionIsAdd(false);
  }

  const isInFavourites = (animeId) => {
    return favourites.some((fav) => fav.anime_id === animeId);
  };

  const getAnimeReview = (animeId) => {
    return review.find((rev) => rev.anime_id === animeId);
  };

  const getFirstInteractionDate = (animeId) => {
    const favDate = favourites.find((f) => f.anime_id === animeId)?.created_at;
    const revDate = review.find((r) => r.anime_id === animeId)?.created_at;

    if (favDate) {
      return new Date(favDate).toLocaleDateString();
    } else if (revDate) {
      return new Date(revDate).toLocaleDateString();
    }

    return "-";
  };

  const getConfirmModalTitle = () => {
    if (actionType === "favourite") {
      return actionIsAdd ? "Conferma aggiunta" : "Conferma rimozione";
    } else {
      return actionIsAdd ? "Conferma aggiunta" : "Conferma rimozione";
    }
  };

  const getConfirmModalMessage = () => {
    if (actionType === "favourite") {
      return actionIsAdd ? "Sei sicuro di voler aggiungere questo anime ai preferiti?" : "Sei sicuro di voler rimuovere questo anime dai preferiti?";
    } else {
      return actionIsAdd ? "Sei sicuro di voler aggiungere una recensione per questo anime?" : "Sei sicuro di voler rimuovere la recensione per questo anime?";
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalBody}>
            <div className={styles.close}>
              <X height={35} width={35} color="white" onClick={handleCloseModal} />
            </div>
            <div className={styles.avatarSection}>
              <h3>Modifica Avatar</h3>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", width: "540px" }}>
                {avatars.map((el) => (
                  <button key={el} onClick={() => handleAvatarSelection(el)} className={styles.imageButton}>
                    <img src={el} className={selectedAvatar === el ? styles.selected : ""} />
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.bioSection}>
              <h3>Modifica Biografia</h3>
              <textarea value={editedBio} onChange={(e) => setEditedBio(e.target.value)} placeholder="Scrivi qualcosa su di te..." rows={4} className={styles.bioTextarea} />
            </div>
            <div className={styles.callToAction} style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
              <button className={styles.cancelButton} onClick={handleCloseModal}>
                Annulla
              </button>
              <button className={styles.confirmButton} onClick={handleConfirm}>
                Conferma
              </button>
            </div>
          </div>
        </div>
      )}

      {isReviewModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalBody}>
            <div className={styles.close}>
              <X height={35} width={35} color="white" onClick={handleCloseReviewModal} />
            </div>
            <h3>Aggiungi Recensione</h3>

            <div className={styles.starRatingSection}>
              <h4>Voto</h4>
              <div className={styles.starRating}>{renderStarSelection()}</div>
            </div>

            <div className={styles.reviewSection}>
              <h4>Recensione</h4>
              <textarea
                value={reviewDescription}
                onChange={(e) => setReviewDescription(e.target.value)}
                placeholder="Scrivi la tua recensione..."
                rows={4}
                className={styles.bioTextarea}
              />
            </div>
            <div className={styles.callToAction} style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
              <button className={styles.cancelButton} onClick={handleCloseReviewModal}>
                Annulla
              </button>
              <button className={styles.confirmButton} onClick={handleAddReview}>
                Conferma
              </button>
            </div>
          </div>
        </div>
      )}

      {isConfirmModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalBody}>
            <div className={styles.close}>
              <X height={35} width={35} color="white" onClick={() => setIsConfirmModalOpen(false)} />
            </div>
            <h3>{getConfirmModalTitle()}</h3>
            <p>{getConfirmModalMessage()}</p>
            <div className={styles.callToAction} style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
              <button className={styles.cancelButton} onClick={() => setIsConfirmModalOpen(false)}>
                Annulla
              </button>
              <button className={styles.confirmButton} onClick={handleConfirmAction}>
                Conferma
              </button>
            </div>
          </div>
        </div>
      )}

      <Banner />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.banner}></div>
          <div className={styles.avatar}>
            <img src={avatar} alt="Profile avatar" />
          </div>
          <button className={styles.edit} onClick={editProfile}>
            <UserRoundPen height={25} width={25} />
          </button>
          <div className={styles.headerBody}>
            <div style={{ display: "flex", gap: "15px", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "5px", alignItems: "center", fontSize: "22px" }}>{session.user.user_metadata.username}</div>
              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  <Mail />
                  {session.user.user_metadata.email}
                </div>
                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  <Calendar />
                  Iscritto il {dataFormattata}
                </div>
              </div>
            </div>

            <div style={{ margin: "30px 0", padding: "5px 0" }}>
              <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>{bio}</p>
            </div>
          </div>
        </div>

        <div className={styles.animeList}>
          {isDataLoading || isLoading ? (
            <p>Caricamento...</p>
          ) : error ? (
            <p>Errore: {error.message}</p>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Copertina</th>
                    <th>Titolo</th>
                    <th>Recensione</th>
                    <th>Voto</th>
                    <th>Aggiunto</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {getAnimeData.length > 0 ? (
                    getAnimeData.map((anime, index) => {
                      if (!anime) return null;
                      const animeReview = getAnimeReview(anime.data.mal_id);
                      const isFavourite = isInFavourites(anime.data.mal_id);
                      const firstInteractionDate = getFirstInteractionDate(anime.data.mal_id);

                      return (
                        <tr key={index} style={{ backgroundColor: index % 2 ? "#282C30" : "#1C2125" }}>
                          <td className={styles.coverCell}>
                            <Link to={`/detail/${anime.data.mal_id}`}>
                              <img src={anime.data.images.jpg.large_image_url} alt={anime.data.title} className={styles.coverImage} />
                            </Link>
                          </td>
                          <td>
                            <Link style={{ color: "white" }} to={`/detail/${anime.data.mal_id}`}>
                              {anime.data.title}
                            </Link>
                          </td>
                          <td className={styles.reviewDescription}>{animeReview?.description ? animeReview.description : "N/A"}</td>
                          <td>
                            <div className={styles.rating}>
                              <div className={styles.reviewScore}>{animeReview ? renderStars(animeReview.score) : "N/A"}</div>
                            </div>
                          </td>
                          <td>{firstInteractionDate}</td>
                          <td>
                            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                              <button className={styles.actionButton} onClick={() => openConfirmModal("favourite", anime.data.mal_id, !isFavourite)}>
                                <Heart fill={isFavourite ? "red" : "none"} color={isFavourite ? "red" : "white"} height={25} width={25} />
                              </button>
                              {animeReview ? (
                                <button className={styles.actionButton} onClick={() => openConfirmModal("review", anime.data.mal_id, false)}>
                                  <Star fill="gold" color="gold" height={25} width={25} />
                                </button>
                              ) : (
                                <button className={styles.actionButton} onClick={() => toggleReview(anime.data.mal_id, true)}>
                                  <Star fill="none" color="white" height={25} width={25} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: "20px 10px", color: "rgba(255, 255, 255, 0.7)" }}>
                        Non ci sono ancora anime nella tua lista...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
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

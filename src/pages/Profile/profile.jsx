import { useContext, useState, useEffect } from "react";
import styles from "./profile.module.css";
import Banner from "../../components/Banner/banner";
import { Calendar, Heart, Mail, Star, Trash2, UserRoundPen, X } from "lucide-react";
import SessionContext from "../../context/Session/SessionContext";
import FavouritesContext from "../../context/Favourites/FavouritesContext";
import ReviewsContext from "../../context/Reviews/ReviewsContext";
import { animeApi } from "../../services/api";
import { useQueries } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import supabase from "../../supabase/client";
import { Link } from "react-router";
import AvatarContext from "../../context/Avatar/AvatarContext";

const avatars = ["/media/avatar2.jpg", "/media/avatar3.jpg", "/media/avatar4.jpg", "/media/avatar5.jpg"];

export default function Profile() {
  // eslint-disable-next-line no-unused-vars
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatar, setAvatar] = useState("/media/avatarDefault.png");
  const [bio, setBio] = useState("");
  const [editedBio, setEditedBio] = useState("");
  const [isFavouritesOpened, setIsFavouritesOpened] = useState(false);
  const [isReviewOpened, setIsReviewOpened] = useState(false);
  const [userReviews, setUserReviews] = useState([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  const session = useContext(SessionContext) || { user: null };
  const { updateAvatar } = useContext(AvatarContext);

  const { favourites, setFavourites } = useContext(FavouritesContext);
  const { setReview } = useContext(ReviewsContext);

  const queryResults = useQueries({
    queries: favourites.map((fav) => ({
      queryKey: ["animeFavourites", fav.anime_id],
      queryFn: () =>
        animeApi.getAnimeData({
          animeID: fav.anime_id,
        }),
      enabled: !!fav.anime_id,
    })),
  });

  const reviewQueryResults = useQueries({
    queries: (userReviews || []).map((rev) => ({
      queryKey: ["animeReviews", rev.anime_id],
      queryFn: () =>
        animeApi.getAnimeData({
          animeID: rev.anime_id,
        }),
      enabled: !!rev.anime_id,
    })),
  });

  const getAnimeData = queryResults.map((result) => result.data);
  const getReviewAnimeData = reviewQueryResults.map((result) => result.data);
  const isLoading = queryResults.some((result) => result.isLoading);
  const isReviewDataLoading = reviewQueryResults.some((result) => result.isLoading);
  const error = queryResults.find((result) => result.error);
  const reviewError = reviewQueryResults.find((result) => result.error);

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
    const fetchUserReviews = async () => {
      setIsReviewsLoading(true);
      try {
        const { data, error } = await supabase
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

        if (error) {
          console.error("Error fetching reviews:", error);
          return;
        }

        setUserReviews(data || []);
        setReview(data || []);
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsReviewsLoading(false);
      }
    };

    if (session.user?.id && isReviewOpened) {
      fetchUserReviews();
    }
  }, [session.user?.id, isReviewOpened, setReview]);

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
    setSelectedAvatar(null);
    setEditedBio(bio);
    toast.error("Modifiche annullate");
  }

  function handleConfirm(event) {
    event.preventDefault();

    if (!selectedAvatar) {
      toast.error("Seleziona un avatar prima di confermare.");
      return;
    }

    updateAvatar(selectedAvatar);
    handleModifyAvatar(selectedAvatar);

    const bioToUpdate = editedBio !== "" ? editedBio : bio;
    setBio(bioToUpdate);
    handleModifyBio(bioToUpdate);

    setIsEditing(false);
    setIsModalOpen(false);
    setSelectedAvatar(null);
    toast.success("Profilo modificato!");
  }

  function handleAvatarSelection(src) {
    setSelectedAvatar(src);
  }

  async function handleRemoveFromFavourites(anime_id) {
    const { error } = await supabase.from("favourites").delete().eq("anime_id", anime_id).eq("profile_id", session.user.id);

    if (error) {
      toast.error("Errore nella rimozione");
    } else {
      const newFavourites = favourites.filter((fav) => fav.anime_id !== anime_id);
      setFavourites(newFavourites);
      toast.success("Anime rimosso dai preferiti");
    }
  }

  async function handleRemoveReview(review_id) {
    const { error } = await supabase.from("reviews").delete().eq("id", review_id);

    if (error) {
      toast.error("Errore nella rimozione della recensione");
    } else {
      const newReviews = userReviews.filter((rev) => rev.id !== review_id);
      setUserReviews(newReviews);
      setReview(newReviews);
      toast.success("Recensione rimossa con successo");
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

  function handleOpenInfo(button) {
    if (button === "review") {
      setIsFavouritesOpened(false);
      setIsReviewOpened(!isReviewOpened);
    } else if (button === "favourites") {
      setIsReviewOpened(false);
      setIsFavouritesOpened(!isFavouritesOpened);
    }
  }

  function renderStars(score) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<Star key={i} width={16} height={16} fill={i <= score ? "yellow" : "none"} color={i <= score ? "yellow" : "white"} />);
    }
    return stars;
  }

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
              <div>
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
            <div className={styles.callToAction}>
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
              <p>{bio}</p>
            </div>
            <div className={styles.callToAction}>
              <button onClick={() => handleOpenInfo("review")}>
                <Star />
                Recensioni
              </button>
              <button onClick={() => handleOpenInfo("favourites")}>
                <Heart />
                Preferiti
              </button>
            </div>
          </div>
        </div>

        {isFavouritesOpened && (
          <div className={styles.favourites}>
            {isLoading ? (
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
                      <th>Voto</th>
                      <th>Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getAnimeData.length > 0 ? (
                      getAnimeData.map((anime, index) => (
                        <tr key={index}>
                          <td className={styles.coverCell}>
                            <Link to={`/detail/${anime?.data.mal_id}`}>
                              <img src={anime?.data.images.jpg.large_image_url} alt={anime?.data.title} className={styles.coverImage} />
                            </Link>
                          </td>
                          <td>
                            <Link style={{ color: "white" }} to={`/detail/${anime?.data.mal_id}`}>
                              {anime?.data.title}
                            </Link>
                          </td>
                          <td>
                            <div className={styles.rating}>
                              <span className={styles.star}>
                                {anime?.data.score} <Star fill="gold" height={18} width={18} />
                              </span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                              <button className={styles.removeButton} aria-label={`Remove ${anime?.data.title}`} onClick={() => handleRemoveFromFavourites(anime.data.mal_id)}>
                                <Trash2 className={styles.trashIcon} height={25} width={25} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center", padding: "20px 10px" }}>
                          Non ci sono anime tra i tuoi preferiti...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {isReviewOpened && (
          <div className={styles.reviews}>
            {isReviewsLoading || isReviewDataLoading ? (
              <p>Caricamento...</p>
            ) : reviewError ? (
              <p>Errore: {reviewError.message}</p>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Copertina</th>
                      <th>Titolo</th>
                      <th>Recensione</th>
                      <th>Voto</th>
                      <th>Data</th>
                      <th>Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getReviewAnimeData.length > 0 ? (
                      getReviewAnimeData.map((anime, index) => {
                        const review = userReviews.find((rev) => rev.anime_id === anime?.data.mal_id);
                        return (
                          <tr key={index}>
                            <td className={styles.coverCell}>
                              <Link to={`/detail/${anime?.data.mal_id}`}>
                                <img src={anime?.data.images.jpg.large_image_url} alt={anime?.data.title} className={styles.coverImage} />
                              </Link>
                            </td>
                            <td>
                              <Link style={{ color: "white" }} to={`/detail/${anime?.data.mal_id}`}>
                                {anime?.data.title}
                              </Link>
                            </td>
                            <td className={styles.reviewDescription}>{review?.description ? review.description : "Nessuna descrizione"}</td>
                            <td>
                              <div className={styles.rating}>
                                <div className={styles.reviewScore}>{renderStars(review?.score || 0)}</div>
                              </div>
                            </td>
                            <td>{new Date(review?.created_at).toLocaleDateString()}</td>
                            <td>
                              <div style={{ display: "flex", justifyContent: "center" }}>
                                <button className={styles.removeButton} aria-label={`Remove review for ${anime?.data.title}`} onClick={() => handleRemoveReview(review?.id)}>
                                  <Trash2 className={styles.trashIcon} height={25} width={25} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center", padding: "20px 10px" }}>
                          Non hai ancora recensito alcun anime...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
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

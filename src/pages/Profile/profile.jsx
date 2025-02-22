import { useContext, useState } from "react";
import styles from "./profile.module.css";
import Banner from "../../components/Banner/banner";
import { Calendar, Heart, Mail, Star, Trash2, UserRoundPen, X } from "lucide-react";
import SessionContext from "../../context/Session/SessionContext";
import FavouritesContext from "../../context/Favourites/FavouritesContext";
import { animeApi } from "../../services/api";
import { useQueries } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import supabase from "../../supabase/client";
import { Link } from "react-router";

const avatars = ["/media/avatar2.jpg", "/media/avatar3.jpg", "/media/avatar4.jpg", "/media/avatar5.jpg"];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatar, setAvatar] = useState("/media/avatarDefault.png");
  const [bio, setBio] = useState("Nessuna descrizione ;(");
  const [editedBio, setEditedBio] = useState("");
  const [isFavourtiseOpened, setIsFavourtiseOpened] = useState(false);
  const [isReviewOpened, setIsReviewOpened] = useState(false);
  const session = useContext(SessionContext) || { user: null };

  const { favourites, setFavourites } = useContext(FavouritesContext);

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

  const getAnimeData = queryResults.map((result) => result.data);
  const isLoading = queryResults.some((result) => result.isLoading);
  const error = queryResults.find((result) => result.error);

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

    if (selectedAvatar) {
      setAvatar(selectedAvatar);
    }

    setBio(editedBio !== "" ? editedBio : bio);
    setIsEditing(false);
    setIsModalOpen(false);
    setSelectedAvatar(null);
    toast.success("Profilo modificato");
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

  function handleOpenInfo(button) {
    if (button === "review") {
      setIsFavourtiseOpened(false);
      setIsReviewOpened(!isReviewOpened);
    } else if (button === "favourites") {
      setIsReviewOpened(false);
      setIsFavourtiseOpened(!isFavourtiseOpened);
    }
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

        {isFavourtiseOpened && (
          <div className={styles.favourites}>
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error.message}</p>
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
                        <td colSpan="4" style={{ textAlign: "center", padding: "20px 10px" }}>
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

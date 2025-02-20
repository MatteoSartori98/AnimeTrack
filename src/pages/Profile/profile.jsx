import { useContext, useState } from "react";
import styles from "./profile.module.css";
import SessionContext from "../../context/SessionContext";
import { Calendar, Heart, Mail, Star, UserRoundPen, X } from "lucide-react";
import Banner from "../../components/Banner/banner";

const avatars = ["/media/avatar2.jpg", "/media/avatar3.jpg", "/media/avatar4.jpg", "/media/avatar5.jpg"];

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatar, setAvatar] = useState("/media/avatarDefault.png");
  const [bio, setBio] = useState("Scrivi qualcosa su di te....");
  const [editedBio, setEditedBio] = useState("Scrivi qualcosa su di te....");
  const user = useContext(SessionContext);

  if (user.user === null) return console.log("no user");

  const data = new Date(user.user.created_at);

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
    editedBio(bio);
  }

  function handleConfirm(event) {
    event.preventDefault();
    if (selectedAvatar) {
      setAvatar(selectedAvatar);
    }
    setBio(editedBio);
    setIsEditing(false);
    setIsModalOpen(false);
    setSelectedAvatar(null);
  }

  function handleAvatarSelection(src) {
    setSelectedAvatar(src);
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
              <div style={{ display: "flex", gap: "5px", alignItems: "center", fontSize: "22px" }}>{user.user.user_metadata.username}</div>
              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                  <Mail />
                  {user.user.user_metadata.email}
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
              <button>
                <Star />
                Recensioni
              </button>
              <button>
                <Heart />
                Preferiti
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

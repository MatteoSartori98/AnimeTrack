/* eslint-disable react/prop-types */
import { useContext, useRef, useState, useEffect } from "react";
import styles from "./liveChat.module.css";
import { ChevronDown, ChevronUp, SendHorizontal } from "lucide-react";
import supabase from "../../supabase/client";
import SessionContext from "../../context/Session/SessionContext";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

export default function LiveChat({ animeID }) {
  const { session } = useContext(SessionContext);
  const [isOpened, setIsOpened] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messageRef = useRef(null);

  useEffect(() => {
    if (!animeID) return;
    getMessages();
    const channel = supabase
      .channel("messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        getMessages();
      })
      .subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
        channel.unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeID]);

  useEffect(() => {
    scrollSmoothToBottom();
  }, [messages]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (message.length === 0) return;
    if (!session) return toast.error("Devi essere loggato per mandare un messaggio");
    const { error } = await supabase
      .from("messages")
      .insert([
        {
          profile_id: session.user.id,
          profile_username: session.user.user_metadata.username,
          anime_id: animeID,
          content: message,
        },
      ])
      .select();
    if (error) {
      toast.error("Invio non riuscito");
    }
    setMessage("");
  };

  function scrollSmoothToBottom() {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }

  async function getMessages() {
    const { data, error } = await supabase
      .from("messages")
      .select(`id, profile_id, profile_username, content, anime_id, created_at, profiles(username, avatar_url)`)
      .eq("anime_id", animeID);
    if (error) {
      return toast.error("Errore nel caricamento messaggi");
    }
    setMessages(data);
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  function handleClick() {
    setIsOpened(!isOpened);
  }

  return (
    <div className={styles.chatContainer}>
      <button onClick={handleClick}>
        <div
          className={styles.chatHeader}
          style={{
            backgroundColor: isOpened ? "#242a2f" : "#1c2125",
            borderBottom: isOpened ? "1px solid rgba(255, 255, 255, 0.1)" : "0px",
          }}
        >
          <div className={styles.headerContent}>
            <h3 className={styles.roomTitle}>Chat Live</h3>
            <p className={styles.onlineStatus}>1 online</p>
          </div>
          {isOpened ? <ChevronUp /> : <ChevronDown />}
        </div>
      </button>

      <div className={`${styles.chatContent} ${isOpened ? styles.open : ""}`}>
        {messages.length > 0 ? (
          <div className={styles.messagesArea} ref={messageRef}>
            {messages.map((message) => (
              <div key={message.id} className={styles.messageItem}>
                <img src={message.profiles.avatar_url} alt={`${message.profile_username} avatar`} className={styles.avatar} />
                <div className={styles.messageContent}>
                  <div className={styles.messageHeader}>
                    <span className={styles.username}>{message.profile_username}</span>
                  </div>
                  <p className={styles.messageText}>{message.content}</p>
                  <div className={styles.timestamp}>{formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: it })}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.messagesArea} ref={messageRef}>
            <div className={styles.messageItem}>
              <div className={styles.messageContent}>
                <p className={styles.messageText}>Non ci sono messaggi...</p>
              </div>
            </div>
          </div>
        )}

        <div className={styles.inputArea}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Scrivi messaggio..."
              className={styles.messageInput}
            />
            <button onClick={(event) => handleSendMessage(event)} className={styles.sendButton}>
              <SendHorizontal height={20} width={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import supabase from "../../supabase/client";
import { Star, TableOfContents } from "lucide-react";
import styles from "./reviews.module.css";

const Reviews = ({ animeId, newReview = null }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("reviews")
          .select(
            `
            id,
            profile_id,
            anime_id,
            description,
            score,
            created_at,
            profiles(username)
          `
          )
          .eq("anime_id", animeId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching reviews:", error);
          return;
        }

        setReviews(data || []);
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (animeId) {
      fetchReviews();
    }
  }, [animeId]);

  useEffect(() => {
    if (newReview && newReview.anime_id === animeId) {
      // Aggiungiamo la nuova recensione all'inizio dell'array (dato che le recensioni sono ordinate per data decrescente)
      setReviews((prevReviews) => [newReview, ...prevReviews]);
    }
  }, [newReview, animeId]);

  const renderStars = (score) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<Star key={i} width={16} height={16} fill={i <= score ? "yellow" : "none"} color={i <= score ? "yellow" : "white"} />);
    }
    return stars;
  };

  if (isLoading) {
    return (
      <div className={styles.reviewsContainer} style={{ color: "white" }}>
        Caricamento recensioni...
      </div>
    );
  }

  return (
    <div className={styles.reviewsContainer}>
      <div className={styles.reviewsHeader} style={{ display: "flex", gap: "5px" }}>
        <TableOfContents color="white" />
        <h3>Recensioni ( {reviews.length} )</h3>
      </div>

      {reviews.length === 0 ? (
        <div className={styles.noReviews}>Non ci sono recensioni. Fai la recensione per primo!</div>
      ) : (
        <div className={styles.reviewsList}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewerInfo}>
                  <span className={styles.reviewerName}>{review.profiles?.username || "Anonimo"}</span>
                  <span className={styles.reviewDate}>{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <div className={styles.reviewScore}>{renderStars(review.score)}</div>
              </div>
              {review.description && (
                <div className={styles.reviewContent}>
                  <p>{review.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;

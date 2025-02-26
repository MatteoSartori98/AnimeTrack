/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import SessionContext from "../Session/SessionContext";
import supabase from "../../supabase/client";
import ReviewContext from "./ReviewsContext.js";
import AvatarContext from "../Avatar/AvatarContext.js";

export default function ReviewContextProvider({ children }) {
  const { session } = useContext(SessionContext);
  const { avatarUrl } = useContext(AvatarContext);

  const [review, setReview] = useState([]);

  const readReviews = async () => {
    if (!session) return;

    let { data: review } = await supabase.from("reviews").select("profile_id , anime_id, description, score, created_at").eq("profile_id", session.user.id);
    setReview(review || []);
  };

  useEffect(() => {
    if (session) {
      readReviews();
    }
  }, [session]);

  return (
    <ReviewContext.Provider
      value={{
        review,
        setReview,
        avatarUrl,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import SessionContext from "../Session/SessionContext";
import supabase from "../../supabase/client";
import FavouriteContext from "./FavouritesContext.js";

export default function FavContextProvider({ children }) {
  const { session } = useContext(SessionContext);
  const [favourites, setFavourites] = useState([]);

  const readFavourites = async () => {
    let { data: favourites } = await supabase.from("favourites").select("profile_id , anime_title, anime_id, created_at").eq("profile_id", session.user.id);

    setFavourites(favourites);
  };

  useEffect(() => {
    if (session) {
      readFavourites();
    }
  }, [session]);

  return (
    <FavouriteContext.Provider
      value={{
        favourites,
        setFavourites,
      }}
    >
      {children}
    </FavouriteContext.Provider>
  );
}

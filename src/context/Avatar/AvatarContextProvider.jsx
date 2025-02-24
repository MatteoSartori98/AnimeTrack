/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import supabase from "../../supabase/client";
import AvatarContext from "./AvatarContext";

export default function AvatarContextProvider({ children }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
        fetchAvatarUrl(data.session.user.id);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
        fetchAvatarUrl(session.user.id);
      } else {
        setUser(null);
        setAvatarUrl(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchAvatarUrl = async (userId) => {
    if (!userId) return;

    const { data, error } = await supabase.from("profiles").select("avatar_url").eq("id", userId).single();

    if (error) {
      console.error("Error fetching avatar:", error);
      return;
    }

    setAvatarUrl(data?.avatar_url || "/media/avatarDefault.png");
  };

  const updateAvatar = (newAvatarUrl) => {
    setAvatarUrl(newAvatarUrl);
  };

  return <AvatarContext.Provider value={{ avatarUrl, updateAvatar, user }}>{children}</AvatarContext.Provider>;
}

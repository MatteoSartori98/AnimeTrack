/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import supabase from "../supabase/client";
import SessionContext from "./SessionContext";

export default function SessionContextProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
      } else if (session) {
        setSession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    async function getUserData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    }
    getUserData();
  }, [session]);

  return <SessionContext.Provider value={{ session, user }}>{children}</SessionContext.Provider>;
}

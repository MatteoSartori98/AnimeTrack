/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router";
import SessionContext from "../../context/Session/SessionContext";

const ProtectedRoute = ({ children }) => {
  const { session } = useContext(SessionContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div>Caricamento...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAppStore } from "@/store/store";
import { isAuthenticated } from "@/utils/authUtils";
import LoadingScreen from "./LoadingScreen";
import { useState, useEffect } from "react";

const PrivateRoute = ({ element }) => {
  const { user } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Short timeout to allow authentication check
    const timer = setTimeout(() => {
      const isAuth = user || isAuthenticated();
      setAuthenticated(isAuth);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [user]);

  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  // Check both user state and localStorage authentication
  if (authenticated) {
    return element;
  }

  return <Navigate to="/" />; //Redirect unauthenticated back to / (Home)
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default PrivateRoute;
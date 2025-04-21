import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAppStore } from "@/store/store";
import { isAuthenticated } from "@/utils/authUtils";

const PublicRoute = ({ element }) => {
  const { user } = useAppStore();

  // Check both user state and localStorage authentication
  if (user || isAuthenticated()) {
    return <Navigate to="/chat" />; // Redirect authenticated users to /chat
  }

  return element;
};

PublicRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default PublicRoute;

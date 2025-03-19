import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAppStore } from "@/store/store";

const PublicRoute = ({ element }) => {
  const { user } = useAppStore();

  if (user) {
    return <Navigate to="/chat" />; // Redirect authenticated users to /chat
  }

  return element;
};

PublicRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default PublicRoute;

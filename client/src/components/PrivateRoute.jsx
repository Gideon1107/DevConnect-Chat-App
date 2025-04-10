import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAppStore } from "@/store/store";

const PrivateRoute = ({ element }) => {

  const { user } = useAppStore();

  if (user) {
    return element  
  }

  return <Navigate to="/" />; //Redirect unauthenticated back to / (Home)
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default PrivateRoute;
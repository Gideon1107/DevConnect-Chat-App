import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

// Simulated authentication state (Replace with real auth logic)
const isAuthenticated = false;

const PrivateRoute = ({ element }) => {
  return isAuthenticated ? element : <Navigate to="/" />;
};

// Prop validation
PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default PrivateRoute;

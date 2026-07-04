
import { Navigate } from "react-router-dom";

const HomeRoute = () => {
  const isLoggedIn = !!localStorage.getItem("token"); // or from context/redux

  return isLoggedIn ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default HomeRoute;
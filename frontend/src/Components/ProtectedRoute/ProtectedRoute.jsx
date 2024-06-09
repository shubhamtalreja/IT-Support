import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

const ProtectedRoute = () => {
  const token = Cookies.get("token");
  const decodedToken = jwt_decode(token);
  const user = decodedToken;
  const role = user.role;

  if (role === "admin") {
    return <Outlet />;
  } else {
    return <Navigate to={"/PageNotFound"} />;
  }
};

export default ProtectedRoute;

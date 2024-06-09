import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

const ItProtectedRoute = () => {
  const token = Cookies.get("token");
  const decodedToken = jwt_decode(token);
  const user = decodedToken.role;

  const role = user;

  if (role === "it") {
    return <Outlet />;
  } else {
    return <Navigate to={"/PageNotFound"} />;
  }
};

export default ItProtectedRoute;

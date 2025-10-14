import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, roles = [] }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // If user is not logged in, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified and the user role is not included, redirect to home
  if (roles.length > 0 && !roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default PrivateRoute;

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const PrivateRoute = ({ children }: any) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

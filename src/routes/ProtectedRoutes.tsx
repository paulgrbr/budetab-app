import React from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthRole, AuthService } from "../services/authService";

interface ProtectedRouteProps {
  requiredRole: AuthRole;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
  children,
}) => {
  const isAuthorized = AuthService.isAuthorized(requiredRole);

  return (
    <Route
      render={() => (isAuthorized ? children : <Redirect to="/login" />)}
    />
  );
};

export default ProtectedRoute;

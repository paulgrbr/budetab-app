import { useIonRouter } from "@ionic/react";
import React from "react";

import { useUserStore } from "@/stores/userStore";

import { AuthRole, AuthService } from "../services/authService";
import LoadingRoute from "./LoadingRoute";

interface ProtectedRouteProps {
  requiredRole: AuthRole;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
  children,
}) => {
  const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean | null>(null);
  const router = useIonRouter();
  const { user } = useUserStore();

  React.useEffect(() => {
    AuthService.isAuthorized(requiredRole).then(setIsAuthorized);
    AuthService.isLoggedIn().then(setIsLoggedIn);
  }, [requiredRole, user]);

  React.useEffect(() => {
    const checkAuthorization = async () => {
      if (isAuthorized === false) {
        if (isLoggedIn) {
          if ((await AuthService.getRole()) === AuthRole.UNASSIGNED) {
            router.push("/waiting-room", "root");
          } else {
            router.push("/home", "root");
          }
        } else {
          router.push("/welcome", "root");
        }
      }
    };

    checkAuthorization();
  }, [isAuthorized, router]);

  if (isAuthorized === false) {
    return <LoadingRoute />;
  }

  if (isAuthorized === null) {
    return <>{children}</>; // optimistic loading
  }

  return <>{children}</>;
};

export default ProtectedRoute;

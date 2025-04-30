/* Theme variables */
import "./Mobile.css";
import "./mobile/theme/theme-ios.css";
import "./mobile/theme/theme-web.css";

import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { PushNotifications } from "@capacitor/push-notifications";
import { SplashScreen } from "@capacitor/splash-screen";
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  useIonRouter,
} from "@ionic/react";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import {
  CircleDashed,
  CircleUser,
  Clock,
  House,
  Settings2,
  Wallet,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Redirect, Route, useLocation } from "react-router";

import plusIcon from "/icons/plus.svg";

import SelectProductPage from "./mobile/pages/add-entry-pages/SelectProductPage";
import SelectUserPage from "./mobile/pages/add-entry-pages/SelectUserPage";
import AllAccountsAdminPage from "./mobile/pages/admin-pages/accounts/AllAccountsAdminPage";
import EditAccountAdminPage from "./mobile/pages/admin-pages/accounts/EditAccountAdminPage";
import AddUserAdminPage from "./mobile/pages/admin-pages/users/AddUserAdminPage";
import AllUserAdminPage from "./mobile/pages/admin-pages/users/AllUserAdminPage";
import EditUserAdminPage from "./mobile/pages/admin-pages/users/EditUserAdminPage";
import LoginPage from "./mobile/pages/auth-pages/LoginPage";
import RegisterPage from "./mobile/pages/auth-pages/RegisterPage";
import WaitingRoom from "./mobile/pages/auth-pages/WaitingRoomPage";
import WelcomePage from "./mobile/pages/auth-pages/WelcomePage";
import AddEntry from "./mobile/pages/FAB-AddEntry";
// Pages
import Home from "./mobile/pages/Tab1-Home";
import History from "./mobile/pages/Tab3-History";
import Tab4 from "./mobile/pages/Tab4";
import AdminPage from "./mobile/pages/Tab4-Admin";
import ProtectedRoute from "./routes/ProtectedRoutes";
import { AuthRole, AuthService } from "./services/authService";
import { getMyAccount, getMyUser } from "./services/dataService";
import { initServiceStore } from "./stores/serviceStore";
import { useUserStore } from "./stores/userStore";

const hapticsImpactMedium = async () => {
  await Haptics.impact({ style: ImpactStyle.Medium });
};

const hapticsImpactLight = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};

const Mobile: React.FC = () => {
  const location = useLocation();
  const {
    account,
    setAccount,
    user,
    setUser,
    assignMyProfilePictureFromCache,
    refreshMyCachedProfilePicture,
  } = useUserStore();
  const [permissions, setPermissions] = useState("none");
  const router = useIonRouter();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initServiceStore();
        await fetchImportantDataOnStart();
        await document.fonts.ready;
      } catch (error) {
        console.error("App initialization error:", error);
      } finally {
        await SplashScreen.hide();
        fetchGlobalData();
      }
    };
    initializeApp();
  }, []);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        if (await AuthService.isAuthorized(AuthRole.USER)) {
          const { value } = await SecureStoragePlugin.get({
            key: "user-permissions",
          });
          setPermissions(value);
        }
      } catch {
        console.error("Failed to fetch permissions");
      }
    };
    fetchPermissions();
  }, [user]);

  const fetchGlobalData = async () => {
    await refreshMyCachedProfilePicture();
    await assignMyProfilePictureFromCache();
  };

  const fetchImportantDataOnStart = async () => {
    await AuthService.isAuthorized(AuthRole.USER);
    if (await AuthService.isLoggedIn()) {
      const fetchedAccount = await getMyAccount();
      setAccount({ ...account, username: fetchedAccount.username });
    }
    if (await AuthService.isAuthorized(AuthRole.USER)) {
      const fetchedUser = await getMyUser();
      setUser({ ...user, ...fetchedUser });
      await assignMyProfilePictureFromCache();
    }
  };

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (notification) => {
          const route = notification.notification.data?.route;
          if (route) {
            console.log("Navigating to:", route);
            if (
              ["/home", "/history", "/tab4", "/admin"].some((path) =>
                route.includes(path)
              )
            ) {
              router.push(route, "root");
            } else {
              router.push(route, "forward");
            }
          }
        }
      );
    }
  }, []);

  // Check if the tab bar should be hidden
  const shouldHideTabBar = [
    "/add-entry/select-user",
    "/add-entry/select-product",
    "/admin/all-users",
    "/login",
    "/admin/all-accounts",
  ].includes(location.pathname);

  const notDisplayTabBar = [
    "/waiting-room",
    "/register",
    "/welcome",
    "/admin/new-user",
    "/admin/user",
    "/admin/account",
  ].some((path) => location.pathname.startsWith(path));

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/home">
          <ProtectedRoute requiredRole={AuthRole.USER}>
            <Home />
          </ProtectedRoute>
        </Route>

        <Route exact path="/add-entry">
          <ProtectedRoute requiredRole={AuthRole.USER}>
            <AddEntry />
          </ProtectedRoute>
        </Route>

        <Route exact path="/history">
          <ProtectedRoute requiredRole={AuthRole.USER}>
            <History />
          </ProtectedRoute>
        </Route>

        <Route exact path="/tab4">
          <ProtectedRoute requiredRole={AuthRole.USER}>
            <Tab4 />
          </ProtectedRoute>
        </Route>

        <Route exact path="/admin">
          <ProtectedRoute requiredRole={AuthRole.ADMIN}>
            <AdminPage />
          </ProtectedRoute>
        </Route>

        {/* Hidden Routes */}
        <Route exact path="/add-entry/select-user">
          <ProtectedRoute requiredRole={AuthRole.USER}>
            <SelectUserPage />
          </ProtectedRoute>
        </Route>

        <Route exact path="/add-entry/select-product">
          <ProtectedRoute requiredRole={AuthRole.USER}>
            <SelectProductPage />
          </ProtectedRoute>
        </Route>

        <Route exact path="/admin/all-users">
          <ProtectedRoute requiredRole={AuthRole.ADMIN}>
            <AllUserAdminPage />
          </ProtectedRoute>
        </Route>
        <Route exact path="/admin/new-user">
          <ProtectedRoute requiredRole={AuthRole.ADMIN}>
            <AddUserAdminPage />
          </ProtectedRoute>
        </Route>
        <Route exact path="/admin/user/:id">
          <ProtectedRoute requiredRole={AuthRole.ADMIN}>
            <EditUserAdminPage />
          </ProtectedRoute>
        </Route>
        <Route exact path="/admin/all-accounts">
          <ProtectedRoute requiredRole={AuthRole.ADMIN}>
            <AllAccountsAdminPage />
          </ProtectedRoute>
        </Route>
        <Route exact path="/admin/account/:id">
          <ProtectedRoute requiredRole={AuthRole.ADMIN}>
            <EditAccountAdminPage />
          </ProtectedRoute>
        </Route>

        {/* Login Pages */}
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/register">
          <RegisterPage />
        </Route>
        <Route path="/welcome">
          <WelcomePage />
        </Route>
        <Route path="/waiting-room">
          <WaitingRoom />
        </Route>

        {/* Standard Page */}
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>
      {notDisplayTabBar ? null : (
        <IonTabBar
          mode="ios"
          slot="bottom"
          className={shouldHideTabBar ? "hide-tab-bar" : "show-tab-bar"}
        >
          <IonTabButton tab="tab1" href="/home" onClick={hapticsImpactLight}>
            <House />
          </IonTabButton>

          {permissions == AuthRole.ADMIN ? (
            <IonTabButton
              tab="tab3"
              href="/history"
              onClick={hapticsImpactLight}
            >
              <Clock />
            </IonTabButton>
          ) : null}

          {permissions == AuthRole.USER ? (
            <IonTabButton tab="tab4" href="/tab4" onClick={hapticsImpactLight}>
              <Wallet />
            </IonTabButton>
          ) : null}

          {!permissions || permissions == AuthRole.UNASSIGNED ? (
            <IonTabButton>
              <CircleDashed />
            </IonTabButton>
          ) : null}

          <IonTabButton
            tab="add-entry"
            href="/add-entry"
            onClick={hapticsImpactMedium}
          >
            <IonFab vertical="bottom">
              <IonFabButton color={"light"}>
                <IonIcon icon={plusIcon}></IonIcon>
              </IonFabButton>
            </IonFab>
          </IonTabButton>

          {!permissions || permissions == AuthRole.UNASSIGNED ? (
            <IonTabButton>
              <CircleDashed />
            </IonTabButton>
          ) : null}

          {permissions == AuthRole.USER ? (
            <IonTabButton
              tab="tab3"
              href="/history"
              onClick={hapticsImpactLight}
            >
              <Clock />
            </IonTabButton>
          ) : null}

          {permissions == AuthRole.ADMIN ? (
            <IonTabButton
              tab="admin"
              href="/admin"
              onClick={hapticsImpactLight}
            >
              <Settings2 />
            </IonTabButton>
          ) : null}

          <IonTabButton tab="tab4" href="/tab4" onClick={hapticsImpactLight}>
            <CircleUser height="50px" />
          </IonTabButton>
        </IonTabBar>
      )}
    </IonTabs>
  );
};

export default Mobile;

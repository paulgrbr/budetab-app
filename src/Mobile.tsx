/* Theme variables */
import "./Mobile.css";
import "./mobile/theme/theme-ios.css";
import "./mobile/theme/theme-web.css";

import { Haptics, ImpactStyle } from "@capacitor/haptics";
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { CircleUser, Clock, House, Wallet } from "lucide-react";
import React from "react";
import { Redirect, Route, useLocation } from "react-router";

import plusIcon from "/icons/plus.svg";

import SelectProductPage from "./mobile/pages/add-entry-pages/SelectProductPage";
import SelectUserPage from "./mobile/pages/add-entry-pages/SelectUserPage";
import AddEntry from "./mobile/pages/FAB-AddEntry";
import LoginPage from "./mobile/pages/Login-Page";
// Pages
import Home from "./mobile/pages/Tab1-Home";
import History from "./mobile/pages/Tab3-History";
import Tab4 from "./mobile/pages/Tab4";
import ProtectedRoute from "./routes/ProtectedRoutes";
import { AuthRole } from "./services/authService";

const hapticsImpactMedium = async () => {
  await Haptics.impact({ style: ImpactStyle.Medium });
};

const hapticsImpactLight = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};

const Mobile: React.FC = () => {
  const location = useLocation();

  // Check if the tab bar should be hidden
  const shouldHideTabBar = [
    "/add-entry/select-user",
    "/add-entry/select-product",
  ].includes(location.pathname);

  return (
    <IonTabs>
      <IonRouterOutlet>
        <ProtectedRoute requiredRole={AuthRole.USER}>
          <Route exact path="/home">
            <Home />
          </Route>
        </ProtectedRoute>
        <Route exact path="/add-entry">
          <AddEntry />
        </Route>
        <Route path="/history">
          <History />
        </Route>
        <Route path="/tab4">
          <Tab4 />
        </Route>

        {/* Hidden Routes */}
        <Route path="/add-entry/select-user">
          <SelectUserPage />
        </Route>
        <Route path="/add-entry/select-product">
          <SelectProductPage />
        </Route>

        {/* Login Page */}
        <Route path="/login">
          <LoginPage />
        </Route>

        {/* Standard Page */}
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar
        mode="ios"
        slot="bottom"
        className={shouldHideTabBar ? "hide-tab-bar" : "show-tab-bar"}
      >
        <IonTabButton tab="tab1" href="/home" onClick={hapticsImpactLight}>
          <House />
        </IonTabButton>

        <IonTabButton tab="profile" href="/tab4" onClick={hapticsImpactLight}>
          <Wallet />
        </IonTabButton>

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

        <IonTabButton tab="tab3" href="/history" onClick={hapticsImpactLight}>
          <Clock />
        </IonTabButton>

        <IonTabButton tab="tab4" href="/tab4" onClick={hapticsImpactLight}>
          <CircleUser height="50px" />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Mobile;

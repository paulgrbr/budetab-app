/* Theme variables */
import "./Mobile.css";
import "./mobile/theme/theme-ios.css";
import "./mobile/theme/theme-web.css";

import { Haptics, ImpactStyle } from "@capacitor/haptics";
import {
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import React from "react";
import { Redirect, Route } from "react-router";

import clockIcon from "/icons/clock.svg";
import homeIcon from "/icons/home.svg";
import searchIcon from "/icons/search.svg";
import personIcon from "/icons/user.svg";

import Tab2 from "./mobile/pages/FAB-AddEntry";
// Pages
import Home from "./mobile/pages/Tab1-Home";
import Tab3 from "./mobile/pages/Tab3-History";
import Tab4 from "./mobile/pages/Tab4";

const hapticsImpactLight = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};

const Tablet: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route exact path="/home">
        <Home />
      </Route>
      <Route exact path="/tab2">
        <Tab2 />
      </Route>
      <Route path="/tab3">
        <Tab3 />
      </Route>
      <Route path="/tab4">
        <Tab4 />
      </Route>
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
    </IonRouterOutlet>
    <IonTabBar mode="ios" slot="bottom">
      <IonTabButton tab="tab1" href="/home" onClick={hapticsImpactLight}>
        <IonIcon aria-hidden="true" icon={homeIcon} />
      </IonTabButton>

      <IonTabButton tab="tab2" href="/tab2" onClick={hapticsImpactLight}>
        <IonIcon aria-hidden="true" icon={searchIcon} />
      </IonTabButton>

      <IonTabButton tab="tab3" href="/tab3" onClick={hapticsImpactLight}>
        <IonIcon aria-hidden="true" icon={clockIcon} />
      </IonTabButton>

      <IonTabButton tab="tab4" href="/tab4" onClick={hapticsImpactLight}>
        <IonIcon aria-hidden="true" icon={personIcon} />
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default Tablet;

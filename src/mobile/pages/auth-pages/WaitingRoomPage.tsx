import "./WaitingRoomPage.css";

import { SplashScreen } from "@capacitor/splash-screen";
import { Button, Skeleton, VStack } from "@chakra-ui/react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import React from "react";

import splashImageLight from "/splash-image-light-rotated-2.webp";
import splashImageDark from "/splash-image-rotated.webp";
import { AuthRole, AuthService } from "@/services/authService";
import { useServiceStore } from "@/stores/serviceStore";
import { useUserStore } from "@/stores/userStore";

const WaitingRoomPage: React.FC = () => {
  const router = useIonRouter();
  const account = useUserStore((state) => state.account);
  const { activeService } = useServiceStore();

  React.useEffect(() => {
    const checkLoggedIn = async () => {
      console.debug("Check login");
      if (!(await AuthService.isLoggedIn())) {
        router.push("/welcome", "root");
      } else {
        if (await AuthService.isAuthorized(AuthRole.USER)) {
          router.push("/home", "root");
        }
      }
    };
    checkLoggedIn();
  }, []);

  const darkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const splashImage = darkMode ? splashImageDark : splashImageLight;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="title-header waitingroom-page-bg">
          <IonTitle>BudeTab</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar></IonToolbar>
        </IonHeader>
        <div className="waitingroom-page-splash-container">
          <img className="waitingroom-page-splash-image" src={splashImage} />
        </div>
        <div className="ion-padding waitingroom-page-text">
          <VStack>
            <Skeleton
              loading={!account.username}
              variant="shine"
              minWidth="20ch"
            >
              <h2 className="waitingroom-page-title">
                Hallo, {account.username}! 👋
              </h2>
            </Skeleton>
            <p className="waitingroom-page-subtitle">Willkommen bei BudeTab</p>
            <div style={{ height: "2.5rem" }} />

            <p
              style={{
                color: "var(--light-whitespace-a40)",
                fontSize: "16px",
              }}
            >
              Sieht aus als wärst du neu hier! Aktuell ist dein Account noch
              nicht mit einem Nutzer verbunden.
            </p>
            <div />
            <p className="waitingroom-page-highlight-text">
              Wir haben die Administratoren von “{activeService.baseName}”
              informiert, um dich freizuschalten.
            </p>
            <div />
            <p
              style={{
                color: "var(--light-whitespace-a40)",
                fontSize: "16px",
              }}
            >
              Wir benachrichtigen dich, wenn dies erledigt ist. Bitte melde dich
              anschließend erneut an!
            </p>
            <div style={{ height: "3rem" }} />
            <Button
              size="lg"
              variant="solid"
              className="button-primary-style"
              onClick={async () => {
                SplashScreen.show({ autoHide: false });
                try {
                  await AuthService.logout();
                } finally {
                  router.push("/welcome", "root");
                  window.location.reload();
                  window.addEventListener("load", () => {
                    SplashScreen.hide();
                  });
                }
              }}
            >
              Ausloggen
            </Button>
          </VStack>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default WaitingRoomPage;

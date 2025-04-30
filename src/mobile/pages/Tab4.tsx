import { SplashScreen } from "@capacitor/splash-screen";
import { Button } from "@chakra-ui/react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import React from "react";

import { AuthService } from "@/services/authService";

const Tab4: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 4</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 4</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Button
          colorScheme="blue"
          size="sm"
          onClick={async () => {
            SplashScreen.show({ autoHide: false });
            await AuthService.logout();
            router.push("/welcome", "root");
            window.location.reload();
            window.addEventListener("load", () => {
              SplashScreen.hide();
            });
          }}
        >
          Logout
        </Button>
      </IonContent>
    </IonPage>
  );
};

export default Tab4;

import "./WelcomePage.css";

import { Button, HStack } from "@chakra-ui/react";
import { IonContent, IonPage, IonTitle, useIonRouter } from "@ionic/react";
import React, { useEffect } from "react";
import Marquee from "react-fast-marquee";

import { getAllApiServices } from "@/services/centralServiceAxiosInstance";
import { useServiceStore } from "@/stores/serviceStore";

import { AuthRole, AuthService } from "../../../services/authService";

const WelcomePage: React.FC = () => {
  const router = useIonRouter();
  const { setServices, setActiveService } = useServiceStore();

  useEffect(() => {
    const checkLoginStatus = async () => {
      if (await AuthService.isLoggedIn()) {
        console.debug("User already logged-in");
        if (await AuthService.isAuthorized(AuthRole.USER)) {
          router.push("/home", "root");
        } else {
          router.push("/waiting-room", "root");
        }
      }
    };

    const checkBackendServices = async () => {
      const services = await getAllApiServices();
      setServices(services);
      if (services.length == 1) {
        console.debug("Setting active service to", services[0]);
        await setActiveService(services[0]);
      }
    };

    checkBackendServices();
    checkLoginStatus();
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="welcome-page-container">
          <div
            className="ion-padding"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            <IonTitle size="large" className="welcome-page-title">
              Willkommen <br />
              bei BudeTab
            </IonTitle>
          </div>
          <div className="welcome-page-splash-container">
            <Marquee speed={10} gradient={false} direction="left">
              {Array.from({ length: 8 }).map((_, index) => (
                <img
                  style={{ margin: "5px 10px", pointerEvents: "none" }}
                  key={index}
                  src={`splash-tiles/dark/tile${index + 1}.png`}
                  className="welcome-page-splash-tile"
                />
              ))}
            </Marquee>
            <Marquee speed={10} gradient={false} direction="right">
              {Array.from({ length: 8 }).map((_, index) => (
                <img
                  style={{ margin: "5px 10px", pointerEvents: "none" }}
                  key={index}
                  src={`splash-tiles/dark/tile${8 - index}.png`}
                  className="welcome-page-splash-tile"
                />
              ))}
            </Marquee>
          </div>
          <div className="ion-padding welcome-page-buttons">
            <HStack wrap="nowrap" justifyContent="space-between">
              <Button
                size="lg"
                width="48%"
                variant="solid"
                onClick={() => {
                  router.push("/register", "forward");
                }}
                className="button-primary-style"
              >
                Registrieren
              </Button>
              <Button
                size="lg"
                width="48%"
                variant="outline"
                borderRadius="10px"
                onClick={() => {
                  router.push("/login", "forward");
                }}
                className="button-secondary-style"
              >
                Einloggen
              </Button>
            </HStack>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default WelcomePage;

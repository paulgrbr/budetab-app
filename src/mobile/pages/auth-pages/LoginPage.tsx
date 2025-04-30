import "../../../global.css";
import "./LoginPage.css";

import { Capacitor } from "@capacitor/core";
import { Haptics, NotificationType } from "@capacitor/haptics";
import { Keyboard } from "@capacitor/keyboard";
import {
  Button,
  createListCollection,
  Field,
  Input,
  Portal,
  Select,
  Span,
  Stack,
  VStack,
} from "@chakra-ui/react";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import React, { useEffect, useMemo, useRef, useState } from "react";

import splashImageLight from "/splash-image-light-rotated-2.webp";
import splashImageDark from "/splash-image-rotated.webp";
import { PasswordInput } from "@/components/ui/password-input";
import { ApiServer } from "@/models/account";
import { getAllApiServices } from "@/services/centralServiceAxiosInstance";
import { getMyAccount, getMyUser } from "@/services/dataService";
import { initPushNotifications } from "@/services/fcmService";
import { useServiceStore } from "@/stores/serviceStore";
import { useUserStore } from "@/stores/userStore";

import {
  AuthRole,
  AuthService,
  ResponseCode,
} from "../../../services/authService";

const LoginPage: React.FC = () => {
  const {
    account,
    setAccount,
    user,
    setUser,
    assignMyProfilePictureFromCache,
    refreshMyCachedProfilePicture,
  } = useUserStore();
  const { services, setActiveService, setServices } = useServiceStore();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [selectedService, setSelectedService] = useState<ApiServer | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [inputIsSelected, setInputIsSelected] = useState<boolean>(false);
  const [inputError, setInputError] = useState<{
    username: string;
    password: string;
    selected: string;
  }>({
    username: "",
    password: "",
    selected: "",
  });
  const secondInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const keyboardShowListener = Keyboard.addListener("keyboardDidShow", () => {
      // Wait a moment for the keyboard to finish its animation, then scroll
      setInputIsSelected(true);
      setTimeout(() => {
        const targetElement = document.getElementById("login");
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 200);
    });
    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setTimeout(() => {
        setInputIsSelected(false);
      }, 1000);
    });
    return () => {
      keyboardShowListener.then((listener) => listener.remove());
      keyboardHideListener.then((listener) => listener.remove());
    };
  }, []);

  const [present] = useIonToast();
  const router = useIonRouter();

  const hapticsSuccess = async () => {
    await Haptics.notification({ type: NotificationType.Success });
  };

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
      if (services.length === 0) {
        const services = await getAllApiServices();
        setServices(services);
        if (services.length == 1) {
          console.debug("Setting active service to", services[0]);
          await setActiveService(services[0]);
        }
      }
    };

    checkBackendServices();
    checkLoginStatus();
  }, []);

  const fetchGlobalData = async () => {
    const fetchedAccount = await getMyAccount();
    setAccount({
      ...account,
      username: fetchedAccount.username,
    });
    if (await AuthService.isAuthorized(AuthRole.USER)) {
      const fetchedUser = await getMyUser();
      setUser({ ...user, ...fetchedUser });
      await refreshMyCachedProfilePicture();
      await assignMyProfilePictureFromCache();
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setInputError({ username: "", password: "", selected: "" });

    try {
      if (services?.length > 1) {
        if (selectedService) {
          await setActiveService(selectedService);
        } else {
          setInputError({
            ...inputError,
            selected: "Du musst eine Gruppe auswählen",
          });
          setLoading(false);
          return;
        }
      }
      const response = await AuthService.login(username, password);
      if (response == ResponseCode.SUCCESS) {
        console.log("Login successful");
        fetchGlobalData();
        hapticsSuccess();
        if (Capacitor.isNativePlatform()) {
          initPushNotifications();
        }
        if (await AuthService.isAuthorized(AuthRole.USER)) {
          router.push("/home", "root");
        } else {
          console.debug("User has no assigned role");
          router.push("/waiting-room", "root");
        }
      } else if (response == ResponseCode.UNAUTHORIZED) {
        console.log("Login failed");
        present({
          message: "Login fehlgeschlagen",
          duration: 1500,
          position: "top",
          cssClass: "custom-toast-error",
          swipeGesture: "vertical",
        });
        setInputError({
          ...inputError,
          username: "Benutzername inkorrekt",
          password: "Passwort inkorrekt",
        });
      } else {
        present({
          message: "Ein Fehler ist aufgetreten",
          duration: 1500,
          position: "top",
          cssClass: "custom-toast-error",
          swipeGesture: "vertical",
        });
      }
    } catch (error) {
      console.log("Error", error);
      present({
        message: "Ein unbekannter Fehler ist aufgetreten",
        duration: 1500,
        position: "top",
        cssClass: "custom-toast-error",
        swipeGesture: "vertical",
      });
    } finally {
      setLoading(false);
    }
  };

  const serviceCollection = useMemo(() => {
    return createListCollection({
      items:
        services?.sort((a, b) => a.baseName.localeCompare(b.baseName)) ?? [],
      itemToString: (service) => service.baseName,
      itemToValue: (service) => service.identifier,
    });
  }, [services]);

  const darkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const splashImage = darkMode ? splashImageDark : splashImageLight;

  return (
    <IonPage id="top">
      <IonHeader>
        <IonToolbar className="title-header login-page-bg">
          <IonButtons slot="start" style={{ paddingLeft: "12px" }}>
            <IonBackButton
              text="Zurück"
              className="login-page-back-button"
            ></IonBackButton>
          </IonButtons>
          <IonTitle>Anmelden</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar></IonToolbar>
        </IonHeader>
        <div
          className="login-page-splash-container"
          style={{ top: services?.length === 1 ? "-14vh" : "-18vh" }}
        >
          <img className="login-page-splash-image" src={splashImage} />
        </div>
        <div className="ion-padding login-page-form">
          <VStack>
            <h3 className="login-page-title">Willkommen zurück! 👋</h3>
            <p>Bei BudeTab anmelden</p>
          </VStack>
          <br />
          <VStack padding={1}>
            {services?.length > 1 ? (
              <>
                <p className="login-page-input-label">Tab-Gruppe</p>
                <Field.Root invalid={inputError.selected != ""}>
                  <Select.Root
                    collection={serviceCollection}
                    size="lg"
                    width="full"
                    variant="outline"
                    className="select-style"
                    onValueChange={(value) => {
                      setSelectedService(
                        services?.find(
                          (service) =>
                            service.identifier === String(value.value)
                        ) ?? null
                      );
                    }}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Gruppe wählen" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content
                          width="80vw"
                          maxHeight={"30vh"}
                          className="select-style-list"
                        >
                          {serviceCollection.items.map((service) => (
                            <Select.Item
                              item={service}
                              key={service.identifier}
                              _selected={{
                                bg: "var(--select-selected-item-bg)",
                                color: "var(--select-selected-item-color)",
                              }}
                            >
                              <Stack gap="0">
                                <Select.ItemText>
                                  {service.baseName}
                                </Select.ItemText>
                                <Span color="fg.muted" textStyle="xs">
                                  {service.identifier}
                                </Span>
                              </Stack>
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                  <Field.ErrorText>{inputError.selected}</Field.ErrorText>
                </Field.Root>
              </>
            ) : null}
            <p className="login-page-input-label">Benutzername</p>
            <Field.Root invalid={inputError.username != ""}>
              <Input
                placeholder="Benutzername eingeben"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                size="lg"
                focusRingColor="#7900ff"
                autoCapitalize="off"
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(),
                  secondInputRef.current && secondInputRef.current.focus())
                }
              />
              <Field.ErrorText>{inputError.username}</Field.ErrorText>
            </Field.Root>
            <p className="login-page-input-label">Passwort</p>
            <Field.Root invalid={inputError.password != ""}>
              <PasswordInput
                placeholder="Passwort eingeben"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                size="lg"
                focusRingColor="#7900ff"
                ref={secondInputRef}
              />
              <Field.ErrorText>{inputError.password}</Field.ErrorText>
            </Field.Root>
            <br id="login" />
            <Button
              size="lg"
              variant="solid"
              onClick={handleLogin}
              loading={loading}
              disabled={
                !username ||
                !password ||
                !(selectedService || services.length === 1)
              }
              className="button-primary-style"
            >
              Log In
            </Button>
            <p
              className="login-page-link"
              onClick={() => {
                router.push("/register", "forward");
              }}
            >
              Einen Account erstellen
            </p>
          </VStack>
        </div>
        <div
          style={{
            height: inputIsSelected ? "130vh" : "0px",
            transition: "500ms",
          }}
        ></div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;

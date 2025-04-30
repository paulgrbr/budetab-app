import "./AllUserAdminPage.css";
import "@/Mobile.css";

import { ActionSheet, ActionSheetButtonStyle } from "@capacitor/action-sheet";
import { Capacitor } from "@capacitor/core";
import { Haptics, NotificationType } from "@capacitor/haptics";
import {
  Avatar,
  Box,
  Button,
  FileUpload,
  HStack,
  Input,
  SegmentGroup,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { Camera, Hourglass, ShieldUser, Upload, User } from "lucide-react";
import React, { useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import PictureCropper from "@/components/PictureCropper";
import { CheckboxCard } from "@/components/ui/checkbox-card";
import {
  RadioCardItem,
  RadioCardLabel,
  RadioCardRoot,
} from "@/components/ui/radio-card";
import { PriceRanking } from "@/models/user";
import { AuthRole } from "@/services/authService";
import {
  deleteUser,
  updateUser,
  uploadProfilePicture,
} from "@/services/dataService";
import { useAllUsersStore } from "@/stores/usersStore";
import { useUserStore } from "@/stores/userStore";

interface FileAcceptDetails {
  files: File[];
}

const EditUserAdminPage: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { users, setReloadUsersChange } = useAllUsersStore();
  const { user } = useUserStore();
  const activeUser = users.find((u) => u.userId === id);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);

  const history = useHistory();

  const translateRank = (rank: string) => {
    switch (rank) {
      case "Mitglied":
        return "member";
      case "Stammtisch":
        return "regular";
      case "Extern":
        return "external";

      case "member":
        return "Mitglied";
      case "regular":
        return "Stammtisch";
      case "external":
        return "Extern";
      default:
        return rank;
    }
  };

  const [newUser, setNewUser] = useState<{
    firstName: string | null;
    lastName: string | null;
    rank: PriceRanking;
    permissions: AuthRole;
    isTemporary: boolean;
  }>({
    firstName: activeUser?.firstName || "",
    lastName: activeUser?.lastName || "",
    rank: activeUser?.priceRanking || "external",
    permissions: activeUser?.permissions as AuthRole,
    isTemporary: activeUser?.isTemporary || false,
  });
  const [profilePicture, setProfilePicture] = useState<string>(
    activeUser?.profilePicture ?? ""
  );

  const secondInputRef = useRef<HTMLInputElement>(null);
  const [present] = useIonToast();

  const formatName = (name: string | null) => {
    return name
      ? name.trim().charAt(0).toUpperCase() + name.trim().slice(1)
      : "";
  };

  const hapticsSuccess = async () => {
    await Haptics.notification({ type: NotificationType.Success });
  };

  const handleFileAccept = (f: FileAcceptDetails) => {
    const file = f.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setRawImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    setShowCropper(true);
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      present({
        message: "Nur .jpg und .png erlaubt",
        duration: 1500,
        position: "top",
        cssClass: "custom-toast-error",
        swipeGesture: "vertical",
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      present({
        message: "Dateien nur bis 10MB",
        duration: 1500,
        position: "top",
        cssClass: "custom-toast-error",
        swipeGesture: "vertical",
      });
      return;
    }
  };

  const handleUpdateUser = async () => {
    setLoading(true);
    try {
      if (activeUser) {
        const response = await updateUser(activeUser?.userId, {
          firstName: formatName(newUser.firstName),
          lastName: formatName(newUser.lastName),
          isTemporary: newUser.isTemporary,
          priceRanking: newUser.rank,
          permissions: newUser.permissions,
        });

        if (response) {
          present({
            message: "Nutzer erfolgreich gespeichert",
            duration: 1500,
            position: "top",
            cssClass: "custom-toast-success",
            swipeGesture: "vertical",
          });
          setLoading(false);
          hapticsSuccess();
          setReloadUsersChange(true);
          await new Promise((resolve) => setTimeout(resolve, 500));
          history.goBack();
          try {
            if (profilePicture) {
              await uploadProfilePicture(activeUser.userId, profilePicture);
            }
          } catch {
            setTimeout(() => {
              present({
                message: "Speichern des Profilbilds fehlgeschlagen",
                duration: 3000,
                position: "top",
                cssClass: "custom-toast-error",
                swipeGesture: "vertical",
              });
            }, 2000);
          }
        }
      }
    } catch (error) {
      console.error("Error while updating user", error);
      present({
        message: "Ein Fehler ist aufgetreten",
        duration: 1500,
        position: "top",
        cssClass: "custom-toast-error",
        swipeGesture: "vertical",
      });
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setLoadingDelete(true);
    try {
      if (activeUser) {
        const response = await deleteUser(activeUser?.userId);

        if (response) {
          present({
            message: "Nutzer erfolgreich gelöscht",
            duration: 1500,
            position: "top",
            cssClass: "custom-toast-success",
            swipeGesture: "vertical",
          });
          setLoadingDelete(false);
          hapticsSuccess();
          setReloadUsersChange(true);
          await new Promise((resolve) => setTimeout(resolve, 500));
          history.goBack();
        }
      }
    } catch (error) {
      console.error("Error while deleting user", error);
      present({
        message: "Ein Fehler ist aufgetreten",
        duration: 1500,
        position: "top",
        cssClass: "custom-toast-error",
        swipeGesture: "vertical",
      });
      setLoadingDelete(false);
    }
  };

  const handleDeleteUserConfirmation = async () => {
    const isNativePlatform = Capacitor.isNativePlatform();

    if (isNativePlatform) {
      const result = await ActionSheet.showActions({
        options: [
          {
            title: "Nutzer löschen",
            style: ActionSheetButtonStyle.Destructive,
          },
          {
            title: "Abbrechen",
            style: ActionSheetButtonStyle.Cancel,
          },
        ],
      });

      if (result.index === 0) {
        handleDeleteUser();
      }
      return;
    } else {
      setDeleteConfirmModalOpen(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="title-header">
          <IonButtons slot="start" style={{ paddingLeft: "12px" }}>
            <IonBackButton
              text="Zurück"
              defaultHref="../../admin/all-users"
            ></IonBackButton>
          </IonButtons>
          <IonTitle>Nutzer bearbeiten</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="new-user-admin-page-bg">
        <IonHeader collapse="condense">
          <IonToolbar>
            <div className="header ion-padding  new-user-admin-page-bg">
              <span>
                <h3 style={{ color: "var(--light-primary-a10)" }}>
                  <b>
                    {newUser.firstName || newUser.lastName
                      ? newUser.firstName + " " + newUser.lastName
                      : "Neuer Nutzer"}
                  </b>
                </h3>
              </span>
              <span>
                <Avatar.Root
                  size="2xl"
                  colorPalette="purple"
                  variant="subtle"
                  onClick={() => setOpenModal(true)}
                >
                  <Avatar.Fallback>
                    <Camera />
                  </Avatar.Fallback>
                  <Avatar.Image src={profilePicture}></Avatar.Image>
                </Avatar.Root>
              </span>
            </div>
          </IonToolbar>
        </IonHeader>
        <div className="new-user-admin-content ion-padding">
          <p className="admin-page-input-label" style={{ marginTop: 0 }}>
            Name
          </p>

          <p className="admin-page-input-label2">Vorname</p>
          <Input
            placeholder="Vorname"
            value={newUser.firstName ?? ""}
            onChange={(e) =>
              setNewUser({ ...newUser, firstName: e.target.value })
            }
            autoComplete="fname"
            id="fname"
            name="fname"
            size="lg"
            focusRingColor="#7900ff"
            autoCapitalize="on"
            onKeyDown={(e) =>
              e.key === "Enter" &&
              (e.preventDefault(),
              secondInputRef.current && secondInputRef.current.focus())
            }
          />
          <p className="admin-page-input-label2">Nachname</p>

          <Input
            placeholder="Nachname"
            value={newUser.lastName ?? ""}
            onChange={(e) =>
              setNewUser({ ...newUser, lastName: e.target.value })
            }
            autoComplete="lname"
            id="lname"
            name="lname"
            size="lg"
            focusRingColor="#7900ff"
            ref={secondInputRef}
            autoCapitalize="on"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (secondInputRef.current) {
                  secondInputRef.current.blur();
                }
              }
            }}
          />
          <p className="admin-page-input-label">Rang </p>
          <SegmentGroup.Root
            value={translateRank(newUser.rank || "")}
            onValueChange={(e) =>
              setNewUser({
                ...newUser,
                rank: translateRank(e.value || "") as PriceRanking,
              })
            }
            width="full"
            orientation="horizontal"
          >
            <SegmentGroup.Indicator backgroundColor="var(--light-primary-a40)" />
            <SegmentGroup.Items
              items={["Mitglied", "Stammtisch", "Extern"]}
              width="full"
              _checked={{
                color: "#FFFFFF",
              }}
            />
          </SegmentGroup.Root>
          <div style={{ height: "10px" }}></div>

          <p className="admin-page-input-label3">
            Welche Preise sollen berechnet werden?
          </p>

          <p className="admin-page-input-label">Berechtigungen</p>
          <RadioCardRoot
            colorPalette="purple"
            defaultValue={newUser.permissions}
            disabled={id == user.userId}
          >
            <RadioCardLabel />
            <RadioCardItem
              value={"user"}
              label="Standart Nutzer"
              icon={<User />}
              onChange={() =>
                setNewUser({ ...newUser, permissions: "user" as AuthRole })
              }
            />
            <RadioCardItem
              value={"admin"}
              label="Admin Nutzer"
              icon={<ShieldUser />}
              onChange={() =>
                setNewUser({
                  ...newUser,
                  permissions: "admin" as AuthRole,
                  isTemporary: false,
                })
              }
            />
          </RadioCardRoot>

          <p className="admin-page-input-label">Erweiterte Einstellungen</p>
          <CheckboxCard
            label="Temporärer Nutzer"
            icon={<Hourglass />}
            checked={newUser.isTemporary}
            onClick={(e) => {
              if (newUser.permissions != "admin") {
                setNewUser({
                  ...newUser,
                  isTemporary: (e.target as HTMLInputElement).checked,
                });
              }
            }}
            disabled={newUser.permissions == "admin"}
            colorPalette="purple"
            description="Temporäre Nutzer werden für einzelne Events vergeben und nach Abzahlung der Schulden gelöscht "
          />
          <p className="admin-page-input-label">Aktionen</p>
          <VStack gap="1rem">
            <p className="admin-page-input-label3">
              Lösche den Nutzeraccount und alle Einträge des Nutzers
            </p>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                handleDeleteUserConfirmation();
              }}
              loading={loadingDelete}
              disabled={id == user.userId}
              className="button-tertiary-style admin-page-delete"
            >
              Nutzer löschen
            </Button>
          </VStack>
          <div style={{ height: "3rem" }}></div>

          <Button
            size="lg"
            variant="solid"
            onClick={() => {
              handleUpdateUser();
            }}
            loading={loading}
            disabled={!newUser.firstName || !newUser.lastName}
            className="button-primary-style admin-page-submit"
          >
            Speichern
          </Button>
        </div>

        <IonAlert
          isOpen={deleteConfirmModalOpen}
          header="Nutzer löschen?"
          subHeader="Möchtest du wirklich diesen Nutzer löschen?"
          message={
            newUser.firstName +
            " wird gelöscht und alle Einträge des Nutzers werden entfernt"
          }
          buttons={[
            {
              text: "Abbrechen",
              role: "cancel",
            },
            {
              text: "Löschen",
              role: "confirm",
              handler: () => {
                handleDeleteUser();
              },
            },
          ]}
          onDidDismiss={() => setDeleteConfirmModalOpen(false)}
          backdropDismiss={true}
          className="ion-alert"
          translucent={true}
        ></IonAlert>

        <IonModal ref={modal} isOpen={openModal}>
          <IonHeader>
            <IonToolbar className="title-header modal-toolbar">
              <IonButtons slot="start" className="modal-buttons">
                <IonButton
                  onClick={() => {
                    setOpenModal(false);
                    setCroppedImage(null);
                    setShowCropper(false);
                    setRawImage(null);
                  }}
                >
                  Abbrechen
                </IonButton>
              </IonButtons>
              <IonTitle>Profilbild</IonTitle>
              <IonButtons slot="end" className="modal-buttons">
                <IonButton
                  strong={true}
                  onClick={() => {
                    setOpenModal(false);
                    setProfilePicture(croppedImage ?? "");
                    setCroppedImage(null);
                    setShowCropper(false);
                    setRawImage(null);
                  }}
                  disabled={showCropper}
                >
                  Speichern
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding modal-content">
            <div>
              <Tabs.Root
                defaultValue="upload"
                variant="enclosed"
                maxW="md"
                size="sm"
                fitted
              >
                <Tabs.List
                  width="full"
                  borderRadius="14px"
                  colorPalette="purple"
                  className="new-user-admin-page-tab-list"
                >
                  <Tabs.Trigger
                    borderRadius="10px"
                    value="upload"
                    _selected={{
                      color: "#ad66fd",
                      backgroundColor: "var(--tab-background-color)",
                    }}
                  >
                    Bild hochladen
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    borderRadius="10px"
                    value="avatar"
                    _selected={{
                      color: "#ad66fd",
                      backgroundColor: "var(--tab-background-color)",
                    }}
                    disabled
                  >
                    Avatar wählen
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="upload" height="100%">
                  <div style={{ height: "0.5rem" }} />
                  <h4>Eigenes Bild hochladen</h4>
                  <p className="admin-page-input-label3">
                    Wähle ein Profilbild aus deiner Galerie
                  </p>
                  <div style={{ height: "1rem" }} />
                  {showCropper && rawImage ? (
                    <PictureCropper
                      imageUrl={rawImage}
                      onCropComplete={setCroppedImage}
                      hideSelf={() => setShowCropper(false)}
                    />
                  ) : croppedImage ? (
                    <HStack justifyContent="center">
                      <img
                        src={croppedImage}
                        alt="Cropped"
                        className="new-user-admin-page-pp-preview"
                        onClick={() => setShowCropper(true)}
                      />
                    </HStack>
                  ) : (
                    <FileUpload.Root
                      maxW="xl"
                      alignItems="stretch"
                      maxFiles={1}
                      onFileAccept={(f) => {
                        handleFileAccept(f);
                      }}
                    >
                      <FileUpload.HiddenInput />
                      <FileUpload.Dropzone backgroundColor="var(--dark-primary-a90)">
                        <Upload />
                        <FileUpload.DropzoneContent>
                          <Box>Profilbild hochladen</Box>
                          <Box color="fg.muted">.png, .jpg bis 10MB</Box>
                        </FileUpload.DropzoneContent>
                      </FileUpload.Dropzone>
                    </FileUpload.Root>
                  )}
                </Tabs.Content>
                <Tabs.Content value="avatar"></Tabs.Content>
              </Tabs.Root>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default EditUserAdminPage;

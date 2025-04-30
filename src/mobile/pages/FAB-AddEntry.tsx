import "./FAB-AddEntry.css";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { ListPlus, UserPlus, Users } from "lucide-react";
import React, { useEffect, useState } from "react";

import arrowRightLight from "/icons/arrow-right-light.svg";
import UniversalMenuItem from "@/components/UniversialMenuItem";
import { AuthRole } from "@/services/authService";
import { useUserStore } from "@/stores/userStore";

const AddEntry: React.FC = () => {
  const [permissions, setPermissions] = useState("none");
  const { user } = useUserStore();

  useEffect(() => {
    const initializePage = async () => {
      const { value } = await SecureStoragePlugin.get({
        key: "user-permissions",
      });
      setPermissions(value);
    };
    initializePage();
  }, []);

  const router = useIonRouter();
  return (
    <IonPage>
      <IonContent fullscreen className="entry-page-bg">
        <IonHeader>
          <IonToolbar className="title-header entry-page-bg">
            <IonTitle>Neuer Eintrag</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="entry-page-container ion-padding">
          <div
            className="entry-page-me-button"
            style={{ animationDuration: "0.4s" }}
          >
            <span>
              <div className="entry-page-me-avatar">
                {user.profilePicture != "" ? (
                  <img src={user.profilePicture} />
                ) : (
                  <p>{user.firstName.charAt(0) + user.lastName.charAt(0)}</p>
                )}
              </div>
              <p>Für dich eintragen</p>
            </span>
            <img src={arrowRightLight} />
          </div>
          <UniversalMenuItem
            title={"Für jemand anderen eintragen"}
            subtitle={"auf der Liste"}
            icon={<UserPlus />}
            onClick={() => router.push("/add-entry/select-user", "forward")}
            animationDuration={0.5}
          />
          <UniversalMenuItem
            title={"Für mehrere eintragen"}
            subtitle={"auf der Liste"}
            icon={<Users />}
            onClick={() => router.push("/add-entry/select-product", "forward")}
            animationDuration={0.6}
          />
          {permissions == AuthRole.ADMIN ? (
            <UniversalMenuItem
              title={"Abrechnung eintragen"}
              subtitle={"Abzahlung/Transaktionen buchen"}
              icon={<ListPlus />}
              onClick={() => router.push("/add-entry/select-user", "forward")}
              animationDuration={0.7}
              lightIconPrimary="#ab650f"
              lightIconSecondary="#ffd68a"
              darkIconPrimary="#ffd68a"
              darkIconSecondary="#63440b"
            />
          ) : null}
          <div style={{ height: "1rem" }} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AddEntry;

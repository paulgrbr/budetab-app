import "./FAB-AddEntry.css";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { UserPlus, Users } from "lucide-react";
import React from "react";

import arrowRightLight from "/icons/arrow-right-light.svg";
import UniversalMenuItem from "@/components/UniversialMenuItem";

const AddEntry: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage>
      <IonContent fullscreen class="entry-page-bg">
        <IonHeader>
          <IonToolbar className="title-header" class="entry-page-bg">
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
                <img src="/profile.png" />
                {/* <p>PG</p> */}
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
          <div style={{ height: "1rem" }} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AddEntry;

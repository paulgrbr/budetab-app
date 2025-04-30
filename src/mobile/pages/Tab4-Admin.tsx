import "./Tab4-Admin.css";

import { Skeleton } from "@chakra-ui/react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import {
  Layers2,
  ListCheck,
  ListPlus,
  Martini,
  Smartphone,
  Users,
  Wallet,
} from "lucide-react";
import React, { CSSProperties } from "react";

import WalletImg from "/icons/wallet.svg";
import UniversalMenuItem from "@/components/UniversialMenuItem";

const AdminPage: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="title-header">
          <IonTitle>Verwaltung</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <div className="header ion-padding">
              <span>
                <IonTitle size="large">Verwaltung</IonTitle>
                <p className="subtitle"></p>
              </span>
            </div>
            <div style={{ height: "1rem" }} />
          </IonToolbar>
        </IonHeader>
        <div className="ion-padding admin-page-bg">
          <div className="balance-card" style={{ backgroundColor: "#a8824f" }}>
            <span>
              <b>
                <p className="balance-card-title">Alle Kontostände</p>
              </b>
              <span className="balance-card-last-payment-title">
                <p>Offene Schulden:</p>
                <b>
                  <Skeleton
                    loading={true}
                    variant="shine"
                    style={
                      {
                        "--start-color": "#7a5a30",
                        "--end-color": "#8E6E43",
                      } as CSSProperties
                    }
                  >
                    <p>Vor 2 Wochen</p>
                  </Skeleton>
                </b>
              </span>
            </span>
            <br />
            <span>
              <span className="balance-card-wallet-icon-container">
                <img className="balance-card-wallet-icon" src={WalletImg} />
              </span>
              <Skeleton
                loading={true}
                variant="shine"
                style={
                  {
                    "--start-color": "#7a5a30",
                    "--end-color": "#8E6E43",
                  } as CSSProperties
                }
              >
                <p className="balance-card-balance">€ 23,23</p>
              </Skeleton>
            </span>
          </div>
          <div style={{ height: "1rem" }} />

          <p className="admin-page-category">Buchungen</p>
          <UniversalMenuItem
            title={"Transaktion hinzufügen"}
            subtitle={
              "Abzahlung oder andere Transaktionen für einen Nutzer buchen"
            }
            icon={<ListPlus />}
            onClick={() => router.push("/add-entry/select-user", "forward")}
            animationDuration={0}
            lightIconPrimary="#ab650f"
            lightIconSecondary="#ffd68a"
            darkIconPrimary="#ffd68a"
            darkIconSecondary="#63440b"
          />
          <UniversalMenuItem
            title={"Kontostände"}
            subtitle={"Kontostände aller Nutzer einsehen"}
            icon={<Wallet />}
            onClick={() => router.push("/add-entry/select-user", "forward")}
            animationDuration={0}
            lightIconPrimary="#ab650f"
            lightIconSecondary="#ffd68a"
            darkIconPrimary="#ffd68a"
            darkIconSecondary="#63440b"
          />
          <UniversalMenuItem
            title={"Alle Listenbuchungen"}
            subtitle={"Alle Listenbuchungen verwalten"}
            icon={<ListCheck />}
            onClick={() => router.push("/add-entry/select-user", "forward")}
            animationDuration={0}
            lightIconPrimary="#ab650f"
            lightIconSecondary="#ffd68a"
            darkIconPrimary="#ffd68a"
            darkIconSecondary="#63440b"
          />
          <div style={{ height: "1rem" }} />
          <p className="admin-page-category">Nutzer</p>
          <UniversalMenuItem
            title={"Alle Nutzer"}
            subtitle={"Alle aktiven Nutzer verwalten"}
            icon={<Users />}
            onClick={() => router.push("/admin/all-users", "forward")}
            animationDuration={0}
            lightIconPrimary="#0b5580"
            lightIconSecondary="#98d3f5"
            darkIconPrimary="#19abff"
            darkIconSecondary="#0b4363"
          />
          <div style={{ height: "1rem" }} />
          <p className="admin-page-category">Account</p>
          <UniversalMenuItem
            title={"Alle App-Accounts"}
            subtitle={"Alle BudeTab Accounts verwalten"}
            icon={<Smartphone />}
            onClick={() => router.push("/admin/all-accounts", "forward")}
            animationDuration={0}
            lightIconPrimary="#0b5580"
            lightIconSecondary="#98d3f5"
            darkIconPrimary="#19abff"
            darkIconSecondary="#0b4363"
          />
          <div style={{ height: "1rem" }} />
          <p className="admin-page-category">Produkte</p>
          <UniversalMenuItem
            title={"Alle Produkte"}
            subtitle={"Alle Produkte verwalten"}
            icon={<Martini />}
            onClick={() => router.push("/add-entry/select-user", "forward")}
            animationDuration={0}
            lightIconPrimary="#4e0b85"
          />
          <UniversalMenuItem
            title={"Produkt-Kategorien"}
            subtitle={"Kategorien verwalten und erstellen"}
            icon={<Layers2 />}
            onClick={() => router.push("/add-entry/select-user", "forward")}
            animationDuration={0}
          />
          <div style={{ height: "8rem" }} />
          <div className="admin-page-tabbar-blocker" />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdminPage;

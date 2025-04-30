import "./Tab1-Home.css";

import { Avatar, Skeleton } from "@chakra-ui/react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from "@ionic/react";
import React, { CSSProperties, useState } from "react";

import Wallet from "/icons/wallet.svg";
import { getMyUser } from "@/services/dataService";
import { useUserStore } from "@/stores/userStore";

const Home: React.FC = () => {
  const {
    user,
    refreshMyCachedProfilePicture,
    assignMyProfilePictureFromCache,
    setUser,
  } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  async function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setIsLoading(true);
    const fetchedUser = await getMyUser();
    setUser({ ...user, ...fetchedUser });
    await refreshMyCachedProfilePicture();
    await assignMyProfilePictureFromCache();
    setIsLoading(false);
    event.detail.complete();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="title-header">
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollEvents={true}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar>
            <div className="header ion-padding">
              <span>
                <IonTitle size="large">Willkommen</IonTitle>
                <Skeleton
                  loading={!(user.firstName && user.lastName) || isLoading}
                  variant="shine"
                  width="20ch"
                >
                  <h3 className="subtitle">
                    {user.firstName && user.lastName
                      ? user.firstName + " " + user.lastName
                      : "NoName"}
                  </h3>
                </Skeleton>
              </span>
              <Avatar.Root size="xl" colorPalette="purple" variant="subtle">
                <Avatar.Fallback
                  name={
                    user.firstName && user.lastName
                      ? user.firstName + " " + user.lastName
                      : ""
                  }
                />
                <Avatar.Image src={user.profilePicture} />
              </Avatar.Root>
            </div>
          </IonToolbar>
        </IonHeader>
        <div className="ion-padding">
          <div className="balance-card">
            <span>
              <b>
                <p className="balance-card-title">Dein Kontostand</p>
              </b>
              <span className="balance-card-last-payment-title">
                <p>Letzte Zahlung:</p>
                <b>
                  <Skeleton
                    loading={true}
                    variant="shine"
                    style={
                      {
                        "--start-color": "#7c47fc",
                        "--end-color": "#9867f9",
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
                <img className="balance-card-wallet-icon" src={Wallet} />
              </span>
              <Skeleton
                loading={true}
                variant="shine"
                style={
                  {
                    "--start-color": "#7c47fc",
                    "--end-color": "#9867f9",
                  } as CSSProperties
                }
              >
                <p className="balance-card-balance">€ 23,23</p>
              </Skeleton>
            </span>
          </div>
          <br />
          <div>
            <h4>Aktionen</h4>
          </div>
        </div>
        <div className="home-content-section ion-padding">
          <h4>Zusammenfassung</h4>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;

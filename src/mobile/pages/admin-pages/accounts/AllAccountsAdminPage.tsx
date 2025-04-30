import "./AllAccountsAdminPage.css";
import "@/Mobile.css";

import { Input } from "@chakra-ui/react";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
  useIonViewWillEnter,
} from "@ionic/react";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

import { InputGroup } from "@/components/ui/input-group";
import {
  getAllAccounts,
  getAllAccountSessions,
  getAllUsers,
} from "@/services/dataService";
import { useAllAccountsStore } from "@/stores/accountsStore";
import { useAllUsersStore } from "@/stores/usersStore";

import AccountsList from "./AccountsList";

const AllAccountsAdminPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    accounts,
    setAccounts,
    setReloadAccountsChange,
    getReloadAccountsChange,
    assignAccountSessions,
  } = useAllAccountsStore();
  const {
    users,
    setUsers,
    assignProfilePicturesFromCache,
    refreshCachedProfilePictures,
  } = useAllUsersStore();

  const fetchUsers = async () => {
    if (users.length === 0) {
      const users = await getAllUsers();
      setUsers(users);
    }
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoading(true);
      await fetchUsers();
      if (accounts.length === 0) {
        const accounts = await getAllAccounts();
        setAccounts(accounts);
      }
      setIsLoading(false);
      await assignProfilePicturesFromCache();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await refreshCachedProfilePictures();
      await assignProfilePicturesFromCache();

      const accountSessions = await getAllAccountSessions();
      assignAccountSessions(accountSessions);
    };

    fetchAccounts();
  }, []);

  async function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setIsLoading(true);
    await fetchUsers();
    const accounts = await getAllAccounts();
    setAccounts(accounts);
    const accountSessions = await getAllAccountSessions();
    assignAccountSessions(accountSessions);
    setIsLoading(false);
    event.detail.complete();
  }

  useIonViewWillEnter(() => {
    if (getReloadAccountsChange()) {
      handleRefresh(
        new CustomEvent<RefresherEventDetail>("ionRefresh", {
          detail: { complete: () => {} },
        })
      );
      setReloadAccountsChange(false);
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="title-header">
          <IonButtons slot="start" style={{ paddingLeft: "12px" }}>
            <IonBackButton text="Zurück"></IonBackButton>
          </IonButtons>
          <IonTitle>Alle Accounts</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="all-accounts-admin-page-bg">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar>
            <div className="header ion-padding  all-accounts-admin-page-bg">
              <span>
                <IonTitle size="large">Alle Accounts</IonTitle>
                <p className="subtitle"></p>
              </span>
            </div>
          </IonToolbar>
        </IonHeader>
        <div className="all-accounts-admin-content ion-padding">
          <InputGroup
            flex="1"
            endElement={<Search height="20px" />}
            width="100%"
          >
            <Input
              placeholder="Suchen..."
              focusRingColor="#7900ff"
              type="search"
              inputMode="search"
              enterKeyHint="done"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  (e.target as HTMLInputElement).blur(); // Close keyboard
                }
              }}
            />
          </InputGroup>
          <div style={{ height: "5px" }}></div>
          <AccountsList
            accounts={accounts}
            loading={isLoading}
            searchTerm={searchTerm}
            urlPrefix={"/admin"}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AllAccountsAdminPage;

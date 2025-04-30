import "./SelectUserPage.css";
import "../../../Mobile.css";

import { Input, Tabs } from "@chakra-ui/react";
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
} from "@ionic/react";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

import { InputGroup } from "@/components/ui/input-group";
import { getAllUsers } from "@/services/dataService";
import { useAllUsersStore } from "@/stores/usersStore";

import UserList from "./users/UserList";

const SelectUserPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { users, setUsers } = useAllUsersStore();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      if (users.length === 0) {
        const users = await getAllUsers();
        setUsers(users);
      }
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  async function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setIsLoading(true);
    const users = await getAllUsers();
    setUsers(users);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    event.detail.complete();
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="title-header">
          <IonButtons slot="start" style={{ paddingLeft: "12px" }}>
            <IonBackButton text="Zurück"></IonBackButton>
          </IonButtons>
          <IonTitle>Nutzer wählen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="select-user-page-bg">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar>
            <div className="header ion-padding  select-user-page-bg">
              <span>
                <IonTitle size="large">Für wen?</IonTitle>
                <p className="subtitle"></p>
              </span>
            </div>
          </IonToolbar>
        </IonHeader>
        <div className="select-user-content ion-padding">
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
          <Tabs.Root
            defaultValue="all"
            variant="enclosed"
            maxW="md"
            size="sm"
            fitted
          >
            <Tabs.List width="full" borderRadius="14px" colorPalette="purple">
              <Tabs.Trigger
                borderRadius="10px"
                value="all"
                _selected={{ color: "#ad66fd" }}
              >
                Alle
              </Tabs.Trigger>
              <Tabs.Trigger
                borderRadius="10px"
                value="bude"
                _selected={{ color: "#ad66fd" }}
              >
                Bude
              </Tabs.Trigger>
              <Tabs.Trigger
                borderRadius="10px"
                value="stammtisch"
                _selected={{ color: "#ad66fd" }}
              >
                Stammtisch
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="all">
              <UserList
                selectable={false}
                users={users}
                loading={isLoading}
                searchTerm={searchTerm}
              />
            </Tabs.Content>
            <Tabs.Content value="bude">
              <UserList
                selectable={false}
                priceRanking="member"
                users={users}
                loading={isLoading}
                searchTerm={searchTerm}
              />
            </Tabs.Content>
            <Tabs.Content value="stammtisch">
              <UserList
                selectable={false}
                priceRanking="regular"
                users={users}
                loading={isLoading}
                searchTerm={searchTerm}
              />
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SelectUserPage;

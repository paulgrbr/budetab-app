import "./AllUserAdminPage.css";
import "@/Mobile.css";

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
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import { Search, UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";

import { InputGroup } from "@/components/ui/input-group";
import UniversalMenuItem from "@/components/UniversialMenuItem";
import UserList from "@/mobile/pages/add-entry-pages/users/UserList";
import { getAllUsers } from "@/services/dataService";
import { useAllUsersStore } from "@/stores/usersStore";

const AllUserAdminPage: React.FC = () => {
  const router = useIonRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    users,
    setUsers,
    assignProfilePicturesFromCache,
    refreshCachedProfilePictures,
    setReloadUsersChange,
    getReloadUsersChange,
  } = useAllUsersStore();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      if (users.length === 0) {
        const users = await getAllUsers();
        setUsers(users);
      }
      await assignProfilePicturesFromCache();
      setIsLoading(false);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await refreshCachedProfilePictures();
      await assignProfilePicturesFromCache();
    };

    fetchUsers();
  }, []);

  async function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setIsLoading(true);
    const users = await getAllUsers();
    setUsers(users);
    await refreshCachedProfilePictures();
    await assignProfilePicturesFromCache();
    setIsLoading(false);
    event.detail.complete();
  }

  useIonViewWillEnter(() => {
    if (getReloadUsersChange()) {
      handleRefresh(
        new CustomEvent<RefresherEventDetail>("ionRefresh", {
          detail: { complete: () => {} },
        })
      );
      setReloadUsersChange(false);
    }
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="title-header">
          <IonButtons slot="start" style={{ paddingLeft: "12px" }}>
            <IonBackButton text="Zurück" defaultHref="/admin"></IonBackButton>
          </IonButtons>
          <IonTitle>Alle Nutzer</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="all-user-admin-page-bg">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar>
            <div className="header ion-padding  all-user-admin-page-bg">
              <span>
                <IonTitle size="large">Alle Nutzer</IonTitle>
                <p className="subtitle"></p>
              </span>
            </div>
          </IonToolbar>
        </IonHeader>
        <div className="all-user-admin-content ion-padding">
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
              <UniversalMenuItem
                title={"Nutzer hinzufügen"}
                subtitle={""}
                icon={<UserPlus />}
                onClick={() => {
                  router.push("/admin/new-user", "forward");
                }}
                animationDuration={0}
                lightIconPrimary="#0b5580"
                lightIconSecondary="#98d3f5"
                darkIconPrimary="#19abff"
                darkIconSecondary="#0b4363"
              />
              <div style={{ height: "5px" }}></div>
              <UserList
                selectable={false}
                users={users}
                loading={isLoading}
                searchTerm={searchTerm}
                urlPrefix={"/admin"}
              />
            </Tabs.Content>
            <Tabs.Content value="bude">
              <UserList
                selectable={false}
                priceRanking="member"
                users={users}
                loading={isLoading}
                searchTerm={searchTerm}
                urlPrefix={"/admin"}
              />
            </Tabs.Content>
            <Tabs.Content value="stammtisch">
              <UserList
                selectable={false}
                priceRanking="regular"
                users={users}
                loading={isLoading}
                searchTerm={searchTerm}
                urlPrefix={"/admin"}
              />
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AllUserAdminPage;

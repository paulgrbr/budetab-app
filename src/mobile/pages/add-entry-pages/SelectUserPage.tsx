import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import "./SelectUserPage.css";
import { Input, Tabs } from "@chakra-ui/react";
import { InputGroup } from "@/components/ui/input-group";
import { Search } from "lucide-react";

import "../../../Mobile.css";
import UserList from "./users/UserList";

const SelectUserPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="title-header">
          <IonButtons slot="start" style={{ paddingLeft: "12px" }}>
            <IonBackButton text="Zurück"></IonBackButton>
          </IonButtons>
          <IonTitle>Benutzer wählen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="select-user-page-bg">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large" className="ion-padding select-user-page-bg">
              Für wen?
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="user-page-content ion-padding">
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
              <UserList selectable={false} />
            </Tabs.Content>
            <Tabs.Content value="bude">
              <UserList selectable={false} priceRanking="member" />
            </Tabs.Content>
            <Tabs.Content value="stammtisch">
              <UserList selectable={false} priceRanking="regular" />
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SelectUserPage;

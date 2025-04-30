import "@/Mobile.css";
import "./AllAccountsAdminPage.css";

import { ActionSheet, ActionSheetButtonStyle } from "@capacitor/action-sheet";
import { Capacitor } from "@capacitor/core";
import { Haptics, NotificationType } from "@capacitor/haptics";
import { Keyboard } from "@capacitor/keyboard";
import {
  Accordion,
  Avatar,
  Box,
  Button,
  createListCollection,
  HStack,
  Icon,
  Input,
  Portal,
  Select,
  Stack,
  Table,
  VStack,
} from "@chakra-ui/react";
import {
  IonAlert,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import Fuse from "fuse.js";
import {
  Globe,
  LogOut,
  Search,
  Smartphone,
  SquareAsterisk,
  Trash,
} from "lucide-react";
import { DateTime } from "luxon";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router";

import { InputGroup } from "@/components/ui/input-group";
import { User } from "@/models/user";
import {
  linkAccountToUser,
  terminateAllAccountSessionsForAccount,
  terminateSpecificAccountSession,
} from "@/services/dataService";
import { useAllAccountsStore } from "@/stores/accountsStore";
import { useAllUsersStore } from "@/stores/usersStore";

const EditAccountAdminPage: React.FC = () => {
  const { users } = useAllUsersStore();
  const { accounts, setReloadAccountsChange } = useAllAccountsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState({
    save: false,
    delete: false,
    logout: false,
  });
  const [confirmationModal, setConfirmationModal] = useState({
    open: false,
    header: "",
    subHeader: "",
    message: "",
    onConfirm: () => {},
  });

  const currentAccount = useMemo(() => {
    return accounts.find((account) => account.username === id);
  }, [id, accounts]);

  useEffect(() => {
    if (currentAccount) {
      const linkedUser = users.find(
        (user) => user.userId === currentAccount.linkedUserId
      );
      setSelectedUser(linkedUser || null);
    }
  }, [currentAccount, users]);

  const availableUsers = useMemo(() => {
    const alreadyLinkedUserIds = accounts
      .filter((account) => account.linkedUserId !== null)
      .map((account) => account.linkedUserId);
    return users.filter(
      (user) =>
        !alreadyLinkedUserIds.includes(user.userId) ||
        currentAccount?.linkedUserId === user.userId
    );
  }, [users, accounts]);

  // Fuse.js search logic
  const fuse = new Fuse(availableUsers, {
    keys: [
      "firstName",
      "lastName",
      {
        name: "combinedName",
        getFn: (user) => `${user.firstName} ${user.lastName}`,
      },
    ],
    threshold: 0.3, // Adjust for search sensitivity
  });

  const searchResults = searchTerm
    ? fuse.search(searchTerm).map((result) => result.item)
    : availableUsers;

  const groupedUsers = useMemo(() => {
    return searchResults.map((user) => {
      const firstLetter = user.firstName.charAt(0).toUpperCase();
      const group = /^[A-F]/.test(firstLetter)
        ? "A-F"
        : /^[G-K]/.test(firstLetter)
        ? "G-K"
        : /^[L-P]/.test(firstLetter)
        ? "L-P"
        : /^[Q-Z]/.test(firstLetter)
        ? "Q-Z"
        : "#"; // Non-alphabetical entries
      return { ...user, group };
    });
  }, [searchResults]);

  const serviceCollection = useMemo(() => {
    return createListCollection({
      items: groupedUsers.sort((a, b) =>
        a.firstName.localeCompare(b.firstName)
      ),
      itemToString: (user) => `${user.firstName} ${user.lastName} - verknüpft`,
      itemToValue: (user) => user.userId,
    });
  }, [groupedUsers]);

  const groupsWithEntries = useMemo(() => {
    const groups = groupedUsers.reduce((acc, user) => {
      acc[user.group] = acc[user.group] || [];
      acc[user.group].push(user);
      return acc;
    }, {} as Record<string, typeof groupedUsers>);

    return Object.entries(groups)
      .sort(([groupA], [groupB]) =>
        groupA === "#" ? 1 : groupB === "#" ? -1 : groupA.localeCompare(groupB)
      )
      .map(([groupName, users]) => ({
        groupName,
        items: users,
      }));
  }, [groupedUsers]);

  const items = currentAccount?.sessions?.length
    ? currentAccount.sessions.map((session) => ({
        value: session.tokenId,
        icon: session.device == "iPhone" ? <Smartphone /> : <Globe />,
        title: session.device + " - " + session.browser,
        ipAddress: session.ipAddress,
        lastLogin: session.timeCreated,
        browser: session.browser,
        originId: session.originId,
      }))
    : [
        {
          value: "no-sessions",
          icon: <Globe />,
          title: "Keine aktiven Sessions",
          ipAddress: "N/A",
          lastLogin: null,
          browser: "N/A",
          originId: "",
        },
      ];

  const hapticsSuccess = async () => {
    await Haptics.notification({ type: NotificationType.Success });
  };
  const history = useHistory();

  const [present] = useIonToast();

  const handleSaveChanges = async () => {
    setLoading({ ...loading, save: true });
    try {
      if (currentAccount?.publicId && selectedUser?.userId) {
        const response = await linkAccountToUser(
          currentAccount.publicId,
          selectedUser?.userId
        );

        if (response) {
          present({
            message: "Account erfolgreich verknüpft",
            duration: 1500,
            position: "top",
            cssClass: "custom-toast-success",
            swipeGesture: "vertical",
          });
          setLoading({ ...loading, save: false });
          hapticsSuccess();
          setReloadAccountsChange(true);
          await new Promise((resolve) => setTimeout(resolve, 500));
          history.goBack();
        }
      }
    } catch (error) {
      console.error("Error while linking account", error);
      present({
        message: "Ein Fehler ist aufgetreten",
        duration: 1500,
        position: "top",
        cssClass: "custom-toast-error",
        swipeGesture: "vertical",
      });
      setLoading({ ...loading, save: false });
    }
  };

  const handleTerminateSession = async (originId: string) => {
    setLoading({ ...loading, logout: true });
    try {
      if (currentAccount?.publicId) {
        const response = await terminateSpecificAccountSession(
          currentAccount.publicId,
          originId
        );

        if (response) {
          present({
            message: "Session beendet. Nutzer wird in Kürze abgemeldet...",
            duration: 1500,
            position: "top",
            cssClass: "custom-toast-success",
            swipeGesture: "vertical",
          });
          setLoading({ ...loading, logout: false });
          hapticsSuccess();
          setReloadAccountsChange(true);
          await new Promise((resolve) => setTimeout(resolve, 500));
          history.goBack();
        }
      }
    } catch (error) {
      console.error("Error terminating a specific session", error);
      present({
        message: "Ein Fehler ist aufgetreten",
        duration: 1500,
        position: "top",
        cssClass: "custom-toast-error",
        swipeGesture: "vertical",
      });
      setLoading({ ...loading, logout: false });
    }
  };

  const handleTerminateAllSessionsConfirmation = async () => {
    const isNativePlatform = Capacitor.isNativePlatform();

    if (isNativePlatform) {
      const result = await ActionSheet.showActions({
        options: [
          {
            title: "Alle Sessions abmelden",
            style: ActionSheetButtonStyle.Destructive,
          },
          {
            title: "Abbrechen",
            style: ActionSheetButtonStyle.Cancel,
          },
        ],
      });

      if (result.index === 0) {
        handleTerminateAllSessions();
      }
      return;
    } else {
      setConfirmationModal({
        open: true,
        header: "Alle Sessions abmelden",
        subHeader: "Bist du sicher?",
        message:
          "Möchtest du alle Sessions abmelden? Dies wird alle aktiven Sessions des Nutzers abmelden.",
        onConfirm: () => {
          handleTerminateAllSessions();
        },
      });
    }
  };

  const handleTerminateAllSessions = async () => {
    setLoading({ ...loading, logout: true });
    try {
      if (currentAccount?.publicId) {
        const response = await terminateAllAccountSessionsForAccount(
          currentAccount.publicId
        );

        if (response) {
          present({
            message: "Sessions beendet. Nutzer wird in Kürze abgemeldet...",
            duration: 1500,
            position: "top",
            cssClass: "custom-toast-success",
            swipeGesture: "vertical",
          });
          setLoading({ ...loading, logout: false });
          hapticsSuccess();
          setReloadAccountsChange(true);
          await new Promise((resolve) => setTimeout(resolve, 500));
          history.goBack();
        }
      }
    } catch (error) {
      console.error("Error terminating account sessions", error);
      present({
        message: "Ein Fehler ist aufgetreten",
        duration: 1500,
        position: "top",
        cssClass: "custom-toast-error",
        swipeGesture: "vertical",
      });
      setLoading({ ...loading, logout: false });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="title-header">
          <IonButtons slot="start" style={{ paddingLeft: "12px" }}>
            <IonBackButton text="Zurück"></IonBackButton>
          </IonButtons>
          <IonTitle>Account bearbeiten</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="all-accounts-admin-page-bg">
        <IonHeader collapse="condense">
          <IonToolbar>
            <div className="header ion-padding  all-accounts-admin-page-bg">
              <span>
                <h3 style={{ color: "var(--light-primary-a10)" }}>
                  <b>
                    {selectedUser
                      ? currentAccount?.username +
                        " - (" +
                        selectedUser.firstName +
                        " " +
                        selectedUser.lastName +
                        ")"
                      : currentAccount?.username + " - (Nicht verknüpft)"}
                  </b>
                </h3>
              </span>
            </div>
          </IonToolbar>
        </IonHeader>
        <div className="ion-padding edit-account-admin-page-container">
          <p className="admin-page-input-label" style={{ marginTop: 0 }}>
            Verknüpfter Listennutzer
          </p>
          <Select.Root
            collection={serviceCollection}
            size="lg"
            width="full"
            variant="outline"
            className="select-style"
            value={selectedUser?.userId ? [selectedUser.userId] : []}
            onValueChange={(value) => {
              setSelectedUser(
                users?.find((user) => user.userId === String(value.value)) ??
                  null
              );
            }}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Nutzer verknüpfen" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content
                  width="92vw"
                  maxHeight={"45vh"}
                  className="select-style-list"
                >
                  <Box
                    px={3}
                    py={2}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        Keyboard.hide();
                      }
                      e.stopPropagation();
                    }}
                  >
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
                      />
                    </InputGroup>
                  </Box>
                  {groupsWithEntries.map((group) => (
                    <Select.ItemGroup key={group.groupName}>
                      <Select.ItemGroupLabel fontSize={"14px"} margin={0}>
                        {group.groupName}
                      </Select.ItemGroupLabel>
                      {group.items.map((user) => (
                        <Select.Item
                          item={user}
                          key={user.userId}
                          _selected={{
                            bg: "var(--select-selected-item-bg)",
                            color: "var(--select-selected-item-color)",
                          }}
                          justifyContent="flex-start"
                          gap="15px"
                        >
                          <Avatar.Root size="xs" colorPalette="purple">
                            <Avatar.Image src={user.profilePicture} />
                            <Avatar.Fallback
                              name={user.firstName + " " + user.lastName}
                            />
                          </Avatar.Root>
                          {user.firstName + " " + user.lastName}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.ItemGroup>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>

          <p className="admin-page-input-label">Aktive Sessions</p>
          <Stack width="full">
            <Accordion.Root collapsible variant="enclosed">
              {items.map((item) => (
                <Accordion.Item
                  key={item.value}
                  value={item.value}
                  className="accordion-primary-style"
                >
                  <Accordion.ItemTrigger>
                    <HStack padding={"10px"}>
                      <Icon fontSize="lg" color="fg.subtle">
                        {item.icon}
                      </Icon>
                      <p className="admin-page-accordion-title">{item.title}</p>
                    </HStack>
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent>
                    <Accordion.ItemBody>
                      <Table.Root size="md" striped>
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell>
                              <b>IP: </b>
                            </Table.Cell>
                            <Table.Cell>
                              <p>{item.ipAddress}</p>
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>
                              <b>Anmeldung: </b>
                            </Table.Cell>
                            <Table.Cell>
                              <p>
                                {item.lastLogin
                                  ? DateTime.fromHTTP(
                                      item.lastLogin
                                    ).toLocaleString(DateTime.DATETIME_MED)
                                  : "N/A"}
                              </p>
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.Cell>
                              <b>Origin: </b>
                            </Table.Cell>
                            <Table.Cell>
                              <p>{item.browser}</p>
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table.Root>
                      <br />
                      <Button
                        size="lg"
                        variant="outline"
                        className="button-primary-style"
                        onClick={() => {
                          handleTerminateSession(item.originId);
                        }}
                        loading={loading.logout}
                      >
                        <LogOut></LogOut>
                        Gerät abmelden
                      </Button>
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </Stack>
          <VStack>
            <p className="admin-page-input-label">Aktionen</p>
            <VStack gap={0} width="full">
              <Button
                size="lg"
                variant="outline"
                className="button-tertiary-style top"
                loading={loading.logout}
                onClick={() => {
                  handleTerminateAllSessionsConfirmation();
                }}
              >
                <LogOut></LogOut>
                Alle abmelden
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="button-tertiary-style bottom admin-page-delete"
              >
                <Trash></Trash>
                Account löschen
              </Button>
            </VStack>
            <p className="admin-page-input-label3">
              Lösche den Account - der lokale Nutzer bleibt weiterhin erhalten
            </p>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {}}
              className="button-tertiary-style"
            >
              <SquareAsterisk></SquareAsterisk>
              Password zurücksetzen
            </Button>
            <p className="admin-page-input-label3">
              Setze das Passwort des Nutzers auf &quot;BudeBerkach2025&quot;
              zurück
            </p>
          </VStack>
          <div style={{ height: "80px" }} />
          <div className="edit-account-admin-page-buttons-container">
            <Button
              size="lg"
              variant="outline"
              className="button-primary-style"
              onClick={() => {
                handleSaveChanges();
              }}
              loading={loading.save}
            >
              Speichern
            </Button>
          </div>
        </div>
        <IonAlert
          isOpen={confirmationModal.open}
          header={confirmationModal.header}
          subHeader={confirmationModal.subHeader}
          message={confirmationModal.message}
          buttons={[
            {
              text: "Abbrechen",
              role: "cancel",
            },
            {
              text: "Bestätigen",
              role: "confirm",
              handler: () => {
                confirmationModal.onConfirm();
              },
            },
          ]}
          onDidDismiss={() =>
            setConfirmationModal({ ...confirmationModal, open: false })
          }
          backdropDismiss={true}
          className="ion-alert"
          translucent={true}
        ></IonAlert>
      </IonContent>
    </IonPage>
  );
};

export default EditAccountAdminPage;

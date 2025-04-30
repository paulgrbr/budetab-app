import "./SelectProductPage.css";
import "../../../Mobile.css";

import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Button, Input, Tabs } from "@chakra-ui/react";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Search } from "lucide-react";
import React, { useState } from "react";

import ProductItemBig from "@/components/ProductItemBig";
import { InputGroup } from "@/components/ui/input-group";

const SelectProductPage: React.FC = () => {
  const hapticsImpactLight = async () => {
    await Haptics.impact({ style: ImpactStyle.Light });
  };
  const tabCategories = ["Alles", "Bier", "Wein", "Alkoholfrei"];
  const [amount, setAmount] = useState(0);

  const increaseAmount = () => {
    hapticsImpactLight();
    setAmount(amount + 1);
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="title-header">
          <IonButtons slot="start" style={{ paddingLeft: "12px" }}>
            <IonBackButton text="Zurück"></IonBackButton>
          </IonButtons>
          <IonTitle>Produkte wählen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large" className="ion-padding">
              Getränke
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="product-page-content">
          <div
            className="ion-padding"
            style={{ paddingTop: "0", paddingBottom: "0" }}
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
                className="select-product-page-search"
              />
            </InputGroup>
          </div>
          <Tabs.Root defaultValue="alles" variant="enclosed" size="sm">
            <div
              style={{
                overflowX: "auto",
                paddingTop: "5px",
                paddingBottom: "10px",
              }}
              className="ion-padding"
            >
              <Tabs.List
                width={`calc(${tabCategories.reduce(
                  (acc, category) => acc + category.length,
                  0
                )}ch + ${tabCategories.length - 1} * 5px)`}
                minWidth="100%"
                borderRadius="14px"
                colorPalette="purple"
                justifyContent="space-between"
                className="select-product-page-tab-list"
              >
                {tabCategories.map((category, index) => (
                  <Tabs.Trigger
                    key={index}
                    borderRadius="10px"
                    padding="0 20px"
                    minWidth={category.length + "ch"}
                    marginRight="0 5px"
                    value={category.toLowerCase()}
                    _selected={{
                      color: "var(--product-page-selected-tab-color)",
                      backgroundColor:
                        "var(--product-page-selected-tab-background-color)",
                    }}
                    className="select-product-page-tab-trigger"
                  >
                    {category}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </div>
            {tabCategories.map((category, index) => (
              <Tabs.Content key={index} value={category.toLowerCase()}>
                <div className="select-product-page-item-container select-product-page-bg ion-padding">
                  <div className="select-product-page-category-header">
                    <p>{category}</p>
                  </div>
                  <ProductItemBig
                    key={index}
                    title={`Spezi`}
                    subtitle={"0,5l"}
                    price={2.5}
                    image={`product_15.png`}
                    amount={amount}
                    onClick={() => {
                      increaseAmount();
                    }}
                  />
                  {[...Array(5)].map((_, i) => (
                    <ProductItemBig
                      key={i}
                      title={`Berg Bier ${i + 1}`}
                      subtitle={"0,33l"}
                      price={2.5}
                      image={`go.png`}
                      amount={0}
                      onClick={() => {
                        increaseAmount();
                      }}
                    />
                  ))}
                </div>
              </Tabs.Content>
            ))}
          </Tabs.Root>
          <div className="select-product-page-submit-button">
            <Button
              loading={false}
              loadingText="Eintragen..."
              _loading={{ opacity: "1.0", backgroundColor: "#7900ff" }}
              className="select-product-page-submit-button"
              size="md"
              variant="solid"
            >
              Je €21,43 eintragen
            </Button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SelectProductPage;

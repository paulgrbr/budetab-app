import React, { useState } from "react";
import { Button, Input, VStack } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { AuthService } from "../../services/authService";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleLogin = async () => {
    setLoading(true);

    try {
      const success = await AuthService.login(username, password);
      if (success) {
        console.log("Login successful");

        window.location.href = "/home";
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.log("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Anmelden</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Login</IonTitle>
          </IonToolbar>
        </IonHeader>

        <VStack padding={4}>
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            colorScheme="blue"
            onClick={handleLogin}
            loading={loading}
            width="100%"
          >
            Anmelden
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toaster.create({
                description: "File saved successfully",
                duration: 6000,
              })
            }
          >
            Show Toast
          </Button>
        </VStack>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;

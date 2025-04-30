import { PushNotifications } from "@capacitor/push-notifications";

import { registerNotificationKeyToSession } from "./dataService";

export function initPushNotifications() {
  // Ask for permission
  PushNotifications.requestPermissions().then((result) => {
    if (result.receive === "granted") {
      PushNotifications.register();
    }
  });

  // Get FCM Tokenasync
  PushNotifications.addListener("registration", async (token) => {
    await registerNotificationKeyToSession(token.value);
  });

  // Handle errors
  PushNotifications.addListener("registrationError", (err) => {
    console.error("Push registration error:", err);
  });
}

import type { CapacitorConfig } from "@capacitor/cli";
import { KeyboardResize } from "@capacitor/keyboard";

const config: CapacitorConfig = {
  appId: "com.budeberkach.budetab",
  appName: "budetab-app",
  webDir: "dist",
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      launchFadeOutDuration: 200,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
    Keyboard: {
      resize: KeyboardResize.None,
      resizeOnFullScreen: true,
    },
    PushNotifications: {
      presentationOptions: ["alert", "badge", "sound"],
    },
  },
};

export default config;

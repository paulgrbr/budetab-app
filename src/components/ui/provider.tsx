"use client";

import {
  ChakraProvider,
  createSystem,
  defaultConfig,
} from "@chakra-ui/react";

import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

const ionicFont = `var(--ion-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)`;

// Create a custom Chakra system that disables layers and respects Ionic's design
const customSystem = createSystem(defaultConfig, {
  globalCss: {
    "html, body": {
      fontFamily: ionicFont,
    },
  },
});

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={customSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}

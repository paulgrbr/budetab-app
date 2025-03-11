import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useMediaQuery } from "@mui/material";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Dark Mode */
import "@ionic/react/css/palettes/dark.system.css";

// Mobile and Tablet Version
import Mobile from "./Mobile";
import Tablet from "./Tablet";

import "./global.css";
import { Provider } from "./components/ui/provider";

setupIonicReact();

const App: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Provider>
      <IonApp>
        <IonReactRouter>{isMobile ? <Mobile /> : <Tablet />}</IonReactRouter>
      </IonApp>
    </Provider>
  );
};

export default App;

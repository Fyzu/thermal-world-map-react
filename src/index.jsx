import React from "react";
import { render } from "react-dom";
import { MuiThemeProvider } from "material-ui";
import injectTapEventPlugin from "react-tap-event-plugin";
import type { Store } from "redux";
import { Provider } from "react-redux";
import { configureStore } from "./store/index";

import App from "containers/App";
import ThermalWorldMap from "components/ThermalWorldMap";

import "./styles.pcss";

export let store: Store<*, *> = configureStore();

injectTapEventPlugin();

window.onload = () => render((
    <Provider store={store}>
        <MuiThemeProvider>
            <App>
                <ThermalWorldMap/>
            </App>
        </MuiThemeProvider>
    </Provider>
), document.getElementById('root'));

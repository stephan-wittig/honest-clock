/* Änderungshistorie
* Name: Fabienne
* Datum: 06.11.2018
* Änderung: Entfernen der index.css und des entsprechenden Import-Befehls
*/
import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import {DrizzleContext} from "drizzle-react";
// Components
import App from "./App";
// Konfigurationen
import reduxStore from "./reduxStore";
import drizzle from "./drizzle";

ReactDOM.render(
  <DrizzleContext.Provider drizzle={drizzle}>
    <Provider store={reduxStore}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </Provider>
  </DrizzleContext.Provider>,
  document.getElementById("root")
);

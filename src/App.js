/* Änderungshistorie
* Zweck des Dokuments: Die App ist der Ausgangspunkt des Frontends. Von hier werden die Container aufgerufen, welche
* die Komponenten rendern und darstellen.
*
*/

import React from "react";
import {Route, Switch} from "react-router-dom";
import style from "./App.css";
import Header from "./containers/Header/Header"
import LoadingContainer from "./components/loadingContainer/LoadingContainer";
import DrizzleLoading from "./components/drizzleLoading/DrizzleLoading";
import Startseite from "./containers/Startseite"
import Finseite from "./containers/Finseite";
import FDListener from "./containers/FDListener";
import {DrizzleContext} from "drizzle-react";

const App = () => (
  <div className={style.app}>
    <LoadingContainer LoadingComp={DrizzleLoading}>
      <Header/>
      <DrizzleContext.Consumer>
        { (drizzleContext) => {
            return <FDListener drizzle={drizzleContext.drizzle} />
          }
        }
      </DrizzleContext.Consumer>
      <Switch>
        <Route exact path="/" component={Startseite}/>
        <Route path="/:input" component={Finseite}/>
      </Switch>
    </LoadingContainer>
  </div>
);

export default App;

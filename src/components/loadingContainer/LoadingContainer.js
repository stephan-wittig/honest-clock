/* Änderungshistorie
* Zweck des Dokuments: Die folgende Komponente kann in einem DrizzleContext.Provider verwendet werden um eine Fehlermeldung
* anzuzeigen, sollte keine Verbindung zur Blockchain hergestellt werden können. Beugt so Fehlern in Drizzle Components vor.
* Die Komponente nimm eine LoadingComp als Props entgegen. Die LoadingComp sollte eine Komponente sein, welche angezeigt wird
* wenn keine Verbindung zur Blockchain hergestellt werden konnte. Andernfalls werden die children gerendert.
*
* Änderungen:
* Name:
* Datum:
* Änderung vorgenommen:
*/
import React from "react";
import {DrizzleContext} from "drizzle-react";

const LoadingContainer = ({LoadingComp, children}) => {
  return (
    <DrizzleContext.Consumer>
      {drizzleContext => {

        if (!drizzleContext.initialized) {
          return (<LoadingComp/>);
        }

        return children
      }}
    </DrizzleContext.Consumer>
  );
};

export default LoadingContainer;

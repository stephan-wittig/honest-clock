/* Änderungshistorie
* Zweck des Dokuments: Die folgende Komponente ruft die Informationen aus einem Smart Contract ab.
*
* Änderungen:
* Name: Fabienne
* Datum: 15.10.2018
* Änderung vorgenommen: Zufügen der Dokumentation
*
* Name: Stephan
* Datum:
* Änderung vorgenommen: Anpassen der ContractData
*/

import React, {Component} from "react";
import {DrizzleContext} from "drizzle-react";
import PropTypes from "prop-types";
import {isEqual} from "underscore";

/*
/ ContractData gibt den Rückgabewert eines Calls an seine Render-Props
/ (https://reactjs.org/docs/render-props.html) weiter.
/ Für Props siehe unten.
*/

// Diese Komponente wird nicht exportiert, sondern nur im darunter folgenden
// ContextConsumer verwendet
class InnerComponent extends Component {
  constructor(props) {
    super(props);
    this.fetchDataKey = this.fetchDataKey.bind(this);
    this.state = {
      dataKey: this.fetchDataKey(this.props)
    };
  }

  fetchDataKey(props) {
    const contract = props.drizzle.contracts[props.contract];
    const method = contract.methods[props.method];
    const dataKey = method.cacheCall(...props.args);
    return dataKey;
  }

  shouldComponentUpdate(nextProps, nextState) {
    //  DataKey wird erneuert, wenn sich die Parameter ändern
    if (
      !isEqual(this.props.args, nextProps.args) ||
      this.props.method !== nextProps.method ||
      this.props.contract !== nextProps.contract
    ) {
      this.setState({
        dataKey: this.fetchDataKey(nextProps)
      });
    }
    // Komponente wird immer neu gerendert
    return true;
  }

  render() {
    if (this.state.dataKey) {
      //Daten aus dem DrizzleState abholen.
      const contract = this.props.drizzleState.contracts[this.props.contract];
      const data = contract[this.props.method][this.state.dataKey];

      //Daten anzeigen
      return <React.Fragment>{data && this.props.render(data.value)}</React.Fragment>;

    } else {
      //Nichts anzeigen
      return <React.Fragment></React.Fragment>;
    }

  }
}

// Render props innerhalb von Render props.
const ContractData = ({contract, method, args, children}) => (
  <DrizzleContext.Consumer>
    {DrizzleContext => {
      return (
        <InnerComponent
          drizzle={DrizzleContext.drizzle}
          drizzleState={DrizzleContext.drizzleState}
          contract={contract}
          method={method}
          args={args}
          render={children}
        />
      )
    }}
  </DrizzleContext.Consumer>
);


ContractData.propTypes = {
  // Contract und Methode des Contracts, die aufgerufen werden soll.
  contract: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  // Argumente, mit denen die Funktion aufgerufen wird.
  args: PropTypes.array,
  // Child muss eine Funktion sein = Render-Props.
  children: PropTypes.func.isRequired
};

ContractData.defaultProps = {
  args: []
};

export default ContractData;
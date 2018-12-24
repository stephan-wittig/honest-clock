/* Änderungshistorie
* Name: Stephan
* Datum:
* Zweck des Dokuments: Komponente dient der Verbindung zwischen Frontend und Backend und sendet Transaktionen an die Blockchain.
*
* Änderung:
* Name: Stephan
* Datum:
* Änderungen vorgenommen: Update des TxButton zu TxWrapper mit einigen Verbesserungen. Jetzt mit Render-Props.
*/

import React, {Component} from "react";
import {DrizzleContext} from "drizzle-react";
import PropTypes from "prop-types";

/*
/ TxWrapper gibt zwei Variablen an seine Render-Props
/ (https://reactjs.org/docs/render-props.html) weiter: Die erste ist eine
/ Funktion zum senden der spezifizierten Transaktion. Die zweite ist Wahrheitswert, der true ist, während die Transaktion gesendet wird.
/ für Props siehe unten.
*/

// Diese Komponente wird nicht exportiert, sondern nur im darunter folgenden
// ContextConsumer verwendet
class InnerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stackID: undefined,
      pending: false
    };

    this.sendTransaction = this.sendTransaction.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Wird ausgeführ sobald die Transaktion ~richtig~ gesendet wurde
    if (
      nextState.stackID !== undefined && nextProps.drizzleState.transactionStack[nextState.stackID] &&
      nextState.pending) {
      //Reaktiviert Button und führt then-Funktion aus
      this.props.then(this.state.stackID);
      this.setState({
        pending: false
      });
    }
    // Wird ausgeführt, weenn sich Parameter ändern
    if (
      (this.props.args !== nextProps.args ||
        this.props.method !== nextProps.method ||
        this.props.contract !== nextProps.contract) &&
      nextState.pending
    ) {
      this.setState({
        pending: false
      });
    }
    // Immer neu rendern
    return true;
  }

  sendTransaction() {
    const drizzle = this.props.drizzle;
    const contract = drizzle.contracts[this.props.contract];

    // To-Do Error-Handling bei falscher Anzahl von Argumenten und ähnlichem
    // Sendet Transaktion und beobachtet sie
    const stackID = contract.methods[this.props.method].cacheSend(...this.props.args);

    // Speichert StackID und markiert Transaktion als ausstehend
    this.setState({
      stackID: stackID,
      pending: true
    });

  }

  render() {
    return <React.Fragment>{this.props.render(this.sendTransaction, this.state.pending)}</React.Fragment>
  }
}


const TxWrapper = ({contract, method, args, then, children}) => (
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
          then={then}
        />
      )
    }}
  </DrizzleContext.Consumer>
);


TxWrapper.propTypes = {
  // Contract und Methode des Contracts, die aufgerufen werden soll.
  contract: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  // Argumente, mit denen die Funktion aufgerufen wird.
  args: PropTypes.array,
  // Funktion die ausgeführt wid, nachdem eine Transaktion
  // erfolgreich abgesendet wurde.
  then: PropTypes.func,
  // Child muss eine Funktion sein = Render-Props.
  children: PropTypes.func
};

TxWrapper.defaultProps = {
  args: [],
  then: (stackID) => {
    console.log("The transaction has been send. StackID is: " + stackID)
  }
};

export default TxWrapper;
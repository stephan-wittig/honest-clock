/* Änderungshistorie
* Zweck des Dokuments: Bei entsprechender Berechtigung wird der Korrektur-Button von der Finseite aufgerufen.
* Ließt die Fin und den eingegebenen Kilometerstand aus und führt beim Klick auf den Button die Transaktion aus.
* Wenn Finerror = true oder kminput.length = 0, soll der Button ausgegraut sein und das Klicken nicht möglich sein.
*
* *Änderungen:
* Name: Lucas
* Datum: 20.11.2018
* Änderung vorgenommen: Drizzle eingebunden, inkl. Tx-Wrapper
*
* Name: Friedemann
* Datum: 02.12.2018
* Änderung vorgenommen: Drizzle richtig eingebunden, Bestätigungsseite hinzugefügt
*/
import React from "react";
import {connect} from "react-redux";
import Button from '@material-ui/core/Button';
import {DrizzleContext} from "drizzle-react";
import TxWrapper from "../components/txWrapper/TxWrapper";
import {withRouter} from "react-router-dom";
import {changeSubmittedTransaction} from "../actions";
import style from "./Stylez.css";

class KorrekturButton extends React.Component {
  //Render wird aufgerufen, sobald die Komponente gerendert wird und immer wenn sich der State ändert.
  //{this.props.kmInput} enthält die Kilometereingabe
  render() {
    return (
      <DrizzleContext.Consumer>
        {(drizzleContext) => {
          return (
            <div>
              <br/>
              <TxWrapper
                contract={"HonestClock"}
                method={"correctKM"}
                args={[drizzleContext.drizzle.web3.utils.utf8ToHex(this.props.match.params.input), this.props.kminput, {from: drizzleContext.drizzleState.accounts[0]}]}
              >
                {(send) => {
                  return (
                    <Button className="button" variant="contained" color="primary" size="large"
                            disabled={((this.props.kminputerror) || (this.props.kminput.length === 0))}
                            onClick={(event) => {
                              send();
                              this.props.changeSubmittedTransaction("Korrektur");
                            }}>Korrektur</Button>
                  )
                }}
              </TxWrapper>
              <br/><br/>
            </div>
          )
        }}
      </DrizzleContext.Consumer>
    );
  }
}

//Redux Variablen können oben über this.props.[name] aufgerufen werden
const mapStatesToProps = state => ({
  kminput: state.inputs.kminput,
  kminputerror: state.inputs.kminputerror,
});

const mapDispatchToProps = dispatch => ({
  changeSubmittedTransaction: (submittedtransaction) => {
    dispatch(changeSubmittedTransaction(submittedtransaction));
  },
});

export default withRouter(connect(
  mapStatesToProps,
  mapDispatchToProps,
)(KorrekturButton));
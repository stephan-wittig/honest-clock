/* Änderungshistorie
* Zweck des Dokuments: Bei entsprechender Berechtigung wird der Update-Button von der Finseite aufgerufen.
* Ließt die Fin und den eingegebenen Kilometerstand aus und führt beim Klick auf den Button die Transaktion aus.
* Wenn Finerror = true oder kminput.length = 0, soll der Button ausgegraut sein und das Klicken nicht möglich sein.
*
* Änderungen:
* Name: Lucas
* Datum: 20.11.2018
* Änderung vorgenommen: imports hinzugefügt, Funktion im Tx-Wrapper angepasst
*
* Name: Friedemann
* Datum: 02.12.2018
* Änderung vorgenommen: Errorhandling hinzugefügt - Überprüft nun auch ob km neu > alt
*                       On ENTER Funktionen hinzugefügt & Abgreifen der FIN aus URL
*
* Name: Selina
* Datum: 03.12.2018
* Änderung vorgenommen: Label + Placeholder zum Textfeld hinzugefügt
*/
import React from "react";
import {changeKmInput, changeKmInputError, changeSubmittedTransaction, setFinAwaitingValidation} from "../actions";
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import {DrizzleContext} from "drizzle-react";
import TxWrapper from "../components/txWrapper/TxWrapper";
import {getKmError} from "../utils";
import ContractData from "../components/contractData/ContractData";
import {withRouter} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import style from "./Stylez.css";

class UpdateButton extends React.Component {
  //Render wird aufgerufen, sobald die Komponente gerendert wird und immer wenn sich der State ändert.
  //{this.props.kmInput} enthält die Kilometereingabe

  handleKmInput(input) {
    this.props.changeKmInput(input);
    this.props.changeKmInputError(getKmError(input));
  }



    render() {
    return (
      <div>
        <DrizzleContext.Consumer>
          {(drizzleContext) => {
            return (
              <div>
                <TxWrapper
                  contract={"HonestClock"}
                  method={"updateKM"}
                  args={[drizzleContext.drizzle.web3.utils.utf8ToHex(this.props.match.params.input), this.props.kminput, {from: drizzleContext.drizzleState.accounts[0]}]}
                >
                  {(send) => {
                    return (
                      <div>
                        <ContractData
                          contract={"HonestClock"}
                          method={"getPermissionLevel"}
                          args={[drizzleContext.drizzleState.accounts[0]]}
                        >
                          {(permission) => {
                            return (
                              <ContractData
                                contract={"HonestClock"}
                                method={"getKM"}
                                args={[drizzleContext.drizzle.web3.utils.utf8ToHex(this.props.match.params.input)]}
                              >
                                {(km) => {
                                  return (
                                    <TextField autoFocus={true}
                                               error={this.props.kminputerror}
                                               value={this.props.kminput}
                                               label="Neuer Kilometerstand"
                                               placeholder="KM"
                                               onChange={(event) => (this.handleKmInput(event.target.value))}
                                               onKeyPress={(ev) => {
                                                 if (ev.key === 'Enter') {
                                                   ev.preventDefault();
                                                   if ((!(this.props.kminputerror || (this.props.kminput.length === 0))) && (parseInt(this.props.kminput) > parseInt(km)) && (permission == 1)) {
                                                     send();
                                                     this.props.setFinAwaitingValidation(this.props.match.params.input, this.props.kminput, Date.now());
                                                     this.props.changeSubmittedTransaction("Update");
                                                   }
                                                 }
                                               }}
                                    />
                                  )
                                }}
                              </ContractData>
                            )
                          }}
                        </ContractData>
                      </div>
                    )
                  }}
                </TxWrapper>
              </div>
            )
          }}
        </DrizzleContext.Consumer>
        <DrizzleContext.Consumer>
          {(drizzleContext) => {
            return (
              <div>
                <br/>
                <TxWrapper
                  contract={"HonestClock"}
                  method={"updateKM"}
                  args={[drizzleContext.drizzle.web3.utils.utf8ToHex(this.props.match.params.input), this.props.kminput, {from: drizzleContext.drizzleState.accounts[0]}]}
                >
                  {(send) => {
                    return (
                      <ContractData
                        contract={"HonestClock"}
                        method={"getKM"}
                        args={[drizzleContext.drizzle.web3.utils.utf8ToHex(this.props.match.params.input)]}
                      >
                        {(km) => {
                          return (
                            <Button className="button" variant="contained" color="primary"
                                    disabled={((this.props.kminputerror) || (this.props.kminput.length === 0) || (parseInt(this.props.kminput) < parseInt(km)) || (this.props.updates[this.props.match.params.input] !== undefined))}
                                    onClick={(event) => {
                                      send();
                                      this.props.setFinAwaitingValidation(this.props.match.params.input, this.props.kminput, Date.now());
                                      this.props.changeSubmittedTransaction("Update");
                                    }}>Updaten</Button>
                          )
                        }}
                      </ContractData>
                    )
                  }}
                </TxWrapper>
              </div>
            )
          }}
        </DrizzleContext.Consumer>
      </div>
    )
  }
}

//Redux Variablen können oben über this.props.[name] aufgerufen werden
const mapStatesToProps = state => ({
  kminput: state.inputs.kminput,
  kminputerror: state.inputs.kminputerror,
  updates: state.updates
});

const mapDispatchToProps = dispatch => ({
  changeKmInput: (kminput) => {
    dispatch(changeKmInput(kminput));
  },

  changeKmInputError: (kminputerror) => {
    dispatch(changeKmInputError(kminputerror));
  },

  changeSubmittedTransaction: (submittedtransaction) => {
    dispatch(changeSubmittedTransaction(submittedtransaction));
  },

  setFinAwaitingValidation: (fin, km, datum) => {
    dispatch(setFinAwaitingValidation(fin, km, datum));
  },
});

export default withRouter(connect(
  mapStatesToProps,
  mapDispatchToProps,
)(UpdateButton));
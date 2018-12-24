/* Änderungshistorie
* Zweck des Dokuments: Enthält die gesamte Rendering-Magie
*
*/
import React from "react";
import {connect} from "react-redux";
import {changeErrorMsg, changeFinInput} from "../actions";
import Daten from "./Daten";
import UpdateButton from "./UpdateButton";
import KorrekturButton from "./KorrekturButton";
import Registrierungsseite from "./Registrierungsseite";
import Bestaetigungsseite from "./Bestätigungsseite";
import Suche from "./Suche";
import ContractData from "../components/contractData/ContractData";
import {DrizzleContext} from "drizzle-react";
import {getFinError} from "../utils";
import style from "./Stylez.css";

class Finseite extends React.Component {
  //Folgendes wird aufgerufen, sobald die Komponente gerendert wird und immer wenn sich der State ändert.
  render() {
    if (getFinError(this.props.match.params.input)) {
      this.props.changeFinInput(this.props.match.params.input);
      //FEHLERMELDUNG DIREKTEINSTIEG
      this.props.changeErrorMsg("Die übergebene FIN ist leider ungültig!");
      this.props.history.push("/");
    }
    if (this.props.submittedtransaction.length === 0) {
      return (
        <DrizzleContext.Consumer>
          {(drizzleContext) => {
            return (
              <div>
                <Suche/>
                {/* checkt ob FIN bereits existiert. Liefert true oder false zurück*/}
                <ContractData
                  contract={"HonestClock"}
                  method={"FINexists"}
                  args={[drizzleContext.drizzle.web3.utils.utf8ToHex(this.props.match.params.input)]}
                >
                  {(exists) => {
                    return (
                      <ContractData
                        contract={"HonestClock"}
                        method={"getPermissionLevel"}
                        args={[drizzleContext.drizzleState.accounts[0]]}
                      >
                        {(permission) => {/*
                        console.log("PERMISSION:");
                        console.log(permission);
                        console.log("INPUT:");
                        console.log(this.props.match.params.input);
                        console.log("EXISTS:");
                        console.log(exists);*/
                          if (exists) {
                            if (permission == 0 || permission > 2) {
                              return (
                                <Daten/>
                              )
                            } else if (permission == 1) {
                              return (
                                <div>
                                  <Daten/>
                                  <UpdateButton/>
                                </div>
                              )
                            } else if (permission == 2) {
                              return (
                                <div>
                                  <Daten/>
                                  <UpdateButton/>
                                  <KorrekturButton/>
                                </div>
                              )
                            }
                          } else {
                            if (permission == 0 || permission > 2) {
                              //FEHLERMELDUNG FEHLENDE BERECHTIGUNG
                              this.props.changeErrorMsg("Diese FIN ist bisher nicht registriert und Sie besitzen nicht die nötige Berechtigung!");
                              this.props.history.push("/");
                            } else {
                              return (
                                <Registrierungsseite/>
                              )
                            }
                          }
                        }}
                      </ContractData>
                    );
                  }}
                </ContractData>
              </div>
            )
          }}
        </DrizzleContext.Consumer>
      )
    } else {
      return (
        //Wenn submittedtransaction gesetzt ist, zeige Bestätigungsseite an
        <div>
          <Bestaetigungsseite/>
        </div>
      )
    }
  };
}

//Redux Variablen können oben über this.props.[name] aufgerufen werden
const mapStatesToProps = state => ({
  submittedtransaction: state.inputs.submittedtransaction,
});

const mapDispatchToProps = dispatch => ({
  changeFinInput: (fininput) => {
    dispatch(changeFinInput(fininput));
  },

  changeErrorMsg: (errormsg) => {
    dispatch(changeErrorMsg(errormsg));
  },
});

export default connect(
  mapStatesToProps,
  mapDispatchToProps,
)(Finseite);
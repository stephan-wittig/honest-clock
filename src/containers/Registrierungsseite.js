/* Änderungshistorie
* Name: Friedemann
* Datum: 02.12.2018
* Änderung: Implementierung der Registrierungskomponente & Anbindung
*/
import React from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import TxWrapper from "../components/txWrapper/TxWrapper";
import {DrizzleContext} from "drizzle-react";
import connect from "react-redux/es/connect/connect";
import {getKmError} from "../utils";
import {changeKmInput, changeKmInputError, changeSubmittedTransaction} from "../actions";
import {withRouter} from "react-router-dom";
import style from "./Stylez.css";

class Registrierungsseite extends React.Component {
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
                  <h2>Fahrzeugregistrierung</h2>
                <TxWrapper
                  contract={"HonestClock"}
                  method={"createVehicle"}
                  args={[drizzleContext.drizzle.web3.utils.utf8ToHex(this.props.match.params.input), this.props.kminput, {from: drizzleContext.drizzleState.accounts[0]}]}
                >
                  {(send) => {
                    return (

                      <TextField
                        error={this.props.kminputerror}
                        autoFocus={true}
                        value={this.props.kminput}
                        label={"Kilometerstand"}
                        placeholder={"KM"}
                        onChange={(event) => this.handleKmInput(event.target.value)}
                        onKeyPress={(ev) => {
                          if (ev.key === 'Enter') {
                            ev.preventDefault();
                            if (!(this.props.kminputerror || (this.props.kminput.length === 0))) {
                              send();
                              this.props.changeSubmittedTransaction("Registrierung");
                            }
                          }
                        }}/>
                    )
                  }}
                </TxWrapper>
              </div>
            )
          }}
        </DrizzleContext.Consumer>
        <br/>
        <DrizzleContext.Consumer>
          {(drizzleContext) => {
            return (
              <div>
                <TxWrapper
                  contract={"HonestClock"}
                  method={"createVehicle"}
                  args={[drizzleContext.drizzle.web3.utils.utf8ToHex(this.props.match.params.input), this.props.kminput, {from: drizzleContext.drizzleState.accounts[0]}]}
                >
                  {(send) => {
                    return (
                      <Button className="button" variant="contained" color="primary" size="large"
                              disabled={(this.props.kminputerror || (this.props.kminput.length === 0))}
                              onClick={(event) => {
                                send();
                                this.props.changeSubmittedTransaction("Registrierung");
                              }}>Registrieren</Button>
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
});

export default withRouter(connect(
  mapStatesToProps,
  mapDispatchToProps,
)(Registrierungsseite));
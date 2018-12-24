/* Änderungshistorie
* Zweck des Dokuments: Gibt drei Textfelder aus, die zum Anzeigen des Kilometerstandes, des Datums und der Qualitätsmetrik
* aus der Blockchain genutzt werden.
*
* Friedemann, 02.12.2018: Vereigenständigt - bekommt FIN nun nicht übergeben, sondern greift sie aus URL ab
*/
import React from "react";
import {connect} from "react-redux";
import TextField from '@material-ui/core/TextField'
import ContractData from "../components/contractData/ContractData";
import {DrizzleContext} from "drizzle-react";
import {withRouter} from "react-router-dom";
import {Block2Date} from "../utils";
import style from "./Stylez.css";
import {delFinAwaitingValidation} from "../actions";

class Daten extends React.Component {
  //Wird aufgerufen sobald der promise erfüllt ist. Erhält zwei Blocknummern, berechnet die das Datum durch Block2Date,
  //formatiert es und überschreibt den value des Textfeldes mit der ID "date"
  static handleDate(latestblock, transactionblock) {
    const options = {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'};
    document.getElementById("date").value = new Date(Block2Date(latestblock, transactionblock)).toLocaleDateString("de-DE", options);
  }

  //Render wird aufgerufen, sobald die Komponente gerendert wird und immer wenn sich der State ändert.
  render() {
    return (
      <DrizzleContext.Consumer>
        {(drizzleContext) => {
          return (
            <div>
              <h1>Fahrzeugdaten</h1>
              <ContractData
                contract={"HonestClock"}
                method={"getKM"}
                args={[drizzleContext.drizzle.web3.utils.utf8ToHex(this.props.match.params.input)]}
              >
                {(data) => {
                  if (data == undefined) {
                    data = "";
                  }
                  if (this.props.updates[this.props.match.params.input] !== undefined) {
                      data = this.props.updates[this.props.match.params.input].km
                  }
                  return (
                    <TextField
                      disabled
                      label="Kilometerstand"
                      margin="normal"
                      value={data}
                    />
                  )
                }}
              </ContractData>
              <br/>
              <ContractData
                contract={"HonestClock"}
                method={"getBlocknumber"}
                args={[drizzleContext.drizzle.web3.utils.utf8ToHex(this.props.match.params.input)]}
              >
                {(data) => {
                  if (data == undefined) {
                    data = "";
                  }
                  if (this.props.updates[this.props.match.params.input] !== undefined) {
                    const options = {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'};
                    data = new Date(this.props.updates[this.props.match.params.input].datum).toLocaleDateString("de-DE", options);
                  } else {
                  //Frage letzte Blocknummer ab, rufe anhand dieser und der Blocknummer der Transaktion handleDate auf
                  drizzleContext.drizzle.web3.eth.getBlockNumber().then(function (value) {
                    Daten.handleDate(value, data);
                  })};

                  //Rendere Textfeld, value wird durch handeDate ersetzt, sobald Blocknummer übergeben wurde
                  return (
                    <TextField
                      id={"date"}
                      disabled
                      label="Datum"
                      margin="normal"
                      value={data}
                    />
                  )
                }}
              </ContractData>
              <br/>
              {// Hier muss die entsprechende "getQualitymetric"-Funktion von Backend eingebunden werden, sobald diese existiert.
              }
              <ContractData
                contract={"HonestClock"}
                method={"getQuality"}
                args={[drizzleContext.drizzle.web3.utils.utf8ToHex(this.props.match.params.input)]}
              >
                {(data) => {
                  let value;
                  if (data == undefined) {
                    data = "";
                  }
                    if (data == 0) {
                      value = "Keine Validierung möglich"
                    } else if (data == 1) {
                      value = "Reduzierte Fahrleistung"
                    } else if (data == 2) {
                      value = "Kontinuierliche Fahrleistung"
                    } else if (data == 3) {
                      value = "Erhöhte Fahrleistung"
                    } else if (data == 4) {
                      value = "Korrektur durch TÜV"
                    } else if (data == 9) {
                      value = "Auffällige Fahrleistung"
                    } else {
                      value = "FEHLER!"
                    }
                    try{ if (this.props.updates[this.props.match.params.input] !== undefined) {
                      console.log(this.props.updates);
                      value = "Wird ermittelt..."
                    }}
                    catch (e) {

                    }
                    return (
                    <TextField
                      disabled
                      label="Qualitätsmetrik"
                      margin="normal"
                      value={value}
                    />
                    )
                }}
              </ContractData><br/>
            </div>
          )
        }}
      </DrizzleContext.Consumer>
    );
  };
}

//Redux Variablen können oben über this.props.[name] aufgerufen werden
const mapStatesToProps = state => ({
  updates: state.updates,
  //Wird benötigt um ein Update nach dem Schließen des Dialogs zu erzeugen
  dialogfin: state.inputs.dialogfin,
});

const mapDispatchToProps = dispatch => ({
  delFinAwaitingValidation: (fin) => {
    dispatch(delFinAwaitingValidation(fin));
  }
});

export default withRouter(connect(
  mapStatesToProps,
  mapDispatchToProps,
)(Daten));

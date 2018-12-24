/* Änderungshistorie
* Name: Friedemann
* Datum: 02.12.2018
* Zweck des Dokuments: Stellt die Bestätigungsseite dar.
*/
import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {changeSubmittedTransaction, resetStore} from "../actions";
import style from "./Stylez.css";
import Button from "@material-ui/core/Button/Button";

class Bestaetigungsseite extends React.Component {
  //Beim Verlassen der Bestätigungsseite wird der gesamte Store zurückgesetzt
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextProps.match.params.input !== this.props.match.params.input) {
      this.props.changeSubmittedTransaction("");

    }
    return true
  }

  componentWillUnmount() {
    this.props.resetStore();
  }

    constructor() {
        super();

        var today = new Date(),
            date = today.getDate()+'.'+(today.getMonth() + 1)+'.' +today.getFullYear()+", " + (today.getHours()<10?'0':'') + today.getHours()+":"+(today.getMinutes()<10?'0':'') + today.getMinutes();

        this.state = {
            date: date
        };
    }

  render() {
    return (
      <div>
        <br/>
        {/*Zurückbutton setzt nur submittedtransaction = "" und sorgt damit dafür,
        dass die Bestätigungsseite nicht gerendert wird (see Finseite)*/}
          <Button className="button" variant="contained" color="primary" size="large"
                  onClick={(event) => {
          this.props.changeSubmittedTransaction("")
        }}>Zurück</Button>

        <h2>Transaktionsbestätigung</h2>

          <h3>Art:</h3><p>{this.props.submittedtransaction}</p>
          <h3>FIN:</h3><p>{this.props.match.params.input}</p>
          <h3>Neuer Kilometerstand:</h3><p>{this.props.kminput}</p>
          <h3>Datum</h3><p>{this.state.date}</p>

        {this.props.submittedtransaction === "Update" &&
            <div>
                <h3>Metrik</h3>
                <p>Wird ermittelt...</p>
            </div>
        }
        </div>

    )
  }
}

//Redux Variablen können oben über this.props.[name] aufgerufen werden
const mapStatesToProps = state => ({
  submittedtransaction: state.inputs.submittedtransaction,
  kminput: state.inputs.kminput,
});

const mapDispatchToProps = dispatch => ({
  changeSubmittedTransaction: (submittedtransaction) => {
    dispatch(changeSubmittedTransaction(submittedtransaction))
  },
  resetStore: (reset) => {
    dispatch(resetStore())
  },
});

export default withRouter(connect(
  mapStatesToProps,
  mapDispatchToProps,
)(Bestaetigungsseite));
/* Änderungshistorie
* Name: Friedemann
* Datum: 11.11.2018
* Zweck des Dokuments: Stellt den Suche-Container dar. Kann zusätzlich noch eine (Fehler-)Meldung anzeigen.
*
* Name: Selina
* Datum: 20.11.2018
* Änderung: Implementierung der Suchdarstellung und Auseinanderziehen Startseite + Suche, Hinzufügen on Enter
*
* Name: Friedemann
* Datum: 02.12.2018
* Änderung: Anzeige der Fehlermeldung hinzugefügt,
*/
import React from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {getFinError} from "../utils";
import {
  changeErrorMsg,
  changeFinInput,
  changeFinInputError,
  delFinAwaitingValidation,
  setFinAwaitingValidation
} from "../actions";
import style from "./Stylez.css";

class Startseite extends React.Component {
  //Für den Fall, dass bereits beim Mounten ein Fin-Input existiert, wird gleich zu Beginn ein möglicher Fehler
  //in den Redux-Store geschrieben
  componentDidMount() {
    this.props.changeFinInputError(getFinError(this.props.fininput));
  }

  //Fehlermeldung wird entfernt, sobald die Startseite verlassen wird
  componentWillUnmount() {
    this.props.changeErrorMsg("");
  }

  //Bei jeder Eingabe in das Suchfeld, wird die Eingabe auf Validität überprüft
  handleFinInput(input) {
    this.props.changeFinInput(input);
    this.props.changeFinInputError(getFinError(input));
  }

  render() {
    return (
      <div align="center">
          <h1>FIN</h1>
        <TextField
          id="outlined-with-placeholder"
          inputProps={{
            maxLength: 17,
          }}
          placeholder="Bitte FIN eingeben"
          margin="normal"
          variant="outlined"

          error={this.props.fininputerror}
          autoFocus={true}
          value={this.props.fininput}
          onChange={(event) => (this.handleFinInput(event.target.value))}
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              ev.preventDefault();
              if ((this.props.fininputerror || (this.props.fininput.length === 0) === true) === false) {
                this.props.history.push('/' + this.props.fininput)
              }
            }
          }}/>
        <br/><br/>
        <Button color="primary"
                size="large"
          variant={"contained"}
          disabled={this.props.fininputerror || (this.props.fininput.length === 0)} component={Link}
          to={"/" + (!this.props.fininputerror && this.props.fininput)}>Suche</Button>
        {/*Anzeigen der Fehlermeldung*/}
        {this.props.errormsg.length > 0 && <p className={style.Error}>{this.props.errormsg}</p>}
      </div>
    )
  }
}

//Redux Variablen können oben über this.props.[name] aufgerufen werden
const mapStatesToProps = state => ({
  fininput: state.inputs.fininput,
  fininputerror: state.inputs.fininputerror,
  errormsg: state.inputs.errormsg,
  updates: state.updates
});

const mapDispatchToProps = dispatch => ({
  changeFinInput: (fininput) => {
    dispatch(changeFinInput(fininput));
  },

  changeFinInputError: (fininputerror) => {
    dispatch(changeFinInputError(fininputerror));
  },

  changeErrorMsg: (errormsg) => {
    dispatch(changeErrorMsg(errormsg));
  },

  setFinAwaitingValidation: (fin, km, datum) => {
    dispatch(setFinAwaitingValidation(fin, km, datum));
  },

  delFinAwaitingValidation: (fin) => {
    dispatch(delFinAwaitingValidation(fin));
  }
});

export default withRouter(connect(
  mapStatesToProps,
  mapDispatchToProps,
)(Startseite));
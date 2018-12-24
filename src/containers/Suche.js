/* Änderungshistorie
* Name: Friedemann
* Datum: 11.11.2018
* Zweck des Dokuments: Implementiert Aussehen und Funktion der Suchleiste & Button. Wird auf Startseite und Finseite verwendet.
*
* Name: Selina
* Datum: 20.11.2018
* Änderung: Implementierung der Suchdarstellung und auseinander ziehen Startseite + Suche, Hinzufügen on Enter
*
* Name: Friedemann
* Datum: 02.12.2018
* Änderung: Suchcontainer greift die FIN nun eigenständig beim Mounten aus dem URL-Parameter ab
*
*/
import React from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {getFinError} from "../utils";
import {changeFinInput, changeFinInputError, changeKmInput} from "../actions";
import style from "./Stylez.css";

class Suche extends React.Component {
  //Für den Fall, dass bereits beim Mounten ein Fin-Input existiert, wird gleich zu Beginn ein möglicher Fehler
  //in den Redux-Store geschrieben
  componentDidMount() {
    this.props.changeFinInput(this.props.match.params.input);
    this.props.changeFinInputError(getFinError(this.props.match.params.input));
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextProps.match.params.input !== this.props.match.params.input) {
      this.props.changeFinInput(nextProps.match.params.input);
      this.props.changeFinInputError(getFinError(nextProps.match.params.input));
      this.props.changeKmInput("");
    }
    return true;
  }

  //Bei jeder Eingabe in das Suchfeld, wird die Eingabe auf Validität überprüft
  handleFinInput(input) {
    this.props.changeFinInput(input);
    this.props.changeFinInputError(getFinError(input));
  }

  render() {
    return (
      <div align="center">
        FIN:
        <TextField align="center"
            id="outlined-with-placeholder"
            placeholder="Bitte FIN eingeben"
            margin="normal"
            variant="outlined"
            inputProps={{
              maxLength: 17,
            }}
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
          &nbsp; &nbsp;
        <Button variant="contained"  size="medium" color="primary"
          disabled={this.props.fininputerror || (this.props.fininput.length === 0)} component={Link}
          to={"/" + (!this.props.fininputerror && this.props.fininput)}>Suche</Button>
      </div>
    )
  }
}

//Redux Variablen können oben über this.props.[name] aufgerufen werden
const mapStatesToProps = state => ({
  fininput: state.inputs.fininput,
  fininputerror: state.inputs.fininputerror,
});

const mapDispatchToProps = dispatch => ({
  changeFinInput: (fininput) => {
    dispatch(changeFinInput(fininput));
  },

  changeFinInputError: (fininputerror) => {
    dispatch(changeFinInputError(fininputerror));
  },

  changeKmInput: (kminput) => {
    dispatch(changeKmInput(kminput));
  }
});

export default withRouter(connect(
  mapStatesToProps,
  mapDispatchToProps,
)(Suche));

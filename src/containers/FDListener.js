import React, { Component } from "react";
import {connect} from "react-redux";
import {changeSubmittedTransaction, closeDialog, delFinAwaitingValidation, openDialog, setFinsFromCache, setLastBlock} from "../actions";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";

class FDListener extends React.Component {
  constructor(props) {
    super(props);
    this.processEvent = this.processEvent.bind(this)

    this.props.loadFromCache();

    let HC = this.props.drizzle.contracts.HonestClock;
    if (this.props.lastBlock == undefined){
      HC.events.validated({}, this.processEvent);
    } else {
      HC.events.validated({fromBlock: this.props.lastBlock}, this.processEvent);
    }
  }

  processEvent(error, event) {
    console.log("Validate erhalten");
    console.log(event);
    let INPUTFIN;
    console.log("EVENT Rückgabe: " + event.returnValues.fin);
    console.log(this.props.updates);
    INPUTFIN = this.props.updates[this.props.drizzle.web3.utils.hexToUtf8(event.returnValues.fin)];
    if (INPUTFIN !== undefined) {
      if (event.returnValues.akzeptiert == false) {
        console.log("FIN wurde nicht validiert.");
        this.props.openDialog(this.props.drizzle.web3.utils.hexToUtf8(event.returnValues.fin));
      }
      if (event.returnValues.akzeptiert == true) {
        console.log("FIN wurde validiert.");
        this.props.delFinAwaitingValidation(this.props.drizzle.web3.utils.hexToUtf8(event.returnValues.fin));
        //Dreckig, vielleicht gibt es eine bessere Lösung?
        window.location.reload();
      }
    }
    //Am Ende der Verarbeitung:
    this.props.setLastBlock(event.blockNumber);
    //WENN this.props.updates[event.returnValues.fin] !== undefined DANN this.props.openDialog(event.resultValues.fin)
    //Damit wird das Popup geöffnet
  }

  handleClose(){
    this.props.closeDialog();
    this.props.delFinAwaitingValidation(this.props.dialogfin);
    this.props.changeSubmittedTransaction("");
  };

  render() {
    return (
      <React.Fragment>
        <Dialog
          open={this.props.dialogfin !== ""}
          onClose={(ev) => (this.handleClose)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Update konnte nicht validiert werden!"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Eines Ihrer letzten Updates konnte nicht validiert werden. Bei der betroffenen FIN handelt es sich um: <br/>
              {this.props.dialogfin}<br/>
              Bitte wenden Sie sich an den TÜV Ihres Vertrauens.<br/>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={(ev) => (this.handleClose())} color="primary" autoFocus>
              Verstanden
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

const mapStatesToProps = state => ({
  dialogfin: state.inputs.dialogfin,
  updates: state.updates,
  lastBlock: state.lastBlock
});

const mapDispatchToProps = dispatch => ({
  openDialog: (fin) => {
    dispatch(openDialog(fin));
  },
  closeDialog: () => {
    dispatch(closeDialog());
  },
  delFinAwaitingValidation: (fin) => {
    dispatch(delFinAwaitingValidation(fin));
  },
  setAllFins: (fins) => {
    dispatch(setAllFins(fins));
  },
  changeSubmittedTransaction: (submittedtransaction) => {
    dispatch(changeSubmittedTransaction(submittedtransaction))
  },
  loadFromCache: () => {
    dispatch(setFinsFromCache())
  },
  setLastBlock: (block) => {
    dispatch(setLastBlock(block))
  }
});

export default connect(
  mapStatesToProps,
  mapDispatchToProps,
)(FDListener);

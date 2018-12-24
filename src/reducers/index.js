import {
  CHANGE_ERRORMSG,
  CHANGE_FININPUT,
  CHANGE_FININPUTERROR,
  CHANGE_KMINPUT,
  CHANGE_KMINPUTERROR,
  CHANGE_SUBMITTEDTRANSACTION,
  OPEN_DIALOG,
  CLOSE_DIALOG,
  RESET_STORE,
  SET_FIN_AWAITING_VALIDATION,
  DEL_FIN_AWAITING_VALIDATION,
  SET_FINS_FROM_CACHE,
  SET_LAST_BLOCK
} from "../actions";

const initialState = {
  inputs: {
    fininput: "",
    fininputerror: false,
    kminput: "",
    kminputerror: false,
    errormsg: "",
    submittedtransaction: "",
    dialogfin: "",
  },
  updates: {
    lastBlock: undefined
  },
};

const initialStateInput = {
  fininput: "",
  fininputerror: false,
  kminput: "",
  kminputerror: false,
  errormsg: "",
  submittedtransaction: "",
  dialogfin: "",
};

const initialStateUpdates = {
  lastBlock: undefined
};

//Input Case reducers
function changeFininput(inputstate, action) {
  let newState = inputstate;
  newState.fininput = action.fininput;
  return newState
}
function changeFininputError(inputstate, action) {
  let newState = inputstate;
  newState.fininputerror = action.fininputerror;
  return newState
}
function changeKmInput(inputstate, action) {
  let newState = inputstate;
  newState.kminput = action.kminput;
  return newState
}
function changeKmInputError(inputstate, action) {
  let newState = inputstate;
  newState.kminputerror = action.kminputerror;
  return newState
}
function changeErrormsg(inputstate, action) {
  let newState = inputstate;
  newState.errormsg = action.errormsg;
  return newState
}
function changeSubmittedTransaction(inputstate, action) {
  let newState = inputstate;
  newState.submittedtransaction = action.submittedtransaction;
  return newState
}
function openDialog(inputstate, action) {
  let newState = inputstate;
  newState.dialogfin = action.fin;
  return newState
}
function closeDialog(inputstate, action) {
  let newState = inputstate;
  newState.dialogfin = "";
  return newState
}

function inputReducer(inputState = initialStateInput, action) {
  switch(action.type) {
    case CHANGE_FININPUT:
      return changeFininput(inputState, action);
    case CHANGE_FININPUTERROR:
      return changeFininputError(inputState, action);
    case CHANGE_KMINPUT:
      return changeKmInput(inputState, action);
    case CHANGE_KMINPUTERROR:
      return changeKmInputError(inputState, action);
    case CHANGE_ERRORMSG:
      return changeErrormsg(inputState, action);
    case CHANGE_SUBMITTEDTRANSACTION:
      return changeSubmittedTransaction(inputState, action);
    case OPEN_DIALOG:
      return openDialog(inputState, action);
    case CLOSE_DIALOG:
      return closeDialog(inputState);
    default:
      return inputState;
  }}

//Input Case reducers
function setFinAwaitingValidation(updatesstate, action) {
  let newState = updatesstate;
  newState[action.payload.fin] = {km: action.payload.km, datum: action.payload.datum};
  sessionStorage.setItem("HcUpdatesState", JSON.stringify(newState));
  return newState
}

function delFinAwaitingValidation(updatesstate, action) {
  let newState = updatesstate;
  newState[action.payload.fin] = undefined;
  sessionStorage.setItem("HcUpdatesState", JSON.stringify(newState));
  return newState
}

function setFinsFromCache(updatesstate, action) {
  var newState = updatesstate;
  try {
    let oldState = sessionStorage.getItem("HcUpdatesState");
    if (oldState != null) {
      console.log("Session wird fortgesetzt");
      console.log(oldState);
      newState = JSON.parse(oldState);
    }
  } catch (err) {
    console.log(err)
  } finally {
    return newState;
  }
}

function setLastBlock(updatesstate, action){
  let newState = updatesstate;
  newState.lastBlock = action.block;
  sessionStorage.setItem("HcUpdatesState", JSON.stringify(newState));
  return newState
}

function updatesReducer(inputState = initialStateUpdates, action) {
  switch(action.type) {
    case SET_FIN_AWAITING_VALIDATION:
      return setFinAwaitingValidation(inputState, action);
    case DEL_FIN_AWAITING_VALIDATION:
      return delFinAwaitingValidation(inputState, action);
    case SET_FINS_FROM_CACHE:
      return setFinsFromCache(inputState, action);
    case SET_LAST_BLOCK:
      return setLastBlock(inputState, action);
    default:
      return inputState;
  }}

function reducer(state = initialState, action) {
  return {
    inputs: inputReducer(state.inputs, action),
    updates: updatesReducer(state.updates, action),
  }
}

export default reducer;

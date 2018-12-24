/* Änderungshistorie
* Zweck des Dokuments: Im folgenden werden die Aktionen des Frontends definiert.
*
* Änderungen:
* Name: Friedemann
* Datum: 02.12.2018
* Änderung vorgenommen: Nicht-benötigte Actions entfernt
*
*/

// Action types
export const CHANGE_FININPUT = 'CHANGE_FININPUT';
export const CHANGE_FININPUTERROR = 'CHANGE_FININPUTERROR';
export const CHANGE_KMINPUT = 'CHANGE_KMINPUT';
export const CHANGE_KMINPUTERROR = 'CHANGE_KMINPUTERROR';
export const CHANGE_ERRORMSG = 'CHANGE_ERRORMSG';
export const CHANGE_SUBMITTEDTRANSACTION = 'CHANGE_SUBMITTEDTRANSACTION';
export const SET_FIN_AWAITING_VALIDATION = 'SET_FIN_AWAITING_VALIDATION';
export const DEL_FIN_AWAITING_VALIDATION = 'DEL_FIN_AWAITING_VALIDATION';
//Nur nutzen um Updates aus Cache zu laden!
export const SET_FINS_FROM_CACHE = 'SET_FINS_FROM_CACHE';
export const OPEN_DIALOG = 'OPEN_DIALOG';
export const CLOSE_DIALOG = 'CLOSE_DIALOG';
export const RESET_STORE = 'RESET_STORE';
export const SET_LAST_BLOCK = 'SET_LAST_BLOCK';
// Other constants


// Action creators
export function changeFinInput(fininput) {
  return ({
    type: CHANGE_FININPUT, fininput
  });
}

export function changeFinInputError(fininputerror) {
  return ({
    type: CHANGE_FININPUTERROR, fininputerror
  });
}

export function changeKmInput(kminput) {
  return ({
    type: CHANGE_KMINPUT, kminput
  });
}

export function changeKmInputError(kminputerror) {
  return ({
    type: CHANGE_KMINPUTERROR, kminputerror
  });
}

export function changeErrorMsg(errormsg) {
  return ({
    type: CHANGE_ERRORMSG, errormsg
  });
}

export function changeSubmittedTransaction(submittedtransaction) {
  return ({
    type: CHANGE_SUBMITTEDTRANSACTION, submittedtransaction
  });
}

export function setFinAwaitingValidation(fin, km, datum) {
  return ({
    type: SET_FIN_AWAITING_VALIDATION, payload: {fin: fin, km: km, datum: datum}
  });
}

export function delFinAwaitingValidation(fin) {
  return ({
    type: DEL_FIN_AWAITING_VALIDATION, payload: {fin: fin}
  });
}

export function setFinsFromCache(fins) {
  return ({
    type: SET_FINS_FROM_CACHE, fins
    })
}

export function openDialog(fin) {
  return ({
    type: OPEN_DIALOG, fin
  });
}

export function closeDialog() {
  return ({
    type: CLOSE_DIALOG
  });
}

export function resetStore() {
  return ({
    type: RESET_STORE
  })
}

export function setLastBlock(block){
  return ({
    type: SET_LAST_BLOCK, block
    })
}

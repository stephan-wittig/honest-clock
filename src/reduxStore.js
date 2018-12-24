// Stephan: Hier liegen alle Konfigurationen zum redux store drin

// Redux
import {createStore} from "redux";
import reducer from "./reducers";
import {devToolsEnhancer} from "redux-devtools-extension";

const reduxStore = createStore(reducer, devToolsEnhancer());

export default reduxStore;

/* Änderungshistorie
* Name: Stephan
* Datum: 14.10.2018
* Zweck des Dokuments: Alle Einstellungen zu Drizzle, die benötigt werden, um den Context Provider aufzusetzen
*
* Änderungen:
* Name: Fabienne
* Datum: 16.10.2018
* Änderungen vorgenommen: Importieren des Mock Contracts "MockClock"
*
* Name: Fabienne
* Datum: 10.11.2018
* Änderungen vorgenommen: Importieren und Verbinden des Contracts "HonestClock"
*/
import {Drizzle, generateStore} from "drizzle";
// Contracts
import HonestClock from '../build/contracts/HonestClock.json'

// Drizzle Options
const options = {
  web3: {
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:8545"
    }
  },
  contracts: [
    HonestClock
  ]
};

const store = generateStore(options);


const drizzle = new Drizzle(options, store);

export default drizzle;

/* Änderungshistorie
* Zweck des Dokuments: Header.js enthält die HTML für den Header Container. Außerdem wird ein Titel eingefügt.
* Die Styles stammen aus dem Dokument Header.css
* Außerdem werden Name und Berechtigung aus derm Redux-Store ausgelesen und ausgegeben.
*
* Änderung:
* Name: Lucas
* Datum: 20.11.2018
* Änderungen vorgenommen: Einbinden des Bildes
*
* Name: Friedemann
* Datum: 02.12.2018
* Änderungen vorgenommen: Header liest Berechtigung nun selbst aus Blockchain aus & Einbinden der resetStore action
*
* Name: Selina
* Datum: 03.12.2018
* Änderungen vorgenommen: Berechtigung in Worte ändern
*/
import React from "react";
import {connect} from "react-redux";
import style from "./Header.css";
import {withRouter} from "react-router-dom";
import ContractData from "../../components/contractData/ContractData";
import {DrizzleContext} from "drizzle-react";
import {resetStore} from "../../actions";


class Header extends React.Component {
  componentDidMount() {
    if (typeof window.ethereum !== 'undefined'
      || (typeof window.web3 !== 'undefined')) {

      // Web3 browser user detected. You can now use the provider.
      const provider = window['ethereum'] || window.web3.currentProvider;

      window.ethereum.on('accountsChanged', function (accounts) {
        window.location.reload()
      })
    }
  }

  handleBerechtigung(permission){
      if (permission.length > 0) {
          if (permission == 1) {
              return <h3 className={style.subtitle}>Berechtigung: Werkstatt</h3>;
          }
          if (permission == 2) {
              return <h3 className={style.subtitle}>Berechtigung: TÜV</h3>;
          }
          if (permission == 3) {
              return <h3 className={style.subtitle}>Berechtigung: HonestClock</h3>;
          }}
  }

  render() {
    return (
      <DrizzleContext.Consumer>
        {(drizzleContext) => {
          return (
            <div>
              <ContractData
                contract={"HonestClock"}
                method={"getPermissionLevel"}
                args={[drizzleContext.drizzleState.accounts[0]]}
              >
                {(permission) => {
                  return (
                    <header className={style.header}>
                      <h1 onClick={(ev) => {
                        this.props.resetStore();
                        this.props.history.push('/');
                      }} className={style.title}>HONESTCLOCK</h1>
                      {this.handleBerechtigung(permission)}
                    </header>
                  );
                }}
              </ContractData>
            </div>
          )
        }}
      </DrizzleContext.Consumer>
    )
  };
}

//Redux Variablen können oben über this.props.[name] aufgerufen werden
const mapStatesToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  resetStore: (reset) => {
    dispatch(resetStore())
  }

});

export default withRouter(connect(
  mapStatesToProps,
  mapDispatchToProps,
)(Header));
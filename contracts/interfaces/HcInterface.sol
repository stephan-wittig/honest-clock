pragma solidity ^0.4.24;/// @title HonestClock backend interface
/*
Standart Interface der Blockchain von HC.
Interface wurde nach Architekturvorgaben (http://honestclock.net:8090/display/CROS/Schnittstellenkonzept)
unter absprache von Front- und Backend erstellt.
*/
// Version 1.0.2 (Version-Tag erzeugt Compiler error)
interface HonestClockInterface {
//Events will be activated with an other pull REwuest
  event updated(
    bytes17 fin,
    uint32 km,
    uint256 blocknummer
    );

  event validated(
    bytes17 fin,
    bool akzeptiert
    );

  event corrected(
    bytes17 fin,
    uint32 oldValue,
    uint32 newValue
    );


//_____________Fahrzeug registrieren____________________________________________
  /** @dev Legt ein neues Fahrzeug in der BC an
      @param fin - Die Fahrzeugidentifikationsnummer des anzulegenden Fahrzeuges
      @param km - Der Aktuelle Kilometerstand mit dem das Harzeug inital angelegt wird
      @notice Berechtigung: TUEV + Haendler + Werkstaetten
  */
  function createVehicle(bytes17 fin, uint32 km) external;

//_____________Kilometerstand updaten___________________________________________
  /** @dev Aktualisiert den Aktuellen Kilometerstand eines Fahrzeuges
      @param fin - Die Fahrzeugidentifikationsnummer des zu aktualisierenden Fahrzeuges
      @param km - Der neue Kilometerstand des Fahrzeuges
      @notice Berechtigung: TUEV + Haendler + Werkstaetten
  */
  function updateKM(bytes17 fin, uint32 km) external payable;

//_____________Kilometerstand abfragen__________________________________________
  /** @dev Liefert den aktuellen Kilometerstand des Fahrzeuges
      @param fin - Die Fahrzeugidentifikationsnummer des Fahrzeuges dessen KM abgefragt werden soll
      @return Der Kilometerstand des abgefragten Fahrzeuges als uint32
      @notice Berechtigung: ALLE
  */
  function getKM(bytes17 fin) external view returns (uint32);
  /** @dev Liefert den Block in dem das Fahrzeug zuletzt geupdated/erstellt wurde
      @param fin - Die Fahrzeugidentifikationsnummer des Fahrzeuges dessen KM abgefragt werden soll
      @return Die ID des Blocks
      @notice Berechtigung: ALLE
  */

//_____________Kilometerstand korrigiert________________________________________
  /** @dev Korrigiert den Kilometerstand eines Fahrzeuges OHNE dabei eine FraudDetection anzustoßen
      @param fin - Die Fahrzeugidentifikationsnummer des Fahrzeuges dessen KM abgefragt werden soll
      @param km - Der korrigierte Kilometerstand des Fahrzeuges
      @notice Berechtigung: TUEV
  */
  function correctKM(bytes17 fin, uint32 km) external;


//_____________Registrierugn Pruefen____________________________________________
  /** @dev Ueberpruefen ob eine FIN in der BC exsitert und somit auch das Fahrzeug schon angelegt wurde.
      @param fin - Die Fahrzeugidentifikationsnummer des Fahrzeuges dessen exitenz in der BC ueberprueft werden soll
      @return boolen (true/false) ob die FIN existiert
      @notice Berechtigung: ALLE
  */
  function FINexists(bytes17 fin) external view returns (bool);


//_____________Blocknummer der letzten eintragung eines Fahzeugs________________
  /** @dev Gibt die Blocknummer des Blockes aus in dem das Fahrzeug zulezt gemined wurde.
      @param fin - Die Fahrzeugidentifikationsnummer des Fahrzeuges dessen letzter Block ermittelt werden soll
      @return Die nummer des Blocks in dem das Fahzeuu zuletzt gemined wurde
      @notice Berechtigung: ALLE
  */
  function getBlocknumber(bytes17 fin) external view returns (uint256);

//_____________Permission-Level setzten_________________________________________
  /** @dev Setzt ein permission level fuer eine Addresse
      @param permAddress - Adresse des Wallet owners
      @param setLevel - permission level dass gesetzt werden soll
      @notice Berechtigung: CONTRACT OWNER
  */
  function setPermissionLevel(address permAddress, byte setLevel) external;


//_____________Permission-Level abfragen_________________________________________
  /** @dev Fragt ein permission level fuer eine Adresse ab
      @param permAddress - Adresse des Wallet owners
      @return Das permission level fuer die den Wallet Owner (address)
      @notice Berechtigung: ALLE
  */
  function getPermissionLevel(address permAddress) external view returns (byte);


//_____________Ether vom Contract abheben_______________________________________
  /** @dev Hebt ehter vom Contract ab und sendet diesem zum receiver
      @param receiver - Adresse des Wallet owners an den der Ether gesendet werden soll
      @notice Berechtigung: CONTRACT OWNER
  */
  function withdraw(address receiver) external;


//_____________KM update validieren_____________________________________________
  /* @dev fuegt einen KM update eine validiteatsmetrik hinzu
      @param fin - FIN des Fahrzeugs dessen update validiert wurde
      @param km - validierter KM Stand
      @param metrik - qualiteatsmetrik wie valide die aenderung basierend auf der FD ist
      @notice Berechtigung: FRAUD DETECTION

  function validate(bytes17 fin, uint32 km, uint32 metrik) external;
  */
// ________________________DRAFT DO NOT USE____________________________________
//  function getConfidence(bytes17 fin)
}

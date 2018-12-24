// Aktuell verwendete Solidity Version
pragma solidity ^0.4.24;

/*
 Allgemeine Informationen:
 Gruppenprojekt der Frankfurt School of Finance & Management
 B.Sc. Class Business Administration with focus on Business Information Systems
 Intake 2015
________________________________________________________________________________________
 Contract Information:
 HonestClock Contract v0.1
 Enthält:
 - Notwendige Funktionen zum einhalten des ERC721 Standards
 - sieben weitere, selbstgeschriebene Funktionen für den Zweck des Projektes
 Owner: Tim Gabriel (Projektleiter Backend)
________________________________________________________________________________________
 Zweck des Contracts:
 Der contract bzw. das Projekt sollen in Zukunft dazu dienen es Autobesitzern zu ermöglichen den KM-Stand ihrer Autos laufend zu tracken und zu verifizieren.
 Dies soll dazu dienen zukunüftigen potenziellen Käufern eine verlässliche Quelle zu bieten, um sich vor Betrug durch Veränderung des KM-Standes, zu schützen.
 An dem Projekt arbeiten verschiedene Teams der oben genannten Kohorte/Klasse. Der hier vorliegende Teil des Codes wurde initial vom Backend-Team erstellt und
 wird von diesem gepflegt..
*/

// Importiert zwei basis contracts des openzeppelin frameworks um mit der Implementierung des ERC721-Standards und ? zu helfen
import "openzeppelin-solidity/contracts/token/ERC721/ERC721BasicToken.sol";
import "./interfaces/HcInterface.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

// Unser in den allgemeinen Informationen beschriebener contract
contract HonestClock is ERC721BasicToken, HonestClockInterface {
  using SafeMath for uint256;

  //Event that should be triggerd when an new/inital km is inserted in order to pase data to the Fraud Detection
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

  uint8 public countTokenId;
  address public owner;

  ///////////////////////////////////////////////////////////////////////////
  //    Structure definieren
  ///////////////////////////////////////////////////////////////////////////
  /** Wir benutzen ein structure für unsere Fahrzeuge um mehrere Variablen, die zu diesem Fahrzeug gehören, in einer Einheit speicher zu können
      @dev Legt den Aufbau des structures mit den enthaltenen Parametern fest
      @param fin - Die Fahrzeugidentifikationsnummer des jeweiligen Fahrzeuges
      @param km - Der Aktuelle Kilometerstand des jeweiligen Farzeuges
      @param dateOfEntry - Zeitpunkt der letzen Eintragung
  */
  struct Vehicle {
    bytes17 fin;
    uint32 km;              // letzter eingetragener KM-Stand
    uint256 dateOfEntry;    // Zeitpunkt der letzten Eintragung
    uint8 quality;          // Qualtitätsmetrik
  }

  //_____________Mapping erklärt_________________________________________________________
  /** Mapping weist einem Wert jeweils einen anderen Wert zu und speichert diese Verbindung in einem "Container". Es wird dadruch erlaubt/möglich, durch ein Aufrufen
      des Elementes direkt den zugehörigen Wert abzufragen. Da man sich das "abgehen" des Arrays spart, können hierdurch erhebliche Geschwindigkeitsverbesserungen
      erzielt werden. Die Nachteile liegen darin, dass man nicht (genau) sagen kann, wie groß der "Container" aktuell ist, da kein "Loop through" möglich ist.
  */
  // Mapping von FIN zu tokenId
  mapping (bytes17 => uint256) FINtoId;
  // Mapping von tokenId zu Struct
  mapping (uint256 => Vehicle) IdToVehicle;
  // Mapping von TokenId zu BlockNumber
  mapping (uint256 => uint256) IdToBlockNumber;
  // Mapping der Permission-Levels
  mapping (address => byte) PermissionLevel;


  constructor() public {
    countTokenId = 0;
    PermissionLevel[msg.sender] = 0x03;
  }

  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  ////                                                                   ////
  ////                      INTERNE FUNKTIONEN                           ////
  ////                                                                   ////
  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////


  ///////////////////////////////////////////////////////////////////////////
  //    Neue FIN anlegen und entsprechende TokenID erstellen
  ///////////////////////////////////////////////////////////////////////////
  /** @dev Erstellt für eine gegebene FIN eine neue ID, dies hilft im weiteren Verlauf beim Ansprechen der Fahrzeug-Einheit
      @param fin - Die Fahrzeugidentifikationsnummer des jeweiligen Fahrzeuges, die übergeben wurde

      //Sollten wir das nicht machen?
      @notice Es findet eine Überprüfung statt, ob die FIN bereits eine ID erhalten hat
  */

  function createIdForFIN(bytes17 fin) private {

    // neuer Eintrag mit FIN zu tokenId
    countTokenId += 1;
    FINtoId[fin] = countTokenId;
  }

  ///////////////////////////////////////////////////////////////////////////
  //    Km-Stand für tokenId eintragen
  ///////////////////////////////////////////////////////////////////////////
  /** @dev Legt für ein Vehicle einen Km-Stand mit dem heutigen Datum fest
      @param tokenId - Die ID, für die das (hier erstellte) Fahrzeug-Structure mit den Parametern erstellt werden soll
      @param fin - Die Fahrzeugidentifikationsnummer des jeweiligen Fahrzeuges, die übergeben wurde
      @param km - Der Kilometerstand der dem Fahrzeug zugewiesen wird
      @notice Das Datum, welches bei der Funktion erwartet wird, wird innerhalb der Funktion auf das aktuelle Datum gesetzt
  */

  function setKM(uint256 tokenId, bytes17 fin, uint32 km, uint8 quality) private {
    uint256 date = now;

    require(km >= 0, "You can&apos;t set a negative km-value");
    IdToVehicle[tokenId] = Vehicle(fin, km, date, quality);
    IdToBlockNumber[tokenId] = block.number;
  }


  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  ////                                                                   ////
  ////                      EXTERNE FUNKTIONEN                           ////
  ////                                                                   ////
  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////
  //    User Story: Fahrzeug registrieren
  ///////////////////////////////////////////////////////////////////////////
  /** @dev Legt ein neues Fahrzeug in der BC an
      @param fin - Die Fahrzeugidentifikationsnummer des anzulegenden Fahrzeuges
      @param km - Der Aktuelle Kilometerstand mit dem das Fahrzeug inital angelegt wird
      @notice Berechtigung: HonestClock + TUEV + Werkstaetten (inkl. Händler)
  */

  function createVehicle(bytes17 fin, uint32 km) external {

    require(FINexists(fin)==false, "FIN already exists");
    require(km>=0, "Km-value cannot be negative");
    require(km<=4294967286, "Km-value too large");
    require(PermissionLevel[msg.sender]==0x01||PermissionLevel[msg.sender]==0x02, "You don&apos;t have the permission to create a vehicle.");
    // neuer Eintrag mit FIN zu tokenId
    createIdForFIN(fin);

    _mint(msg.sender, FINtoId[fin]);
    setKM(FINtoId[fin], fin, km, 0);
    //Trigger event:
    emit updated(fin, km, block.number);
  }


  ///////////////////////////////////////////////////////////////////////////
  //    User Story: Km-Stand updaten
  ///////////////////////////////////////////////////////////////////////////
  /** @dev Triggert die Update Funktion im Fraud Detection Server
      @param fin - Die Fahrzeugidentifikationsnummer des zu aktualisierenden Fahrzeuges
      @param km - Der neue Kilometerstand des Fahrzeuges
      @notice Berechtigung: HonestClock + TUEV + Werkstaetten (inkl. Händler); msg.sender wird in der Funktion erkannt und ist der User, der die Funktion aufruft
  */

  function updateKM(bytes17 fin, uint32 km) external payable {

    require(FINexists(fin)==true, "FIN doesn&apos;t exist");
    require(km>0, "Km-value cannot be negative or zero");
    require(km<=4294967296, "Km-value too large");
    require(PermissionLevel[msg.sender]==0x01||PermissionLevel[msg.sender]==0x02, "You don&apos;t have the permission to update the km-value.");
    //require(msg.value>=999,"You haven&apos;t sent enough wei");
    require(getKM(fin)<=km, "You can&apos;t update with a smaller km-value.");

    //Trigger event:
    emit updated(fin, km, block.number);
  }

  ///////////////////////////////////////////////////////////////////////////
  //    Änderung durchführen und validieren
  ///////////////////////////////////////////////////////////////////////////
  /** @dev Aktualisiert den Aktuellen Kilometerstand eines Fahrzeuges nach Bestätigung durch FD Server
      @param fin - Die Fahrzeugidentifikationsnummer des zu aktualisierenden Fahrzeuges
      @param km - Der neue Kilometerstand des Fahrzeuges
      @param Blocknumber - Blocknummer der Transaktion
      @param valid - Markiert die Transaktion als valide oder nicht
      @notice Berechtigung: Fraud Detection; msg.sender wird in der Funktion erkannt und ist der User, der die Funktion aufruft
  */


//Irgendwas muss noch mit der Blocknummer gemacht werden
  function validate(bytes17 fin, uint32 km, uint256 Blocknumber, bool valid, uint8 quality) external {
    
    //Trigger event:
    emit validated(fin, valid);

    require(PermissionLevel[msg.sender]==0x04, "You don&apos;t have the permission to use this function.");
    if(valid){
      setKM(FINtoId[fin], fin, km, quality);
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  //    User Story: Km-Stand abrufen
  ///////////////////////////////////////////////////////////////////////////
  /** @dev Liefert den aktuellen Kilometerstand des Fahrzeuges
      @param fin - Die Fahrzeugidentifikationsnummer des Fahrzeuges dessen KM abgefragt werden soll
      @return vehicle.km Der Kilometerstand des abgefragten Fahrzeuges als uint32
      @notice Berechtigung: ALLE
  */

  function getKM(bytes17 fin) public view returns (uint32) {

    require(FINexists(fin)==true, "FIN doesn&apos;t exist");

    return IdToVehicle[FINtoId[fin]].km;
  }

  ///////////////////////////////////////////////////////////////////////////
  //    User Story: Km-Stand korrigieren
  ///////////////////////////////////////////////////////////////////////////
  /** @dev Korrigiert den Kilometerstand eines Fahrzeuges OHNE dabei eine FraudDetection anzustoßen
      @param fin - Die Fahrzeugidentifikationsnummer des Fahrzeuges dessen KM abgefragt werden soll
      @param km - Der korrigierte Kilometerstand des Fahrzeuges
      @notice Berechtigung: HonestClock + TUEV + Fraud Detection; msg.sender wird in der Funktion erkannt und ist der User, der die Funktion aufruft;
      Der alte Kilometerstand old_km wird in der Funktion mithilfe von getKM abgefragt
  */

  function correctKM(bytes17 fin, uint32 km) external {

    require(FINexists(fin)==true, "FIN doesn&apos;t exist");
    require(km>=0, "Km-value cannot be negative");
    require(km<=4294967296, "Km-value too large");
    require(PermissionLevel[msg.sender]==0x02, "You don&apos;t have the permission to correct the km-value.");

    uint32 old_km = getKM(fin);

    setKM(FINtoId[fin], fin, km, 4);

    //Trigger Event:
    emit corrected(fin, old_km, km);
  }

  ///////////////////////////////////////////////////////////////////////////
  //    Überprüfung, ob FIN bereits existiert
  ///////////////////////////////////////////////////////////////////////////
  /** @dev Überprüft, ob eine FIN bereits auf der BC vorhanden ist
      @param fin - FIN, nach welcher in der BC gesucht werden soll
      @return boolischer Wert, welcher ein Vorhandensein entweder bestätigt oder verneint
  */

  function FINexists(bytes17 fin) public view returns (bool) {

    return exists(FINtoId[fin]);
  }

  ///////////////////////////////////////////////////////////////////////////
  //    Blocknummer für FIN erhalten
  ///////////////////////////////////////////////////////////////////////////
  /** @dev Überprüft, ob die FIN in einer Blocknummer genannt ist
      @param fin - FIN, nach welcher in der BC gesucht werden soll
      @return numerischer (unit256) Wert, welcher die (letzte) Blocknummer zurückgibt
      @notice Es findet eine überprüfung statt, ob die FIN in der BC existiert
  */

  function getBlocknumber(bytes17 fin) external view returns (uint256) {

    require(FINexists(fin)==true, "FIN doesn&apos;t exist");

    return IdToBlockNumber[FINtoId[fin]];
  }

  ///////////////////////////////////////////////////////////////////////////
  //    Permission Level festlegen
  ///////////////////////////////////////////////////////////////////////////
  /** @dev Legt für einen User ein Berechtigungslevel fest
      @param permAddress - User, wessen Berechtigungslevel festgelegt werden soll
      @param setLevel - Berechtigungslevel, welches für den User gelten soll
      @notice Berechtigung: HonestClock; msg.sender wird in der Funktion erkannt und ist der User, der die Funktion aufruft
  */

  function setPermissionLevel(address permAddress, byte setLevel) external {

    require(PermissionLevel[msg.sender]==0x03, "You don&apos;t have the permission to set permission levels");
    require(permAddress!=msg.sender, "You cannot set permission for your own address");
    require(setLevel<=0x04, "The permission level is invalid");

    PermissionLevel[permAddress] = setLevel;
  }

  ///////////////////////////////////////////////////////////////////////////
  //    Permission Level abfragen
  ///////////////////////////////////////////////////////////////////////////
  /** @dev Überprüft, ob für einen User eine Berechtigung vorhanden ist
      @param permAddress - User, wessen Berechtigungslevel abgefragt werden soll
      @return numerischer Wert (byte), welcher das vorhandene Berechtigungslevel zurückgibt
  */

  function getPermissionLevel(address permAddress) external view returns (byte) {

    return PermissionLevel[permAddress];
  }

  ///////////////////////////////////////////////////////////////////////////
  //    Abheben aller Ether vom Contract und Überweisung an HC-Adresse
  ///////////////////////////////////////////////////////////////////////////
  /** @dev Zahlt das gewonnene Ether an die HC-Addresse aus
      @param receiver - User, welcher die Ether erhalten soll
      @notice Berechtigung: HonestClock, msg.sender wird in der Funktion erkannt und ist der User, der die Funktion aufruft
  */

  function withdraw(address receiver) external {

    require(PermissionLevel[msg.sender]==0x03, "You don&apos;t have the permission to withdraw funds");
    require(PermissionLevel[receiver]==0x03||PermissionLevel[receiver]==0x04, "The receiver address doesn&apos;t have the necessary permission level");

    receiver.transfer(address(this).balance);
  }

  ///////////////////////////////////////////////////////////////////////////
  //    Qualitätsmetrik abfragen
  ///////////////////////////////////////////////////////////////////////////
  /** @dev Abfrage der Qualitätsmetrik für die FIN
      @param fin - Die Fahrzeugidentifikationsnummer des Fahrzeuges dessen Qualitätsmetrik abgefragt werden soll
      @return vehicle.qualität Die Qualitätsmetrik des abgefragten Fahrzeuges als uint8
      @notice Berechtigung: ALLE
  */

  function getQuality(bytes17 fin) public view returns (uint8) {

    require(FINexists(fin)==true, "FIN doesn&apos;t exist");

    return IdToVehicle[FINtoId[fin]].quality;
  }
}

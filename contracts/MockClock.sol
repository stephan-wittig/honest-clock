// Stephan: Das sollte mal jemand dokumentieren
pragma solidity ^0.4.24;

import "./interfaces/HcInterface.sol";

contract MockClock {
  // FIN zu boolean (existiert ja/nein?)
  mapping (bytes17 => bool) internal existiert;
  // FIN zu KM-Stand
  mapping (bytes17 => uint32) internal kmStand;
  // FIN zu Blocknummer letzter Eintragung
  mapping (bytes17 => uint256) internal blockNummer;
  // Addresse des Erstellers des COntracts
  address public contractOwner;

  constructor() public {
    contractOwner = msg.sender;
  }

  function createVehicle(bytes17 fin, uint32 km) external {
    require(!existiert[fin], "This FIN is already registered!");

    existiert[fin] = true;
    kmStand[fin] = km;
  }

  function updateKM(bytes17 fin, uint32 km) external {
    require(km >= kmStand[fin], "New value is smaller than old value!");

    setKM(fin, km);
  }

  function getKM(bytes17 fin) external view returns (uint32) {
    require(existiert[fin], "This FIN is not registered yet!");

    return kmStand[fin];
  }

  function getBlocknumber(bytes17 fin) external view returns (uint256) {
    require(existiert[fin], "This FIN is not registered yet!");

    return blockNummer[fin];
  }

  function correctKM(bytes17 fin, uint32 km) external {
    require(msg.sender == contractOwner, "Sorry, I cant let you do that.");

    setKM(fin, km);
  }

  function setKM(bytes17 fin, uint32 km) internal {
    require(existiert[fin], "This FIN is not registered yet!");

    kmStand[fin] = km;
    blockNummer[fin] = block.number;
  }

}

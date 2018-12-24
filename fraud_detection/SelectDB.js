
exports.Select = async function (fin) {
var sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./Database.db', sqlite3.OPEN_READWRITE)

return new Promise(function(resolve, reject) {
  db.all("SELECT Km, BlockNummer, Flag, Fin, Metrik FROM frauddetection WHERE Fin = '" + fin + "' ORDER BY BlockNummer;", (err, rows) => {
    if (err) {
      console.log(err.message);
      reject(err);
    }else{
      rows.forEach((row) => {
        console.log(row.Km,row.BlockNummer, row.Flag, row.Fin);
      });
      resolve(rows);
    }
  });
});
};

//Nur die 3 letzten einträge ausgeben
exports.TopSelect = async function (fin) {
var sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./Database.db', sqlite3.OPEN_READWRITE)

return new Promise(function(resolve, reject) {
  db.all("SELECT * FROM frauddetection WHERE fin = '" + fin + "' ORDER BY Time DESC LIMIT 3;", (err, rows) => {
    if (err) {
      console.log(err.message);
      reject(err);
    }else{
      rows.forEach((row) => {
        console.log(row.Km,row.BlockNummer);
      });
      resolve(rows);
    }
  });
});
};

//Return Last Block Number saved in saveaddress
exports.LastBlock = async function () {
var sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./Database.db', sqlite3.OPEN_READWRITE)

return new Promise(function(resolve, reject) {
  db.all("SELECT BlockNummer FROM saveaddress", (err, rows) => {
    if (err) {
      console.log(err.message);
      reject(err);
    }else{
      rows.forEach((row) => {
        console.log('Alte Blocknummer wird abgefragt: ' + row.BlockNummer);
      });
      resolve(rows);
    }
  });
});
};

//Return Last Contract Address saved in saveaddress
exports.LastAddress = async function () {
var sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./Database.db', sqlite3.OPEN_READWRITE)

return new Promise(function(resolve, reject) {
   db.all("SELECT Address FROM saveaddress", (err, rows) => {
    if (err) {
      console.log(err.message);
      reject(err);
    }else{
      rows.forEach((row) => {
        console.log('Alte Adresse wird abgefragt: ' + row.Address);
      });
      resolve(rows);
    }
  });
});
};
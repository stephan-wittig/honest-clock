exports.Update = function (fin, oldValue, newValue, flag, metrik, address, blocknumber) {
var sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./Database.db', sqlite3.OPEN_READWRITE)

var time = new Date()

  if (flag === false)
  {
	int_Flag = 0;
  }	else if (flag === true) {
	int_Flag = 1;
  } else {
  int_Flag = null
	console.log('UPDATEDB: Flag is not set');
  }

db.run("UPDATE frauddetection SET Km = (?), Time = (?), Flag = (?), Metrik = (?) WHERE Fin = (?) and Km = (?)", [newValue, time , flag, metrik, fin, oldValue], (err) => {
  if (err) {
    console.log(err.message);
  }else{
  console.log('UPDATEDB: KM geupdated: ' + oldValue + ' gegen ' + newValue + ' ersetzt für Fin = ' + fin);
  }
});

//Save Blocknummer des letzten Eintrags 
db.run("UPDATE saveaddress SET BlockNummer = (?) WHERE Address = (?)", [blocknumber,address], (err) => {
  if (err) {
    console.log(err.message);
  }else{
  console.log('UPDATEDB (saveaddress Tabelle): Blocknummer: ' + blocknumber);
  }
});
};
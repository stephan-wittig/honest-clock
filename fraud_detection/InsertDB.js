exports.Insert = function (fin,km,blocknumber,flag,metrik,address) {
  var sqlite3 = require('sqlite3').verbose();
  const db = new sqlite3.Database('./Database.db', sqlite3.OPEN_READWRITE);

  if (flag === false)
  {
	int_Flag = 0;
  }	else if (flag === true) {
	int_Flag = 1;
  } else {
  int_Flag = null
	console.log('INSERTDB: Flag is not set');
  }

  return new Promise(function(resolve, reject) {
    db.run("INSERT into frauddetection values(?,?,?,datetime('now', 'localtime'),?,?)", [fin.toString(),km,blocknumber,int_Flag,metrik], (err) => {
      if (err) {
        console.log(err.message);
        reject(err);
      }else{
        console.log('INSERTDB: Folgende daten hinzugefuegt: ' + fin +' '+ km +' '+ blocknumber + ' ' + int_Flag + ' ' + metrik);
        resolve();
      }
    });
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

exports.NewDB = function (blocknumber, address) {
  var sqlite3 = require('sqlite3').verbose();
  const db = new sqlite3.Database('./Database.db', sqlite3.OPEN_READWRITE);

//Save Blocknummer des letzten Eintrags 
db.run("INSERT into saveaddress values(?,?)", [address,blocknumber], (err) => {
  if (err) {
    console.log(err.message);
  }else{
  //console.log('UPDATEDB (saveaddress Tabelle): Blocknummer: ' + blocknumber);
  }
});
};
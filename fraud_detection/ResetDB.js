//Daten Bank resetten mit neuer Contract Adresse und Blocknummer
exports.Reset = function (contract,blocknumber) {
var sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./Database.db', sqlite3.OPEN_READWRITE)

	db.run("DELETE from frauddetection", [], (err) => {
		if (err) {
			console.log(err.message);
		}else{
			console.log('ResetDB: frauddetection tabelle inhalte deleted');
		}
	});
	
	db.run("DELETE from saveaddress", [], (err) => {
		if (err) {
			console.log(err.message);
		}else{
			console.log('ResetDB: saveaddresses tabelle inhalte deleted');
		}
	});

    db.run("INSERT into saveaddress values(?,?)", [contract,blocknumber], (err) => {
		if (err) {
			console.log(err.message);
			reject(err);
		}else{
			console.log('ResetDB: Neue Adresse Contract gespeichert : ' + contract + 'Letzte Blocknummer auf ' + blocknumber + ' gesetzt');
		}
    });
};



exports.Create = function () {
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./Database.db')

db.run("CREATE TABLE frauddetection(Fin TEXT, Km INT, BlockNummer INT, Time TEXT, Flag BOOLEAN, Metrik INT)");
db.run("CREATE TABLE saveaddress(Address TEXT, BlockNummer INT)");
db.close();
};


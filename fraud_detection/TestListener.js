///TEST Listener: Mit dem kann man prüfen, ob die Module funktionieren ohne die Blockchain zu starten////////////////////////////////////

////////Module////////////////////
var db = require('./ConnectDB');//
var ins = require('./InsertDB');//
var upd = require('./UpdateDB');//
var cre = require('./CreateDB');//
var sel = require('./SelectDB');//
//////////////////////////////////
								//
///Mit der Datenbank verbinden////
db.Connect();					//
//////////////////////////////////

var fin = 'gdfewxcfad';
var km = '5234';
var blocknummer = '234';
var oldValue = '2251423';
var newValue = '6453424';
var flag = false;
var metrik = 2;

//Jeh nach bedarf bei Ins oder upd die Kommentierung entfernen.
//ins.Insert(fin,km,blocknummer,flag,metrik);
//upd.Update(fin,oldValue,newValue,flag);
//cre.Create();

var data = sel.TopSelect(fin);
console.log("SQLITE:" + data);
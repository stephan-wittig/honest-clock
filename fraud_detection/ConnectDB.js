exports.Connect = function () {
var sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./Database.db', (err) => {
  if (err) {
    console.log(err.message);
	console.log('CONNECTDB: ERROR - Not Connected to the database.');
  }
  console.log('CONNECTDB: SUCCESSFUL - connected to the database.');
});
};

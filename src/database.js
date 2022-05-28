const sqlite3 = require("sqlite3").verbose();

const DB_SOURCE = "db.sqlite";

const database = new sqlite3.Database(DB_SOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    database.run(
      `CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text
            )`,
      (err) => {
        if (err) {
          console.log("Table already exists");
        } else {
          console.log("Table created");
        }
      }
    );
  }
});

module.exports = database;

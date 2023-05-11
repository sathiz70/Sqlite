const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const DBSOURCE = "./db/mydatabase.db";

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to SQLite database.");
    db.serialize(() => {
      // Check if the users table exists
      db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='users'`, (err, row) => {
        if (err) {
          console.error(err.message);
        } else if (!row) {
          // Create the users table
          db.run(
            `CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            password TEXT NOT NULL
          )`,
            (err) => {
              if (err) {
                console.error(err.message);
              } else {
                console.log("Created users table.");
              }
            }
          );
        }
      });
      // Check if the products table exists
      db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='products'`, (err, row) => {
        if (err) {
          console.error(err.message);
        } else if (!row) {
          // Create the products table
          db.run(
            `CREATE TABLE products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            quantity INTEGER NOT NULL,
            status TEXT NOT NULL
          )`,
            (err) => {
              if (err) {
                console.error(err.message);
              } else {
                console.log("Created products table.");
              }
            }
          );
        }
      });
    });
  }
});

// Hash the password before inserting it into the database
function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

module.exports = db;

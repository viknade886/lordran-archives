console.log("=== INIT STARTED ===");

const db = require("./database");

db.serialize(() => {
  console.log("Inside serialize...");

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user'
    )
  `, (err) => {
    if (err) console.error("Users table error:", err.message);
    else console.log("Users table ready");
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      category TEXT,
      description TEXT,
      image TEXT,
      submittedBy INTEGER,
      approved INTEGER DEFAULT 0,
      redacted INTEGER DEFAULT 0,
      FOREIGN KEY (submittedBy) REFERENCES users(id)
    )
  `, (err) => {
    if (err) console.error("Items table error:", err.message);
    else console.log("Items table ready");
  });

});

console.log("=== INIT FILE END ===");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

const DB_PATH = "./cuidar_mais.db";

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Erro ao abrir o banco de dados: " + err.message);
  } else {
    console.log("Conectado ao banco de dados SQLite.");
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        cpf TEXT UNIQUE,
        telefone TEXT,
        estado TEXT,
        cidade TEXT
      )`,
      (err) => {
        if (err) {
          console.error("Erro ao criar tabela users: " + err.message);
        } else {
          console.log("Tabela users criada ou já existente.");
        }
      }
    );
  }
});

module.exports = db;


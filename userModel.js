const db = require('./database');
const bcrypt = require('bcryptjs');

const userModel = {
  getAllUsers: (callback) => {
    db.all('SELECT id, role, email, cpf, telefone, estado, cidade FROM users', [], callback);
  },

  getUserById: (id, callback) => {
    db.get('SELECT id, role, email, cpf, telefone, estado, cidade FROM users WHERE id = ?', [id], callback);
  },

  getUserByEmail: (email, callback) => {
    db.get('SELECT id, role, email, cpf, telefone, estado, cidade FROM users WHERE email = ?', [email], callback);
  },

  getUserByCpf: (cpf, callback) => {
    db.get('SELECT id, role, email, cpf, telefone, estado, cidade FROM users WHERE cpf = ?', [cpf], callback);
  },

  createUser: (userData, callback) => {
    const { role, email, password, cpf, telefone, estado, cidade } = userData;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return callback(err);
      db.run(
        'INSERT INTO users (role, email, password, cpf, telefone, estado, cidade) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [role, email, hashedPassword, cpf, telefone, estado, cidade],
        function (err) {
          if (err) return callback(err);
          callback(null, { id: this.lastID, ...userData, password: undefined });
        }
      );
    });
  },

  updateUser: (id, userData, callback) => {
    const fields = [];
    const values = [];
    let passwordUpdate = false;

    for (const key in userData) {
      if (userData[key] !== undefined && key !== 'id') {
        if (key === 'password') {
          passwordUpdate = true;
          continue; // Handle password separately
        }
        fields.push(`${key} = ?`);
        values.push(userData[key]);
      }
    }

    if (passwordUpdate) {
      bcrypt.hash(userData.password, 10, (err, hashedPassword) => {
        if (err) return callback(err);
        fields.push('password = ?');
        values.push(hashedPassword);
        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);
        db.run(query, values, function (err) {
          if (err) return callback(err);
          callback(null, { id, ...userData, password: undefined });
        });
      });
    } else {
      const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
      values.push(id);
      db.run(query, values, function (err) {
        if (err) return callback(err);
        callback(null, { id, ...userData, password: undefined });
      });
    }
  },

  deleteUser: (id, callback) => {
    db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
      if (err) return callback(err);
      callback(null, { message: 'Usuário deletado com sucesso', changes: this.changes });
    });
  },
};

module.exports = userModel;


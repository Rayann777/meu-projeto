const express = require("express");
const cors = require("cors");
const userModel = require("./userModel");
const { validateEmail, validateCpf } = require("./validators");

const app = express();
const PORT = 5000;

// Middlewares
app.use(express.json()); // Para parsear JSON no corpo das requisições
app.use(cors()); // Habilita CORS para todas as origens

// Rotas da API

// GET todos os usuários
app.get("/api/users", (req, res) => {
  userModel.getAllUsers((err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET usuário por ID
app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  userModel.getUserById(id, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.json(row);
  });
});

// POST criar novo usuário
app.post("/api/users", async (req, res) => {
  const { role, email, password, cpf, telefone, estado, cidade } = req.body;

  // Validações
  if (!email || !validateEmail(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Senha deve ter pelo menos 6 caracteres" });
  }
  if (!role || !["cuidador", "paciente"].includes(role)) {
    return res.status(400).json({ error: "Role deve ser \"cuidador\" ou \"paciente\"" });
  }
  if (cpf && !validateCpf(cpf)) {
    return res.status(400).json({ error: "CPF inválido" });
  }

  // Verificar unicidade de email
  userModel.getUserByEmail(email, (err, existingUser) => {
    if (err) return res.status(500).json({ error: err.message });
    if (existingUser) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    // Verificar unicidade de CPF (se fornecido)
    if (cpf) {
      userModel.getUserByCpf(cpf, (err, existingCpfUser) => {
        if (err) return res.status(500).json({ error: err.message });
        if (existingCpfUser) {
          return res.status(400).json({ error: "CPF já cadastrado" });
        }

        // Criar usuário
        userModel.createUser({ role, email, password, cpf, telefone, estado, cidade }, (err, newUser) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json(newUser);
        });
      });
    } else {
      // Criar usuário sem CPF
      userModel.createUser({ role, email, password, cpf: null, telefone, estado, cidade }, (err, newUser) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(newUser);
      });
    }
  });
});

// PUT atualizar usuário
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const userData = req.body;

  // Validações para campos que podem ser atualizados
  if (userData.email && !validateEmail(userData.email)) {
    return res.status(400).json({ error: "Email inválido" });
  }
  if (userData.password && userData.password.length < 6) {
    return res.status(400).json({ error: "Senha deve ter pelo menos 6 caracteres" });
  }
  if (userData.role && !["cuidador", "paciente"].includes(userData.role)) {
    return res.status(400).json({ error: "Role deve ser \"cuidador\" ou \"paciente\"" });
  }
  if (userData.cpf && !validateCpf(userData.cpf)) {
    return res.status(400).json({ error: "CPF inválido" });
  }

  userModel.getUserById(id, (err, existingUser) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!existingUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Verificar unicidade de email (se alterado)
    if (userData.email && userData.email !== existingUser.email) {
      userModel.getUserByEmail(userData.email, (err, userWithSameEmail) => {
        if (err) return res.status(500).json({ error: err.message });
        if (userWithSameEmail) {
          return res.status(400).json({ error: "Email já cadastrado por outro usuário" });
        }
        proceedUpdate();
      });
    } else if (userData.cpf && userData.cpf !== existingUser.cpf) {
      // Verificar unicidade de CPF (se alterado)
      userModel.getUserByCpf(userData.cpf, (err, userWithSameCpf) => {
        if (err) return res.status(500).json({ error: err.message });
        if (userWithSameCpf) {
          return res.status(400).json({ error: "CPF já cadastrado por outro usuário" });
        }
        proceedUpdate();
      });
    } else {
      proceedUpdate();
    }

    function proceedUpdate() {
      userModel.updateUser(id, userData, (err, updatedUser) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json(updatedUser);
      });
    }
  });
});

// DELETE usuário
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  userModel.deleteUser(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.json({ message: "Usuário deletado com sucesso" });
  });
});

// Rota inicial
app.get("/", (req, res) => {
  res.json({
    message: "API Cuidar+ funcionando!",
    endpoints: {
      "GET /api/users": "Listar todos os usuários",
      "POST /api/users": "Criar novo usuário",
      "GET /api/users/:id": "Obter usuário específico",
      "PUT /api/users/:id": "Atualizar usuário",
      "DELETE /api/users/:id": "Deletar usuário",
    },
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});




// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo deu errado!");
});



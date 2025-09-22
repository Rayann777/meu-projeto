const axios = require("axios");

const API_URL = "http://localhost:5000/api/users";
const HOME_URL = "http://localhost:5000/";

async function runTests() {
  console.log("=== Testando API Cuidar+ (Node.js) ===\n");

  // Teste da rota inicial
  console.log("=== Testando GET / ===");
  try {
    const response = await axios.get(HOME_URL);
    console.log(`Status: ${response.status}`);
    console.log("Response:", response.data);
    console.log("\n");
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    console.log("\n");
  }

  let userId = null;

  // Teste POST - Criar usuário
  console.log("=== Testando POST /api/users ===");
  const userData = {
    role: "cuidador",
    email: "joao@email.com",
    password: "123456",
    cpf: "12345678901",
    telefone: "(11) 99999-9999",
    estado: "SP",
    cidade: "São Paulo",
  };

  try {
    const response = await axios.post(API_URL, userData);
    console.log(`Status: ${response.status}`);
    console.log("Response:", response.data);
    if (response.status === 201) {
      userId = response.data.id;
      console.log(`✅ Usuário criado com ID: ${userId}\n`);
    } else {
      console.log("❌ Falha ao criar usuário\n");
    }
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    console.log("❌ Falha ao criar usuário\n");
  }

  if (userId) {
    // Teste GET - Listar todos os usuários
    console.log("=== Testando GET /api/users ===");
    try {
      const response = await axios.get(API_URL);
      console.log(`Status: ${response.status}`);
      console.log("Response:", response.data);
      console.log(`Total de usuários: ${response.data.length}\n`);
    } catch (error) {
      console.error(`Erro: ${error.message}`);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      console.log("\n");
    }

    // Teste GET - Obter usuário específico
    console.log(`=== Testando GET /api/users/${userId} ===`);
    try {
      const response = await axios.get(`${API_URL}/${userId}`);
      console.log(`Status: ${response.status}`);
      console.log("Response:", response.data);
      console.log("\n");
    } catch (error) {
      console.error(`Erro: ${error.message}`);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      console.log("\n");
    }

    // Teste PUT - Atualizar usuário
    console.log(`=== Testando PUT /api/users/${userId} ===`);
    const updateData = { telefone: "(11) 88888-8888", cidade: "Campinas" };
    try {
      const response = await axios.put(`${API_URL}/${userId}`, updateData);
      console.log(`Status: ${response.status}`);
      console.log("Response:", response.data);
      console.log("\n");
    } catch (error) {
      console.error(`Erro: ${error.message}`);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      console.log("\n");
    }

    // Criar segundo usuário para testar lista
    console.log("=== Criando segundo usuário ===");
    const userData2 = {
      role: "paciente",
      email: "maria@email.com",
      password: "654321",
      telefone: "(11) 77777-7777",
      estado: "RJ",
      cidade: "Rio de Janeiro",
    };
    let userId2 = null;
    try {
      const response = await axios.post(API_URL, userData2);
      console.log(`Status: ${response.status}`);
      console.log("Response:", response.data);
      if (response.status === 201) {
        userId2 = response.data.id;
        console.log(`✅ Segundo usuário criado com ID: ${userId2}\n`);
      } else {
        console.log("❌ Falha ao criar segundo usuário\n");
      }
    } catch (error) {
      console.error(`Erro: ${error.message}`);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      console.log("❌ Falha ao criar segundo usuário\n");
    }

    // Listar todos novamente
    console.log("=== Listando todos os usuários ===");
    try {
      const response = await axios.get(API_URL);
      console.log(`Status: ${response.status}`);
      console.log("Response:", response.data);
      console.log(`Total de usuários: ${response.data.length}`);
      response.data.forEach((user) => {
        console.log(`- ID: ${user.id}, Email: ${user.email}, Role: ${user.role}`);
      });
      console.log("\n");
    } catch (error) {
      console.error(`Erro: ${error.message}`);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      console.log("\n");
    }

    // Teste DELETE - Deletar usuário
    console.log(`=== Testando DELETE /api/users/${userId} ===`);
    try {
      const response = await axios.delete(`${API_URL}/${userId}`);
      console.log(`Status: ${response.status}`);
      console.log("Response:", response.data);
      console.log("✅ Usuário deletado com sucesso\n");
    } catch (error) {
      console.error(`Erro: ${error.message}`);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      console.log("❌ Falha ao deletar usuário\n");
    }

    // Verificar se foi deletado
    console.log("=== Verificando lista após deleção ===");
    try {
      const response = await axios.get(API_URL);
      console.log(`Status: ${response.status}`);
      console.log(`Total de usuários restantes: ${response.data.length}\n`);
    } catch (error) {
      console.error(`Erro: ${error.message}`);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      console.log("\n");
    }
  } else {
    console.log("Não foi possível executar os testes de GET, PUT e DELETE porque a criação do usuário falhou.\n");
  }

  console.log("=== Teste de validações ===");

  // Teste com email inválido
  console.log("Testando email inválido...");
  const invalidEmailData = { role: "cuidador", email: "email-invalido", password: "123456" };
  try {
    const response = await axios.post(API_URL, invalidEmailData);
    console.log(`Status: ${response.status} - ${JSON.stringify(response.data)}\n`);
  } catch (error) {
    if (error.response) {
      console.log(`Status: ${error.response.status} - ${JSON.stringify(error.response.data)}\n`);
    } else {
      console.error(`Erro: ${error.message}\n`);
    }
  }

  // Teste com senha muito curta
  console.log("Testando senha muito curta...");
  const shortPasswordData = { role: "cuidador", email: "teste@email.com", password: "123" };
  try {
    const response = await axios.post(API_URL, shortPasswordData);
    console.log(`Status: ${response.status} - ${JSON.stringify(response.data)}\n`);
  } catch (error) {
    if (error.response) {
      console.log(`Status: ${error.response.status} - ${JSON.stringify(error.response.data)}\n`);
    } else {
      console.error(`Erro: ${error.message}\n`);
    }
  }

  console.log("✅ Todos os testes concluídos!");
}

runTests();


# API Cuidar+ (Node.js)

API REST completa para o sistema Cuidar+, desenvolvida com Node.js, Express.js e SQLite.

## Funcionalidades

A API oferece operações CRUD completas para gerenciamento de usuários:

- **GET** `/api/users` - Listar todos os usuários
- **POST** `/api/users` - Criar novo usuário
- **GET** `/api/users/<id>` - Obter usuário específico
- **PUT** `/api/users/<id>` - Atualizar usuário
- **DELETE** `/api/users/<id>` - Deletar usuário

## Modelo de Dados

### Usuário
```json
{
  "id": 1,
  "role": "cuidador",
  "email": "usuario@email.com",
  "cpf": "12345678901",
  "telefone": "(11) 99999-9999",
  "estado": "SP",
  "cidade": "São Paulo"
}
```

### Campos
- **id**: Identificador único (gerado automaticamente)
- **role**: Tipo de usuário ("cuidador" ou "paciente") - obrigatório
- **email**: Email do usuário - obrigatório e único
- **password**: Senha do usuário - obrigatório (mínimo 6 caracteres, armazenada como hash)
- **cpf**: CPF do usuário - opcional e único
- **telefone**: Telefone do usuário - opcional
- **estado**: Estado do usuário - opcional
- **cidade**: Cidade do usuário - opcional

## Instalação e Execução

### 1. Navegar até o diretório do projeto
```bash
cd cuidar-mais-api-nodejs
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Executar a API
```bash
npm start
# ou node server.js
```

A API estará disponível em `http://localhost:5000`

## Exemplos de Uso (com `curl`)

### Criar usuário (POST)
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d 
'{
    "role": "cuidador",
    "email": "joao@email.com",
    "password": "123456",
    "cpf": "12345678901",
    "telefone": "(11) 99999-9999",
    "estado": "SP",
    "cidade": "São Paulo"
  }
'
```

### Listar usuários (GET)
```bash
curl http://localhost:5000/api/users
```

### Obter usuário específico (GET)
```bash
curl http://localhost:5000/api/users/1
```

### Atualizar usuário (PUT)
```bash
curl -X PUT http://localhost:5000/api/users/1 \
  -H "Content-Type: application/json" \
  -d 
'{
    "telefone": "(11) 88888-8888",
    "cidade": "Campinas"
  }
'
```

### Deletar usuário (DELETE)
```bash
curl -X DELETE http://localhost:5000/api/users/1
```

## Validações

A API inclui validações para:

- **Email**: Formato válido de email
- **Senha**: Mínimo de 6 caracteres
- **Role**: Deve ser "cuidador" ou "paciente"
- **CPF**: Deve ter 11 dígitos (quando fornecido)
- **Unicidade**: Email e CPF devem ser únicos

## Tratamento de Erros

A API retorna códigos de status HTTP apropriados:

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Erro de validação
- **404**: Recurso não encontrado
- **500**: Erro interno do servidor

## Recursos Técnicos

- **Framework**: Express.js
- **Banco de dados**: SQLite com `sqlite3`
- **CORS**: Habilitado para todas as rotas (`cors`)
- **Segurança**: Senhas criptografadas com `bcryptjs`
- **Validações**: Validação de email, CPF e outros campos

## Estrutura do Projeto

```
cuidar-mais-api-nodejs/
├── server.js           # Aplicação principal e rotas
├── userModel.js        # Funções de interação com o banco de dados
├── database.js         # Configuração e inicialização do SQLite
├── validators.js       # Funções de validação
├── test_api.js         # Script de testes automatizados
├── package.json        # Metadados e dependências do projeto
├── package-lock.json   # Registro de dependências exatas
├── README.md           # Documentação
└── cuidar_mais.db      # Banco de dados SQLite (gerado na primeira execução)
```


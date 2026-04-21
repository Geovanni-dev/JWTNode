![Node.js](https://img.shields.io/badge/Node.js-22.x-green)
![Express](https://img.shields.io/badge/Express-5.x-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.x-purple)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![Nodemailer](https://img.shields.io/badge/Nodemailer-Email-yellow)
![Bcrypt](https://img.shields.io/badge/Bcrypt-Hash-red)
![Zod](https://img.shields.io/badge/Zod-Validation-purple)

# 🔐 JWTNode - Autenticação completa com Node.js

Uma API RESTful robusta com sistema completo de autenticação, incluindo registro com verificação de email, login com JWT, e rotas protegidas com diferentes níveis de permissão (ADMIN/CLIENT).

## 💻 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **SQLite** - Banco de dados (substituível)
- **JWT** - Autenticação por token
- **Bcrypt** - Hash de senhas
- **Zod** - Validação de dados
- **Nodemailer** - Envio de emails

## 🚀 Funcionalidades

- ✅ Registro de usuários
- ✅ Verificação de email com código de 6 dígitos
- ✅ Login com geração de JWT token
- ✅ Rotas protegidas por autenticação
- ✅ Níveis de acesso (ADMIN / CLIENT)
- ✅ CRUD completo de usuários (apenas ADMIN)
- ✅ Validação de dados com Zod
- ✅ Hash de senhas com Bcrypt
- ✅ Seed automático de usuário ADMIN

## 📋 Pré-requisitos

- Node.js (v22+)
- npm ou yarn
- Conta de email para envio (Gmail, Outlook, etc)

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/authapi.git
cdJWTNode

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute as migrações do Prisma
npx prisma migrate dev

# Execute o seed para criar o ADMIN
npx prisma db seed

# Inicie o servidor
npm run dev
```

## ⚙️ Configuração do .env

```env
# Servidor
PORT=3000

# JWT
JWT_SECRET=seu_secret_jwt_aqui

# Email (Nodemailer)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USER=seuemail@gmail.com
MAIL_PASS=suasenhaapp
```

## 📚 Rotas da API

### 🔓 Rotas Públicas

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/users/register` | Criar nova conta |
| POST | `/users/verify-code` | Verificar código de email |
| POST | `/users/login` | Fazer login |

### 🔒 Rotas Protegidas (ADMIN apenas)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/users` | Listar todos usuários |
| GET | `/users/:id` | Buscar usuário por ID |
| DELETE | `/users/:id` | Deletar usuário |

## 📝 Exemplos de Requisições

### Registrar usuário

```bash
POST /users/register
Content-Type: application/json
```

```json
{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456"
}
```

### Verificar código

```bash
POST /users/verify-code
Content-Type: application/json
```

```json
{
    "email": "joao@email.com",
    "code": "ABC123"
}
```

### Login

```bash
POST /users/login
Content-Type: application/json
```

```json
{
    "email": "joao@email.com",
    "password": "123456"
}
```

### Listar usuários (ADMIN)

```bash
GET /users
Authorization: Bearer SEU_TOKEN_AQUI
```

### Filtrar usuários

```bash
GET /users?role=ADMIN
GET /users?name=João
GET /users?email=joao@email.com
```

## 🗂️ Estrutura do Projeto

```
api-registro/
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── users/
│   │   ├── controller/
│   │   │   └── userController.js
│   │   └── routes/
│   │       └── userRoutes.js
│   ├── middlewares/
│   │   └── authController.js
│   ├── services/
│   │   └── emailService.js
│   └── lib/
│       └── prisma.js
├── .env
├── server.js
└── package.json
```

## 🔐 Segurança

- Senhas hasheadas com Bcrypt (salt 10)
- Tokens JWT com expiração (1 dia)
- Verificação obrigatória de email
- Validação de dados com Zod
- Proteção de rotas por middleware

## 📦 Dependências Principais

```json
{
    "@prisma/client": "^6.19.3",
    "bcrypt": "^6.0.0",
    "jsonwebtoken": "^9.0.3",
    "nodemailer": "^8.0.4",
    "zod": "^4.3.6",
    "express": "^5.2.1"
}
```

## 👨‍💻 Autor

**Geovani** - [GitHub.com/Geovanni-dev](https://github.com/Geovanni-dev)

## 📄 Licença

Este projeto está sob a licença MIT.

---

⭐ Desenvolvido para demonstrar domínio em JWT, Bcrypt e Nodemailer.
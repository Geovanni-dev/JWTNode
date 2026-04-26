<div align="center">

# 🔐 JWTNode

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white"/>
  <img src="https://img.shields.io/badge/Zod-3E6B9E?style=for-the-badge&logo=zod&logoColor=white"/>
  <img src="https://img.shields.io/badge/Nodemailer-22B573?style=for-the-badge&logo=gmail&logoColor=white"/>
</p>

API RESTful com sistema completo de autenticação, incluindo registro com verificação de e-mail, login com JWT e rotas protegidas com diferentes níveis de permissão (ADMIN/CLIENT). Desenvolvida para praticar e demonstrar conhecimento em JWT, Bcrypt e Nodemailer.

</div>

---

## ⚡ Funcionalidades

| Funcionalidade | Descrição |
|----------------|-----------|
| 📝 **Registro** | Criação de conta com validação de dados via Zod |
| 📧 **Verificação de E-mail** | Código de 6 dígitos enviado por Nodemailer |
| 🔐 **Login com JWT** | Token com expiração de 1 dia |
| 🛡️ **Rotas Protegidas** | Middleware de autenticação por token |
| 👑 **Níveis de Acesso** | Permissões separadas para ADMIN e CLIENT |
| 👥 **CRUD de Usuários** | Gerenciamento completo apenas para ADMIN |
| 🔑 **Hash de Senhas** | Bcrypt com salt 10 |
| 🌱 **Seed Automático** | Criação automática de usuário ADMIN |
| 🚦 **Rate Limit** | Proteção contra spam e força bruta nas rotas de autenticação |

---

## 🚀 Instalação e Execução

```bash
# Clone o repositório
git clone https://github.com/Geovanni-dev/JWTNode.git
cd JWTNode

# Instale as dependências
npm install

# Configure o arquivo .env
cp .env.example .env

# Execute as migrações do banco
npx prisma migrate dev

# Execute o seed para criar o ADMIN
npx prisma db seed

# Inicie o servidor
npm run dev
```

---

## ⚙️ Variáveis de Ambiente

```env
PORT=3000
JWT_SECRET=seu_secret_jwt_aqui
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USER=seuemail@gmail.com
MAIL_PASS=suasenhaapp
```

---

## 📡 Endpoints

### 🔓 Rotas Públicas (`/users`)

| Rota | Método | Payload (Body) | Descrição |
|------|--------|----------------|-----------|
| `/register` | POST | `{"name": "João", "email": "joao@email.com", "password": "123456"}` | Cria nova conta |
| `/verify-code` | POST | `{"email": "joao@email.com", "code": "ABC123"}` | Verifica código de e-mail |
| `/login` | POST | `{"email": "joao@email.com", "password": "123456"}` | Retorna token JWT |

### 👑 Rotas Protegidas — ADMIN (`/users`)

| Rota | Método | Auth | Descrição |
|------|--------|------|-----------|
| `/` | GET | 👑 | Lista todos os usuários |
| `/?role=ADMIN` | GET | 👑 | Filtra por role |
| `/?name=João` | GET | 👑 | Filtra por nome |
| `/?email=joao@email.com` | GET | 👑 | Filtra por e-mail |
| `/:id` | GET | 👑 | Busca usuário por ID |
| `/:id` | DELETE | 👑 | Deleta usuário |

> ⚠️ Rotas protegidas exigem o Header: `Authorization: Bearer <seu_token_jwt>`

---

## 🗂️ Arquitetura do Projeto

```
api-registro/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── lib/
│   │   └── prisma.js
│   ├── middlewares/
│   │   ├── authController.js
│   │   └── rateLimit.js
│   ├── services/
│   │   └── emailService.js
│   └── users/
│       ├── controller/
│       │   └── userController.js
│       └── routes/
│           └── userRoutes.js
├── .env
├── server.js
└── package.json
```

---

## 🛠️ Tecnologias

- **Node.js & Express** — Ambiente de execução e framework web
- **Prisma & SQLite** — ORM e banco de dados (substituível por PostgreSQL)
- **JSON Web Token (JWT)** — Autenticação baseada em tokens
- **Bcrypt** — Hash de senhas com salt 10
- **Nodemailer** — Envio de e-mails para verificação de conta
- **Zod** — Validação de schemas e integridade dos dados
- **Express Rate Limit** — Proteção contra spam e ataques de força bruta

---

## 📄 Licença

**MIT © [Geovani Rodrigues](https://github.com/Geovanni-dev)**

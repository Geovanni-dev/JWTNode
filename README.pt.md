<div align="right">
  <a href="./README.md">🇺🇸 English</a>
</div>

<div align="center">

# 🔐 JWTNode

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white"/>
  <img src="https://img.shields.io/badge/Zod-3E6B9E?style=for-the-badge&logo=zod&logoColor=white"/>
  <img src="https://img.shields.io/badge/Nodemailer-22B573?style=for-the-badge&logo=gmail&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white"/>
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black"/>
</p>

API RESTful com sistema completo de autenticação, incluindo registro com verificação de e-mail, login com JWT e rotas protegidas com diferentes níveis de permissão (ADMIN/CLIENT). Desenvolvida para praticar e demonstrar conhecimento em JWT, Bcrypt e Nodemailer. A qualidade do código é garantida por **ESLint**, **Prettier** e **EditorConfig**.

</div>

---

## ⚡ Funcionalidades

| Funcionalidade | Descrição |
|---|---|
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

### Opção 1 — Docker

```bash
# Configure o arquivo .env
cp .env.example .env

# Inicie os containers em segundo plano
docker compose up -d

# Execute o seed para criar o ADMIN dentro do container
docker exec -it JWTNode npx prisma db seed
```

### Opção 2 — Local

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

### 🔓 Rotas Públicas — `/users`

| Rota | Método | Payload | Descrição |
|---|---|---|---|
| `/register` | POST | `{"name","email","password"}` | Cria nova conta |
| `/verify-code` | POST | `{"email","code"}` | Verifica código de e-mail |
| `/login` | POST | `{"email","password"}` | Retorna token JWT |

### 👑 Rotas Protegidas — ADMIN `/users`

| Rota | Método | Auth | Descrição |
|---|---|---|---|
| `/` | GET | 👑 | Lista todos os usuários |
| `/?role=ADMIN` | GET | 👑 | Filtra por role |
| `/?name=João` | GET | 👑 | Filtra por nome |
| `/?email=joao@email.com` | GET | 👑 | Filtra por e-mail |
| `/:id` | GET | 👑 | Busca usuário por ID |
| `/:id` | DELETE | 👑 | Deleta usuário |

> ⚠️ Rotas protegidas exigem o header: `Authorization: Bearer <token_jwt>`

---

## 🗂️ Arquitetura do Projeto

```text
JWTNode/
├── prisma/
│   ├── migrations/               # Histórico de migrations do Prisma
│   ├── dev.db                    # Arquivo do banco de dados SQLite
│   ├── schema.prisma             # Definição do schema do banco de dados
│   └── seed.js                   # Script de criação do usuário ADMIN
├── src/
│   ├── lib/
│   │   └── prisma.js             # Singleton do cliente Prisma
│   ├── middlewares/
│   │   ├── authController.js     # Middleware de verificação JWT
│   │   └── rateLimit.js          # Regras de rate limiting
│   ├── services/
│   │   └── emailService.js       # Lógica de envio de e-mails via Nodemailer
│   └── users/
│       ├── controller/
│       │   └── userController.js # Lógica de auth e gestão de usuários
│       └── routes/
│           └── userRoutes.js     # Definição das rotas de usuários
├── .dockerignore
├── .editorconfig                 # Regras de formatação para editores (indent, charset, EOL)
├── .env.example                  # Template de referência das variáveis de ambiente
├── .eslintrc.json                # Regras e configuração do parser ESLint
├── .gitignore
├── .prettierrc                   # Preferências de formatação do Prettier
├── docker-compose.yml            # Orquestração de múltiplos containers
├── Dockerfile                    # Instruções de build da imagem de produção
├── package.json
└── server.js                     # Ponto de entrada da aplicação
```

---

## 🛠 Tecnologias

- **Node.js & Express** — Ambiente de execução e framework web
- **Prisma & SQLite** — ORM e banco de dados (substituível por PostgreSQL)
- **JSON Web Token (JWT)** — Autenticação baseada em tokens
- **Bcrypt** — Hash de senhas com salt 10
- **Nodemailer** — Envio de e-mails para verificação de conta
- **Zod** — Validação de schemas e integridade dos dados
- **Express Rate Limit** — Proteção contra spam e ataques de força bruta
- **Docker** — Containerização e orquestração de ambiente
- **ESLint + Prettier + EditorConfig** — Formatação consistente em toda a base de código

---

## 📄 Licença

**MIT © Geovani Rodrigues**

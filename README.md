<div align="right">
  <a href="./README.pt.md">🇧🇷 Português</a>
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

A RESTful API with a complete authentication system, including registration with email verification, JWT login, and protected routes with different permission levels (ADMIN/CLIENT). Built to practice and demonstrate knowledge of JWT, Bcrypt, and Nodemailer. Code quality is enforced with **ESLint**, **Prettier**, and **EditorConfig**.

</div>

---

## ⚡ Features

| Feature | Description |
|---|---|
| 📝 **Registration** | Account creation with data validation via Zod |
| 📧 **Email Verification** | 6-digit code sent via Nodemailer |
| 🔐 **JWT Login** | Token with 1-day expiration |
| 🛡️ **Protected Routes** | Token-based authentication middleware |
| 👑 **Access Levels** | Separate permissions for ADMIN and CLIENT |
| 👥 **User CRUD** | Full user management for ADMIN only |
| 🔑 **Password Hashing** | Bcrypt with salt 10 |
| 🌱 **Auto Seed** | Automatic ADMIN user creation |
| 🚦 **Rate Limiting** | Spam and brute-force protection on auth routes |

---

## 🚀 Installation & Setup

### Option 1 — Docker

```bash
# Configure environment variables
cp .env.example .env

# Start containers in the background
docker compose up -d

# Run the seed to create the ADMIN user inside the container
docker exec -it JWTNode npx prisma db seed
```

### Option 2 — Local

```bash
# Clone the repository
git clone https://github.com/Geovanni-dev/JWTNode.git
cd JWTNode

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Run the seed to create the ADMIN user
npx prisma db seed

# Start the server
npm run dev
```

---

## ⚙️ Environment Variables

```env
PORT=3000
JWT_SECRET=your_jwt_secret_here
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USER=youremail@gmail.com
MAIL_PASS=yourapppassword
```

---

## 📡 Endpoints

### 🔓 Public Routes — `/users`

| Route | Method | Payload | Description |
|---|---|---|---|
| `/register` | POST | `{"name","email","password"}` | Create a new account |
| `/verify-code` | POST | `{"email","code"}` | Verify email code |
| `/login` | POST | `{"email","password"}` | Returns a JWT token |

### 👑 Protected Routes — ADMIN `/users`

| Route | Method | Auth | Description |
|---|---|---|---|
| `/` | GET | 👑 | List all users |
| `/?role=ADMIN` | GET | 👑 | Filter by role |
| `/?name=John` | GET | 👑 | Filter by name |
| `/?email=john@email.com` | GET | 👑 | Filter by email |
| `/:id` | GET | 👑 | Get user by ID |
| `/:id` | DELETE | 👑 | Delete user |

> ⚠️ Protected routes require the header: `Authorization: Bearer <jwt_token>`

---

## 🗂️ Project Structure

```text
JWTNode/
├── prisma/
│   ├── migrations/               # Prisma migration history
│   ├── dev.db                    # SQLite database file
│   ├── schema.prisma             # Database schema definition
│   └── seed.js                   # ADMIN user seeding script
├── src/
│   ├── lib/
│   │   └── prisma.js             # Prisma client singleton
│   ├── middlewares/
│   │   ├── authController.js     # JWT verification middleware
│   │   └── rateLimit.js          # Rate limiting rules
│   ├── services/
│   │   └── emailService.js       # Nodemailer email dispatch logic
│   └── users/
│       ├── controller/
│       │   └── userController.js # Auth and user management logic
│       └── routes/
│           └── userRoutes.js     # User route definitions
├── .dockerignore
├── .editorconfig                 # Editor formatting rules (indent, charset, EOL)
├── .env.example                  # Environment variable reference template
├── .eslintrc.json                # ESLint rules and parser config
├── .gitignore
├── .prettierrc                   # Prettier formatting preferences
├── docker-compose.yml            # Multi-container orchestration config
├── Dockerfile                    # Production image build instructions
├── package.json
└── server.js                     # Application entry point
```

---

## 🛠 Tech Stack

- **Node.js & Express** — Runtime and web framework
- **Prisma & SQLite** — ORM and database (replaceable with PostgreSQL)
- **JSON Web Token (JWT)** — Token-based authentication
- **Bcrypt** — Password hashing with salt 10
- **Nodemailer** — Email sending for account verification
- **Zod** — Schema validation and data integrity
- **Express Rate Limit** — Spam and brute-force protection
- **Docker** — Containerization and environment orchestration
- **ESLint + Prettier + EditorConfig** — Consistent code formatting across the codebase

---

## 📄 License

**MIT © Geovani Rodrigues**

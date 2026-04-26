require("dotenv").config(); // importa o módulo dotenv e carrega as variáveis de ambiente do arquivo .env

const express = require("express"); /// importa o módulo express

const app = express();// cria a aplicação express
app.use(express.json()); //middleware que permite o express entender requisições com corpo em formato JSON

const { limiter } = require("./src/middlewares/rateLimit"); // importando o middleware de rate limit
app.use(limiter); // usando o middleware de rate limit na aplicação express

// importando as rotas de usuario
const userRoutes = require("./src/users/routes/userRoutes");
app.use("/users", userRoutes); // usando as rotas de usuario, todas as rotas de usuario vão começar com /users

// trata o erro de rota nao encontrada
app.use((req, res) => {
res.status(404).json({ error: "Rota n encontrada" });
});

// INICIALIZAÇÃO DO SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Servidor rodando na porta ${PORT}`);
});
const prisma = require("../lib/prisma");// importando o prisma para acessar o banco de dados
const jwt = require("jsonwebtoken"); // importando o jsonwebtoken para criar e verificar os tokens


// funcao para verificar o token de autenticaçao
const verifyToken = async(req, res, next) => {
    const authHeader = req.headers.authorization // pegando o token do header da requisiçao 
    if (!authHeader) {
        return res.status(401).json({ error: 'Sem autorização' }); // retorna uma resposta de erro indicando que o token esta ausente
    }
    const token = authHeader.split(' ')[1]; // pegando o token do header da requisiçao, o split serve para separar o tipo do token ex:Bearer, do token em si
    try {
        const  payload  = jwt.verify(token, process.env.JWT_SECRET); // verificando o token usando o secret
        const user = await prisma.user.findUnique({ where: { id: payload.id } }); // buscando o usuario no banco de dados usando o id do token
        if (!user) {
            return res.status(401).json({ error: 'Usuario não encontrado' }); // retorna uma resposta de erro indicando que o usuario n foi encontrado
        }
        if (user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Acesso negado' }); // retorna uma resposta de erro indicando que o usuario n tem permissão para acessar a rota
        }
        req.user = user; // armazenando o usuario na requisiçao
        next(); // passando para o proximo middleware
    } catch (error) {
        console.log(error); // se n for do jsonwebtoken
        return res.status(401).json({ error: 'Token de autenticação inválido' }); // retorna uma resposta de erro indicando que o token esta invalido    
    }};
    
module.exports = { verifyToken }; // exportando a funçao de verificar o token
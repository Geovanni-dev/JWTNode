const express = require('express'); // importando o express
const router = express.Router(); // criando uma rota com o express
const userController = require('../controller/userController'); // importando as funcoes do controller de usuario
const { verifyToken } = require('../../middlewares/authController'); // importando a funçao de verificar o token



//===============================rotas de usuario/admin


// rota para criar um usuario
router.post('/register', userController.createUser); // rota para criar um usuario, chama a funçao createUser do controller de usuario

// rota para verificar o codigo de verificacao do usuario
router.post('/verify-code', userController.verifyCode); // rota para verificar o codigo de verificacao do usuario, chama a funçao verifyCode do controller de usuario

// rota para logar o admim/usuario
router.post('/login', userController.login); // rota para logar o admim/usuario, chama a funçao loginUser do controller de usuario

// rota para listar todos os usuarios
router.get('/', verifyToken, userController.listAllUsers); // rota para listar todos os usuarios, chama a funçao listAllUsers do controller de usuario, a rota é protegida pela funçao de verificar o token

// rota para listar um usuario por id
router.get('/:id', verifyToken, userController.listUserById); // rota para listar um usuario por id, chama a funçao listUserById do controller de usuario, a rota é protegida pela funçao de verificar o token

// rota para deletar um usuario
router.delete('/:id', verifyToken, userController.deleteUser); // rota para deletar um usuario, chama a funçao deleteUser do controller de usuario, a rota é protegida pela funçao de verificar o token   

module.exports = router; // exportando o router
const prisma = require("../../lib/prisma");
const { z, email } = require("zod");
const bcrypt = require("bcrypt");
const jtw = require("jsonwebtoken");
const { emailCode, generateVerificationCode } = require("../../services/emailService");

//=================================schema de validacao de dados de usuario usando zod

// valida o nome, email e senha do usuario
const createUserSchema = z.object({
    name: z.string().min(3, "o nome precisa conter no minimo 3 caracteres"), // valida o nome do usuario, que deve conter no minimo 3 caracteres
    email: z.string().email("o email precisa ser valido"), // valida o email do usuario, que deve ser um email valido
    password: z.string().min(6, "a senha precisa conter no minimo 6 caracteres") // valida a senha do usuario, que deve conter no minimo 6 caracteres
});

// valida o codigo de verificacao do usuario
const verifyCodeSchema = z.object({
    code: z.string().length(6, "o codigo de verificacao precisa conter exatamente 6 caracteres"), // valida o codigo de verificacao do usuario, que deve conter exatamente 6 caracteres
    email: z.string().email("o email precisa ser valido") // valida o email do usuario, que deve ser um email valido
});

const loginSchima = z.object({
    email: z.string().email("o email precisa ser valido"), // valida o email do admin, que deve ser um email valido
    password: z.string().min(6, "a senha precisa conter no minimo 6 caracteres") // valida a senha do admin, que deve conter no minimo 6 caracteres
});

// valida os dados para listar os usuarios, que podem ser o email, nome ou role do usuario, e torna todos os campos opcionais
const listUsersSchema = z.object({
    email: z.string().email("o email precisa ser valido").optional(), // valida o email do usuario, que deve ser um email valido, e torna o campo opcional
    name: z.string().min(3, "o nome precisa conter no minimo 3 caracteres").optional(), // valida o nome do usuario, que deve conter no minimo 3 caracteres, e torna o campo opcional
    role: z.enum(["ADMIN", "CLIENT"]).optional() // valida o role do usuario, que deve ser USER ou ADMIN, e torna o campo opcional
});

// valida o id do usuario, que deve ser um numero inteiro positivo, e transforma o valor para numero usando preprocess do zod
const idSchema = z.object({
    id : z.preprocess((val) => Number(val), z.number().int().positive("ID inválido"))
}); 





//================================= funcoes de controller de usuario



// funcao assincrona para criar um novo usuario, validando os dados pelo esquema zod e enviando um email de verificacao  

const createUser = async (req, res) => {
    try {
        const { name, email, password} = createUserSchema.parse(req.body); // valida os dados do usuario pelo esquema zod
        const code = generateVerificationCode(); // gera um codigo de verificacao aleatorio de 6 caracteres
        const passwordHash = await bcrypt.hash(password, 10); // gera um hash da senha do usuario usando bcrypt
        const user = await prisma.user.create({ // cria um novo usuario no banco de dados usando prisma
            data: {
                name, // nome do usuario, definido pelo parametro name
                email, // email do usuario, definido pelo parametro email
                password: passwordHash, // hash da senha do usuario, definido pelo parametro passwordHash
                verificationCode: code // codigo de verificacao do usuario, definido pelo parametro code
            }
        });
        await emailCode(user.email, "Código de Verificação", `Seu código de verificação é: ${code}`);
        res.status(201).json({ message: "Usuário criado com sucesso, verifique seu email para obter o código de verificação" }); // retorna uma resposta de sucesso caso o usuario seja criado com sucesso
    }catch (error) {
       if (error instanceof z.ZodError) { // se o erro for do zod
            return res.status(400).json({ error: "Erro de validação", 
                detalhes: error.flatten().fieldErrors // funçao para imprimir os erros
        });
    }
        if (error.code === 'P2002') { // se o erro for do prisma, indicando que o email ja existe no banco de dados
            return res.status(409).json({ error: 'Email já existe' }); // retorna uma resposta de erro indicando que o email ja existe
    }
        console.log(error); // se n for do zod nem do prisma
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
};

//funçao assincrona para verificar o codigo de verificacao do usuario

const verifyCode = async (req, res) => {
    try {
        const { code, email } = verifyCodeSchema.parse(req.body); // valida os dados do usuario pelo esquema zod
        const user = await prisma.user.findFirst({ // busca o usuario no banco de dados usando prisma
            where: {
                email,
                verificationCode: code // codigo de verificacao do usuario, definido pelo parametro code
            }
        });
        if (!user) { // se o usuario nao for encontrado
            return res.status(404).json({ error: 'Codigo n encontrado' }); // retorna uma resposta de erro
        }
        await prisma.user.update({ // atualiza o usuario no banco de dados usando prisma
            where: {
                id: user.id // id do usuario, definido pelo parametro id
            },
            data: {
                verificationCode: null, verified: true // atualiza o codigo de verificacao do usuario para null e o campo verified para true, indicando que o usuario foi verificado com sucesso
            }
        });
        return res.status(200).json({ message: 'Código verificado com sucesso' }); // retorna uma resposta de sucesso caso o codigo seja verificado com sucesso
    } catch (error) {
        if (error instanceof z.ZodError) { // se o erro for do zod
            return res.status(400).json({ error: "Erro de validação", 
                detalhes: error.flatten().fieldErrors // funçao para imprimir os erros
        });
    }
        console.log(error); // se n for do zod nem do prisma
        res.status(500).json({ error: 'Erro ao verificar o codigo' });
    }       
        }


// funcao assincrona para logar o admim/usuario, validando os dados pelo esquema zod e gerando um token JWT
const login = async (req, res) => {
    try {
        const { email, password } = loginSchima.parse(req.body); // valida os dados do admin pelo esquema zod
        const user = await prisma.user.findUnique({ // busca o usuario no banco de dados usando prisma
            where: { email } // email do usuario, definido pelo parametro email
        });
        if (!user) { // se o usuario nao for encontrado
            return res.status(401).json({ error: 'Email ou senha incorretos' }); // retorna uma resposta de erro
        }
        const passwordMatch = await bcrypt.compare(password, user.password); // compara a senha do admin com a senha do usuario no banco de dados usando bcrypt
        if (!passwordMatch) { // se a senha nao for igual
            return res.status(401).json({ error: 'Email ou senha incorretas' }); // retorna uma resposta de erro
        } 
        if (!user.verified) { // se o usuario nao for verificado
            return res.status(401).json({ error: 'Verifique seu email antes de fazer loguin' }); // retorna uma resposta de erro 
        }
            delete user.password; // remove a senha do usuario para nao retornar a senha no token JWT
            const userWithoutPassword = user; // cria uma nova variavel userWithoutPassword para armazenar o usuario sem a senha
        const token = jtw.sign({ 
        id: user.id,
        role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '1d' }); 
        res.json({ userWithoutPassword, token }); // imprime o usuario sem a senha e o token JWT na resposta
    } catch (error) {
        if (error instanceof z.ZodError) { // se o erro for do zod
            return res.status(400).json({ error: "Erro de validação", 
                detalhes: error.flatten().fieldErrors // funçao para imprimir os erros
        });
    }
        if (error.code === 'P2002') { // se o erro for do prisma, indicando que o email ja existe no banco de dados
            return res.status(409).json({ error: 'Email ja cadastrado' }); // retorna uma resposta de erro indicando que o email ja existe
    }
        console.log(error); // se n for do zod nem do prisma
        res.status(500).json({ error: 'Erro ao logar' });   
    }
};


// funcao assincrona para listar os usuarios
const listAllUsers = async (req, res) => { 
    try {
    const { email, name, role } = listUsersSchema.parse(req.query); // variaveis que recebem os dados validados para listar os usuarios
    const users = await prisma.user.findMany({ // buscando os usuarios no banco de dados
        where: { // filtrando os usuarios
            name: name ? {
                contains: name } : undefined, // contains serve pra buscas parciais
               // mode: "insensitiveserve para n diferenciar maiusculas e minusculas, porém SQLite n suporta
            email, 
            role
        },
        select: { // selecionando os dados dos usuarios
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
    res.json(users); // imprimindo os usuarios
    }catch (error) {
        if (error instanceof z.ZodError) { // se o erro for do zod
            return res.status(400).json({ error: "Erro de validação", 
                detalhes: error.flatten().fieldErrors // funçao para imprimir os erros
        });
        }
        console.log(error); // se n for do zod
        res.status(500).json({ error: "Erro ao listar os usuarios" });
    }
};


// funcao assincrona para listar um usuario pelo id
const listUserById = async (req, res) => { 
    try {
        const { id } = idSchema.parse(req.params); // variavel que recebe o id validado
        const user = await prisma.user.findUnique({ // buscando o usuario no banco de dados
            where: { id }, // recebe o id validado
            select: { // selecionando os dados do usuario
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
        if (!user) { // se o usuario n for encontrado
            return res.status(404).json({ error: "Usuario n encontrado" });
        }
        res.json(user); // imprimindo o usuario
    } catch (error) {
       if (error instanceof z.ZodError) { // se o erro for do zod
            return res.status(400).json({ error: "Erro de validação", 
                detalhes: error.flatten().fieldErrors // funçao para imprimir os erros
        });
        }
        console.log(error); // se n for do zod
        return res.status(500).json({ error: "Erro ao listar o usuario" });
    }
};


// funcao assincrona para deletar um usuario
const deleteUser = async (req, res) => {
    try {
        const { id } = idSchema.parse(req.params); // variavel que recebe o id validado
        const user = await prisma.user.delete({ // deletando o usuario
            where: { id }
        });
        res.json(user);
    } catch (error) {
        if (error instanceof z.ZodError) { // se o erro for do zod
            return res.status(400).json({ error: "Erro de validação", 
                detalhes: error.flatten().fieldErrors // funçao para imprimir os erros
            });
        }
        if (error.code === 'P2025') { // se o erro for do prisma
            return res.status(404).json({ error: 'Usuario n encontrado' });
        }
        console.log(error); // se n for do zod nem do prisma
        return res.status(500).json({ error: 'Erro ao deletar o usuario' });
    }
};


module.exports = { // exportando as funcoes do controller de usuario
    createUser,
    verifyCode, 
    login, 
    listAllUsers, 
    listUserById, 
    deleteUser
}; 
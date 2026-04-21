const { PrismaClient } = require('@prisma/client'); // importando o prisma
const bcrypt = require('bcrypt'); // importando o bcrypt
const { z } = require('zod'); // importando o zod

const prisma = new PrismaClient(); // criando a instancia do prisma

//=================================schema de validação de dados do ADM usando zod

// schema de validacao de dados do ADM
const AdminSchema = z.object({
    name: z.string().min(3, "o nome precisa conter no minimo 3 caracteres"), // valida o nome do ADM, que deve conter no minimo 3 caracteres
    email: z.string().email("o email precisa ser valido"), // valida o email do ADM, que deve ser um email valido
    password: z.string().min(6, "a senha precisa conter no minimo 6 caracteres"), // valida a senha do ADM, que deve conter no minimo 6 caracteres
    role: z.enum(['ADMIN', 'CLIENT']). default('ADMIN'), // valida o role, caso seja null cria adm padrao
})

const createAdmin = async () => { // funcao assincrona para criar o ADM padrao, nao recebe requisicao
    try {
        const { name, email, password, role } = AdminSchema.parse({
                
                name: 'GeovaniAdmin',
                email: 'geovannitest@gmail.com',
                password: 'Admin123',
                role: 'ADMIN',
            });
            console.log("Dados validados pelo zod: ");
            const passwordHash = await bcrypt.hash(password, 10); // gera um hash da senha do ADM usando bcrypt
            const admin = await prisma.user.upsert({ // cria o ADM padrao no banco de dados usando prisma
                where: { email },
                update: {},
                create: {
                    name, // nome do ADM, definido pelo parametro name
                    email, // email do ADM, definido pelo parametro email
                    password: passwordHash, // hash da senha do ADM, definido pelo parametro passwordHash
                    role // role do ADM, definido pelo parametro role
                },
            });
            console.log(`ADM criado/verificado com sucesso:${admin.email}`); // imprime o ADM criado com sucesso
            } catch (error) {
                if (error instanceof z.ZodError) { // se o erro for do zod
                      console.error("Erro de validação:", error.flatten().fieldErrors); // funçao para imprimir os erros
                } else {
                    console.error("Erro no prisma:", error); // imprime o erro no prisma
                }
            } finally {
                    await prisma.$disconnect(); // fecha a conexao com o banco de dados
                }
            };
            
            createAdmin(); // cria o ADM padrao

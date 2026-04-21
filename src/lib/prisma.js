const { PrismaClient } = require('@prisma/client');

// Tente instanciar passando um objeto vazio explicitamente
const prisma = new PrismaClient({}); 

module.exports = prisma;
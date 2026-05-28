# vou usar a mesma versao do Node que tenho instalada no meu Windows, rodando num Linux leve
FROM node:22.20.0-alpine

# crio a pasta onde meu codigo vai ficar guardado dentro do container
WORKDIR /app

# copio meus arquivos de configuração de pacotes antes do resto do codigo
COPY package*.json ./

# instalo as dependências do meu projeto direto no ambiente do container
RUN npm install

# copio minha pasta do Prisma separada para conseguir rodar o generate
COPY prisma ./prisma/

# gero o Prisma Client especifico para a arquitetura Linux do container
RUN npx prisma generate

# agora copio todo o resto dos arquivos do meu projeto
COPY . .

# informa que minha API vai escutar os acessos na porta 3000
EXPOSE 3000

# executa o comando oficial para ligar a minha API em produção
CMD ["node", "server.js"]
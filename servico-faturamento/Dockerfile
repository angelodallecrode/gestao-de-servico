FROM node:22-slim

WORKDIR /app

# Instala dependencias.
COPY package*.json ./
RUN npm install

# Copia o codigo-fonte.
COPY . .

# Gera o Prisma Client.
RUN npx prisma generate

EXPOSE 3001

# Aplica migracoes e inicia o servico.
CMD npx prisma migrate deploy && npm start

FROM node:22-slim

WORKDIR /app

# Instala dependencias.
COPY package*.json ./
RUN npm install

# Copia o codigo-fonte.
COPY . .

# Gera o Prisma Client.
RUN npx prisma generate

EXPOSE 3000

# Aplica migracoes, popula dados e inicia o servico.
CMD npx prisma migrate deploy && npx prisma db seed && npm start

FROM node:22-slim

WORKDIR /app

# Instala dependencias.
COPY package*.json ./
RUN npm install

# Copia o codigo-fonte.
COPY . .

EXPOSE 3002

# Inicia o servico.
CMD npm start

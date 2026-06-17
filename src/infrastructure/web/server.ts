import "dotenv/config";
import express from "express";
import { routes } from "./routes.js";

const app = express();

// Habilita JSON.
app.use(express.json());

// Rotas da aplicacao.
app.use(routes);

// Inicia servidor.
app.listen(3000, () => {
	// Log simples de inicializacao.
	console.log("Servidor rodando na porta 3000");
});

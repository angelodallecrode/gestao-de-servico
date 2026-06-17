import "dotenv/config";
import express from "express";
import { routes } from "./routes.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

// Habilita JSON.
app.use(express.json());

// Rotas da aplicacao.
app.use(routes);

// Inicia servidor.
app.listen(PORT, () => {
	console.log(`ServicoFaturamento rodando na porta ${PORT}`);
});

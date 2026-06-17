import "dotenv/config";
import express from "express";
import { iniciarInvalidacaoCacheConsumer } from "../messaging/InvalidacaoCacheConsumer.js";
import { cache, routes } from "./routes.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3002);

// Habilita JSON.
app.use(express.json());

// Rotas da aplicacao.
app.use(routes);

// Inicia servidor.
app.listen(PORT, () => {
	console.log(`ServicoPlanosAtivos rodando na porta ${PORT}`);
});

// Observa o evento de pagamento para invalidar a cache local.
iniciarInvalidacaoCacheConsumer(cache).catch((error) => {
	console.error("[planos-ativos] Nao foi possivel conectar ao broker:", error);
});

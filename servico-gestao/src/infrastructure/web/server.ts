import "dotenv/config";
import express from "express";
import { RegistrarPagamentoAssinatura } from "../../application/use-cases/RegistrarPagamentoAssinatura.js";
import { iniciarPagamentoConsumer } from "../messaging/PagamentoConsumer.js";
import { assinaturaRepository, routes } from "./routes.js";

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

// Observa o evento de pagamento para atualizar a validade das assinaturas.
const registrarPagamento = new RegistrarPagamentoAssinatura(assinaturaRepository);
iniciarPagamentoConsumer(registrarPagamento).catch((error) => {
	console.error("[gestao] Nao foi possivel conectar ao broker:", error);
});

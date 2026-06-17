import amqp from "amqplib";
import type { IAssinaturaCache } from "../../application/interfaces/IAssinaturaCache.js";
import { EXCHANGE_PAGAMENTO_PLANOS_ATIVOS, type PagamentoEvent } from "./eventos.js";

// URL do broker (RabbitMQ).
const BROKER_URL = process.env.BROKER_URL ?? "amqp://localhost:5672";

// Tenta conectar ao broker, com novas tentativas enquanto ele sobe.
async function conectarComRetry(
	tentativas = 10,
	intervaloMs = 3000
): Promise<Awaited<ReturnType<typeof amqp.connect>>> {
	for (let tentativa = 1; tentativa <= tentativas; tentativa++) {
		try {
			return await amqp.connect(BROKER_URL);
		} catch (error) {
			console.log(`[planos-ativos] Broker indisponivel (tentativa ${tentativa}/${tentativas}). Retentando...`);
			await new Promise((resolve) => setTimeout(resolve, intervaloMs));
		}
	}
	throw new Error("Nao foi possivel conectar ao broker apos varias tentativas.");
}

// Observa o evento de pagamento e invalida a entrada correspondente na cache.
// Cada instancia declara sua propria fila exclusiva, garantindo que TODAS
// as instancias (cada uma com sua cache) recebam a notificacao (fanout).
export async function iniciarInvalidacaoCacheConsumer(cache: IAssinaturaCache): Promise<void> {
	const connection = await conectarComRetry();
	const channel = await connection.createChannel();

	await channel.assertExchange(EXCHANGE_PAGAMENTO_PLANOS_ATIVOS, "fanout", { durable: true });
	// Fila exclusiva e efemera por instancia.
	const { queue } = await channel.assertQueue("", { exclusive: true });
	await channel.bindQueue(queue, EXCHANGE_PAGAMENTO_PLANOS_ATIVOS, "");

	console.log(`[planos-ativos] Observando evento ${EXCHANGE_PAGAMENTO_PLANOS_ATIVOS}.`);

	await channel.consume(queue, (msg) => {
		if (!msg) {
			return;
		}

		try {
			const evento = JSON.parse(msg.content.toString()) as PagamentoEvent;

			// Remove a entrada para forcar nova consulta ao ServicoGestao.
			cache.remover(evento.codigoAssinatura);
			console.log(`[planos-ativos] Cache invalidada para assinatura ${evento.codigoAssinatura}.`);

			channel.ack(msg);
		} catch (error) {
			console.error("[planos-ativos] Falha ao processar evento de pagamento:", error);
			channel.nack(msg, false, false);
		}
	});
}

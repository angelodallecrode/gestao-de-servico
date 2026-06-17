import amqp from "amqplib";
import { RegistrarPagamentoAssinatura } from "../../application/use-cases/RegistrarPagamentoAssinatura.js";
import { EXCHANGE_PAGAMENTO_GESTAO, dataDoEvento, type PagamentoEvent } from "./eventos.js";

// URL do broker (RabbitMQ).
const BROKER_URL = process.env.BROKER_URL ?? "amqp://localhost:5672";
// Fila duravel deste servico ligada ao exchange de pagamento.
const QUEUE = "gestao.pagamentos";

// Tenta conectar ao broker, com novas tentativas enquanto ele sobe.
async function conectarComRetry(
	tentativas = 10,
	intervaloMs = 3000
): Promise<Awaited<ReturnType<typeof amqp.connect>>> {
	for (let tentativa = 1; tentativa <= tentativas; tentativa++) {
		try {
			return await amqp.connect(BROKER_URL);
		} catch (error) {
			console.log(`[gestao] Broker indisponivel (tentativa ${tentativa}/${tentativas}). Retentando...`);
			await new Promise((resolve) => setTimeout(resolve, intervaloMs));
		}
	}
	throw new Error("Nao foi possivel conectar ao broker apos varias tentativas.");
}

// Inicia o observador do evento PagamentoPlanoServicoGestao.
export async function iniciarPagamentoConsumer(
	registrarPagamento: RegistrarPagamentoAssinatura
): Promise<void> {
	const connection = await conectarComRetry();
	const channel = await connection.createChannel();

	// Exchange fanout do evento; fila duravel com competicao de consumidores.
	await channel.assertExchange(EXCHANGE_PAGAMENTO_GESTAO, "fanout", { durable: true });
	await channel.assertQueue(QUEUE, { durable: true });
	await channel.bindQueue(QUEUE, EXCHANGE_PAGAMENTO_GESTAO, "");

	console.log(`[gestao] Observando evento ${EXCHANGE_PAGAMENTO_GESTAO}.`);

	await channel.consume(QUEUE, async (msg) => {
		if (!msg) {
			return;
		}

		try {
			const evento = JSON.parse(msg.content.toString()) as PagamentoEvent;

			// Atualiza a validade da assinatura com a data do pagamento.
			await registrarPagamento.executar({
				codigoAssinatura: evento.codigoAssinatura,
				dataPagamento: dataDoEvento(evento),
			});

			channel.ack(msg);
		} catch (error) {
			console.error("[gestao] Falha ao processar evento de pagamento:", error);
			// Descarta a mensagem para nao reentregar infinitamente.
			channel.nack(msg, false, false);
		}
	});
}

import amqp from "amqplib";
import type {
	IPagamentoEventPublisher,
	PagamentoEvent,
} from "../../application/interfaces/IPagamentoEventPublisher.js";
import { EXCHANGE_PAGAMENTO_GESTAO, EXCHANGE_PAGAMENTO_PLANOS_ATIVOS } from "./eventos.js";

// URL do broker (RabbitMQ).
const BROKER_URL = process.env.BROKER_URL ?? "amqp://localhost:5672";

export class RabbitMQPagamentoPublisher implements IPagamentoEventPublisher {
	private connection: Awaited<ReturnType<typeof amqp.connect>> | null = null;
	private channel: amqp.Channel | null = null;

	// Tenta conectar ao broker, com novas tentativas enquanto ele sobe.
	private async conectarComRetry(
		tentativas = 10,
		intervaloMs = 3000
	): Promise<Awaited<ReturnType<typeof amqp.connect>>> {
		for (let tentativa = 1; tentativa <= tentativas; tentativa++) {
			try {
				return await amqp.connect(BROKER_URL);
			} catch (error) {
				console.log(`[faturamento] Broker indisponivel (tentativa ${tentativa}/${tentativas}). Retentando...`);
				await new Promise((resolve) => setTimeout(resolve, intervaloMs));
			}
		}
		throw new Error("Nao foi possivel conectar ao broker apos varias tentativas.");
	}

	// Garante conexao e exchanges declarados.
	private async garantirCanal(): Promise<amqp.Channel> {
		if (this.channel) {
			return this.channel;
		}

		this.connection = await this.conectarComRetry();
		this.channel = await this.connection.createChannel();

		// Exchanges fanout: um para cada servico interessado.
		await this.channel.assertExchange(EXCHANGE_PAGAMENTO_GESTAO, "fanout", { durable: true });
		await this.channel.assertExchange(EXCHANGE_PAGAMENTO_PLANOS_ATIVOS, "fanout", { durable: true });

		console.log("[faturamento] Conectado ao broker.");
		return this.channel;
	}

	async publicarPagamentoEfetuado(evento: PagamentoEvent): Promise<void> {
		const channel = await this.garantirCanal();
		const payload = Buffer.from(JSON.stringify(evento));

		// Notifica os dois servicos interessados (ServicoGestao e ServicoPlanosAtivos).
		channel.publish(EXCHANGE_PAGAMENTO_GESTAO, "", payload, { persistent: true });
		channel.publish(EXCHANGE_PAGAMENTO_PLANOS_ATIVOS, "", payload, { persistent: true });
	}
}

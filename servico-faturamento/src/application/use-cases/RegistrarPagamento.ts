import type { IPagamentoRepository } from "../interfaces/IPagamentoRepository.js";
import type { IPagamentoEventPublisher } from "../interfaces/IPagamentoEventPublisher.js";

type RegistrarPagamentoInput = {
	// Dia da data do pagamento.
	dia: number;
	// Mes da data do pagamento.
	mes: number;
	// Ano da data do pagamento.
	ano: number;
	// Codigo da assinatura paga.
	codigoAssinatura: number;
	// Valor pago.
	valorPago: number;
};

export class RegistrarPagamento {
	// Acesso ao repositorio de pagamentos.
	private readonly pagamentoRepository: IPagamentoRepository;
	// Publicador de eventos.
	private readonly eventPublisher: IPagamentoEventPublisher;

	constructor(pagamentoRepository: IPagamentoRepository, eventPublisher: IPagamentoEventPublisher) {
		this.pagamentoRepository = pagamentoRepository;
		this.eventPublisher = eventPublisher;
	}

	async executar(input: RegistrarPagamentoInput): Promise<void> {
		const { dia, mes, ano, codigoAssinatura, valorPago } = input;

		// Monta a data do pagamento (mes - 1 pelo indice do construtor de Date).
		const dataPagamento = new Date(ano, mes - 1, dia);

		// Armazena na base propria do servico (codigo gerado pelo banco).
		await this.pagamentoRepository.salvar({
			codAss: codigoAssinatura,
			valorPago,
			dataPagamento,
		});

		// Gera o evento assincrono notificando os interessados.
		await this.eventPublisher.publicarPagamentoEfetuado({
			dia,
			mes,
			ano,
			codigoAssinatura,
			valorPago,
		});
	}
}

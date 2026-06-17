// Contrato dos eventos de pagamento trafegados pelo broker.

// Nomes dos exchanges (um por evento da especificacao).
export const EXCHANGE_PAGAMENTO_GESTAO = "PagamentoPlanoServicoGestao";
export const EXCHANGE_PAGAMENTO_PLANOS_ATIVOS = "PagamentoPlanoServicoPlanosAtivos";

// Corpo do evento de pagamento conforme a especificacao.
export type PagamentoEvent = {
	// Dia da data do pagamento.
	dia: number;
	// Mes da data do pagamento.
	mes: number;
	// Ano da data do pagamento.
	ano: number;
	// Identificador da assinatura paga.
	codigoAssinatura: number;
	// Valor pago na data indicada.
	valorPago: number;
};

// Converte o corpo do evento em uma data de pagamento.
export function dataDoEvento(evento: PagamentoEvent): Date {
	// mes - 1 porque o construtor de Date usa indice de mes (0-11).
	return new Date(evento.ano, evento.mes - 1, evento.dia);
}

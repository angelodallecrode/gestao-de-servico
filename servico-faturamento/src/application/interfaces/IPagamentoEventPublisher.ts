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

export interface IPagamentoEventPublisher {
	// Notifica os interessados de que um pagamento foi efetuado.
	publicarPagamentoEfetuado(evento: PagamentoEvent): Promise<void>;
}

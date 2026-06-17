// Nome do exchange observado por este servico.
export const EXCHANGE_PAGAMENTO_PLANOS_ATIVOS = "PagamentoPlanoServicoPlanosAtivos";

// Corpo do evento de pagamento conforme a especificacao.
export type PagamentoEvent = {
	dia: number;
	mes: number;
	ano: number;
	codigoAssinatura: number;
	valorPago: number;
};

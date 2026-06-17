export class Pagamento {
	// Identificador unico do pagamento.
	public readonly codigo: number;
	// Codigo da assinatura paga.
	public readonly codAss: number;
	// Valor pago.
	public readonly valorPago: number;
	// Data em que o pagamento foi efetivado.
	public readonly dataPagamento: Date;

	constructor(params: {
		codigo: number;
		codAss: number;
		valorPago: number;
		dataPagamento: Date;
	}) {
		// Validacoes basicas de preenchimento.
		this.codigo = Pagamento.requireId(params.codigo, "codigo");
		this.codAss = Pagamento.requireId(params.codAss, "codAss");
		this.valorPago = Pagamento.requirePositive(params.valorPago, "valorPago");
		this.dataPagamento = Pagamento.requireValidDate(params.dataPagamento, "dataPagamento");
	}

	private static requireId(value: number, field: string): number {
		if (!Number.isInteger(value) || value <= 0) {
			throw new Error(`${field} invalido.`);
		}

		return value;
	}

	private static requirePositive(value: number, field: string): number {
		if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
			throw new Error(`${field} invalido.`);
		}

		return value;
	}

	private static requireValidDate(value: Date, field: string): Date {
		if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
			throw new Error(`${field} invalido.`);
		}

		return value;
	}
}

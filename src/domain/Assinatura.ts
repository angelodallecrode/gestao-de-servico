export class Assinatura {
	// Identificador da assinatura.
	public readonly codigo: number;
	// Identificador do plano.
	public readonly codPlano: number;
	// Identificador do cliente.
	public readonly codCli: number;
	// Inicio do periodo de fidelidade.
	public readonly inicioFidelidade: Date;
	// Fim do periodo de fidelidade.
	public readonly fimFidelidade: Date;
	// Data do ultimo pagamento, se existir.
	public readonly dataUltimoPagamento: Date | null;
	// Custo final com o desconto de fidelidade aplicado.
	public readonly custoFinal: number;
	// Descricao dos criterios aplicados no custo final.
	public readonly descricao: string;

	constructor(params: {
		codigo: number;
		codPlano: number;
		codCli: number;
		inicioFidelidade: Date;
		fimFidelidade: Date;
		dataUltimoPagamento?: Date | null;
		custoFinal: number;
		descricao: string;
	}) {
		// Validacoes basicas de preenchimento e datas.
		this.codigo = Assinatura.requireId(params.codigo, "codigo");
		this.codPlano = Assinatura.requireId(params.codPlano, "codPlano");
		this.codCli = Assinatura.requireId(params.codCli, "codCli");
		this.inicioFidelidade = Assinatura.requireValidDate(params.inicioFidelidade, "inicioFidelidade");
		this.fimFidelidade = Assinatura.requireValidDate(params.fimFidelidade, "fimFidelidade");
		this.dataUltimoPagamento = params.dataUltimoPagamento ?? null;
		this.custoFinal = Assinatura.requirePositive(params.custoFinal, "custoFinal");
		this.descricao = Assinatura.requireNonEmpty(params.descricao, "descricao");

		// Garante ordem das datas de fidelidade.
		if (this.fimFidelidade.getTime() < this.inicioFidelidade.getTime()) {
			throw new Error("fimFidelidade deve ser maior ou igual ao inicioFidelidade.");
		}
	}

	// Numero de dias que o pagamento mantem a assinatura ativa.
	private static readonly DIAS_VALIDADE_PAGAMENTO = 30;
	private static readonly MS_POR_DIA = 24 * 60 * 60 * 1000;

	// Assinatura esta ativa se houve pagamento ha no maximo 30 dias.
	estaAtiva(referencia: Date = new Date()): boolean {
		if (!this.dataUltimoPagamento) {
			return false;
		}

		const validade =
			this.dataUltimoPagamento.getTime() +
			Assinatura.DIAS_VALIDADE_PAGAMENTO * Assinatura.MS_POR_DIA;

		return referencia.getTime() <= validade;
	}

	private static requireId(value: number, field: string): number {
		if (!Number.isInteger(value) || value <= 0) {
			throw new Error(`${field} invalido.`);
		}

		return value;
	}

	private static requireNonEmpty(value: string, field: string): string {
		if (!value || value.trim().length === 0) {
			throw new Error(`${field} obrigatorio.`);
		}

		return value.trim();
	}

	private static requirePositive(value: number, field: string): number {
		if (!Number.isFinite(value) || value <= 0) {
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

export class Assinatura {
	// Identificador da assinatura.
	public readonly codigo: string;
	// Identificador do plano.
	public readonly codPlano: string;
	// Identificador do cliente.
	public readonly codCli: string;
	// Inicio do periodo de fidelidade.
	public readonly inicioFidelidade: Date;
	// Fim do periodo de fidelidade.
	public readonly fimFidelidade: Date;
	// Data do ultimo pagamento, se existir.
	public readonly dataUltimoPagamento: Date | null;

	constructor(params: {
		codigo: string;
		codPlano: string;
		codCli: string;
		inicioFidelidade: Date;
		fimFidelidade: Date;
		dataUltimoPagamento?: Date | null;
	}) {
		// Validacoes basicas de preenchimento e datas.
		this.codigo = Assinatura.requireNonEmpty(params.codigo, "codigo");
		this.codPlano = Assinatura.requireNonEmpty(params.codPlano, "codPlano");
		this.codCli = Assinatura.requireNonEmpty(params.codCli, "codCli");
		this.inicioFidelidade = Assinatura.requireValidDate(params.inicioFidelidade, "inicioFidelidade");
		this.fimFidelidade = Assinatura.requireValidDate(params.fimFidelidade, "fimFidelidade");
		this.dataUltimoPagamento = params.dataUltimoPagamento ?? null;

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

	private static requireNonEmpty(value: string, field: string): string {
		if (!value || value.trim().length === 0) {
			throw new Error(`${field} obrigatorio.`);
		}

		return value.trim();
	}

	private static requireValidDate(value: Date, field: string): Date {
		if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
			throw new Error(`${field} invalido.`);
		}

		return value;
	}
}

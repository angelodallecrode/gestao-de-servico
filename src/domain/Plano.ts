export class Plano {
	// Identificador do plano.
	public readonly codigo: string;
	// Nome do plano.
	public readonly nome: string;
	// Valor mensal do plano.
	public readonly custoMensal: number;
	// Data de criacao ou vigencia.
	public readonly data: Date;
	// Descricao do plano.
	public readonly descricao: string;

	constructor(params: {
		codigo: string;
		nome: string;
		custoMensal: number;
		data: Date;
		descricao: string;
	}) {
		// Validacoes basicas de preenchimento e valores.
		this.codigo = Plano.requireNonEmpty(params.codigo, "codigo");
		this.nome = Plano.requireNonEmpty(params.nome, "nome");
		this.custoMensal = Plano.requirePositiveNumber(params.custoMensal, "custoMensal");
		this.data = Plano.requireValidDate(params.data, "data");
		this.descricao = Plano.requireNonEmpty(params.descricao, "descricao");
	}

	private static requireNonEmpty(value: string, field: string): string {
		if (!value || value.trim().length === 0) {
			throw new Error(`${field} obrigatorio.`);
		}

		return value.trim();
	}

	private static requirePositiveNumber(value: number, field: string): number {
		if (!Number.isFinite(value) || value <= 0) {
			throw new Error(`${field} deve ser maior que zero.`);
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

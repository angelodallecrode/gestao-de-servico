export class Cliente {
	// Identificador do cliente.
	public readonly codigo: number;
	// Nome completo do cliente.
	public readonly nome: string;
	// Email do cliente.
	public readonly email: string;

	constructor(params: { codigo: number; nome: string; email: string }) {
		// Validacoes basicas de preenchimento.
		this.codigo = Cliente.requireId(params.codigo, "codigo");
		this.nome = Cliente.requireNonEmpty(params.nome, "nome");
		this.email = Cliente.requireEmail(params.email);
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

	private static requireEmail(value: string): string {
		const email = Cliente.requireNonEmpty(value, "email");
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email)) {
			throw new Error("email invalido.");
		}

		return email;
	}
}

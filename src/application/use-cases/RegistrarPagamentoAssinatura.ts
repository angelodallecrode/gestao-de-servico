import type { IAssinaturaRepository } from "../interfaces/IAssinaturaRepository.js";

type RegistrarPagamentoInput = {
	// Codigo da assinatura paga.
	codigoAssinatura: number;
	// Data em que o pagamento foi efetivado.
	dataPagamento: Date;
};

export class RegistrarPagamentoAssinatura {
	// Acesso ao repositorio.
	private readonly assinaturaRepository: IAssinaturaRepository;

	constructor(assinaturaRepository: IAssinaturaRepository) {
		this.assinaturaRepository = assinaturaRepository;
	}

	async executar({ codigoAssinatura, dataPagamento }: RegistrarPagamentoInput): Promise<void> {
		// Garante que a assinatura existe antes de atualizar.
		const assinatura = await this.assinaturaRepository.buscarPorCodigo(codigoAssinatura);

		if (!assinatura) {
			// Pagamento de assinatura inexistente: ignora.
			return;
		}

		// Regra de negocio: o pagamento renova a validade ao registrar a nova data.
		await this.assinaturaRepository.atualizarDataUltimoPagamento(codigoAssinatura, dataPagamento);
	}
}

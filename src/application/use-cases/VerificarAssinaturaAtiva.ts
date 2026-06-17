import type { IAssinaturaRepository } from "../interfaces/IAssinaturaRepository.js";

export class VerificarAssinaturaAtiva {
	// Acesso ao repositorio.
	private readonly assinaturaRepository: IAssinaturaRepository;

	constructor(assinaturaRepository: IAssinaturaRepository) {
		this.assinaturaRepository = assinaturaRepository;
	}

	async executar(codigo: number): Promise<boolean> {
		// Busca a assinatura pelo codigo.
		const assinatura = await this.assinaturaRepository.buscarPorCodigo(codigo);

		// Assinatura inexistente nao esta ativa.
		if (!assinatura) {
			return false;
		}

		// Aplica a regra de negocio dos 30 dias.
		return assinatura.estaAtiva();
	}
}

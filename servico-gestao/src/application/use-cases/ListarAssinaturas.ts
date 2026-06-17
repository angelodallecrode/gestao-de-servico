import { Assinatura } from "../../domain/Assinatura.js";
import type { IAssinaturaRepository } from "../interfaces/IAssinaturaRepository.js";

type ListarAssinaturasInput = {
	// Filtro por cliente.
	codCli?: number;
	// Filtro por plano.
	codPlano?: number;
};

export class ListarAssinaturas {
	// Acesso ao repositorio.
	private readonly assinaturaRepository: IAssinaturaRepository;

	constructor(assinaturaRepository: IAssinaturaRepository) {
		this.assinaturaRepository = assinaturaRepository;
	}

	async executar(filtros: ListarAssinaturasInput): Promise<Assinatura[]> {
		// Aplica filtros por prioridade simples.
		if (filtros.codCli) {
			return this.assinaturaRepository.buscarPorCliente(filtros.codCli);
		}

		if (filtros.codPlano) {
			return this.assinaturaRepository.buscarPorPlano(filtros.codPlano);
		}

		// Sem filtros, lista tudo.
		return this.assinaturaRepository.listar();
	}
}

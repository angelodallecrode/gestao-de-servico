import { Plano } from "../../domain/Plano.js";
import type { IPlanoRepository } from "../interfaces/IPlanoRepository.js";

export class ListarPlanos {
	// Acesso ao repositorio.
	private readonly planoRepository: IPlanoRepository;

	constructor(planoRepository: IPlanoRepository) {
		this.planoRepository = planoRepository;
	}

	async executar(): Promise<Plano[]> {
		// Retorna todos os planos.
		return this.planoRepository.listar();
	}
}

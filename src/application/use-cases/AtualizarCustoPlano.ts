import { Plano } from "../../domain/Plano.js";
import type { IPlanoRepository } from "../interfaces/IPlanoRepository.js";

type AtualizarCustoPlanoInput = {
	// Codigo do plano.
	codigo: string;
	// Novo custo mensal.
	custoMensal: number;
};

export class AtualizarCustoPlano {
	// Acesso ao repositorio.
	private readonly planoRepository: IPlanoRepository;

	constructor(planoRepository: IPlanoRepository) {
		this.planoRepository = planoRepository;
	}

	async executar({ codigo, custoMensal }: AtualizarCustoPlanoInput): Promise<Plano> {
		// Atualiza e retorna o plano.
		return this.planoRepository.atualizarCusto(codigo, custoMensal);
	}
}

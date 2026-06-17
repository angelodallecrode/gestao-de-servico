import { Plano } from "../../domain/Plano.js";

export interface IPlanoRepository {
	// Lista todos os planos.
	listar(): Promise<Plano[]>;
	// Busca plano por codigo.
	buscarPorCodigo(codigo: string): Promise<Plano | null>;
	// Atualiza o custo do plano.
	atualizarCusto(codigo: string, custoMensal: number): Promise<Plano>;
}

import { Plano } from "../../domain/Plano.js";

export interface IPlanoRepository {
	// Lista todos os planos.
	listar(): Promise<Plano[]>;
	// Busca plano por codigo.
	buscarPorCodigo(codigo: number): Promise<Plano | null>;
	// Atualiza o custo do plano.
	atualizarCusto(codigo: number, custoMensal: number): Promise<Plano>;
}

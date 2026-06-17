import type { IGestaoClient } from "../../application/interfaces/IGestaoClient.js";

// URL base do ServicoGestao.
const GESTAO_URL = process.env.GESTAO_URL ?? "http://localhost:3000";

export class HttpGestaoClient implements IGestaoClient {
	async assinaturaAtiva(codass: number): Promise<boolean> {
		// Consulta o endpoint sincrono de atividade do ServicoGestao.
		const resposta = await fetch(`${GESTAO_URL}/gestao/assinaturas/${codass}/ativa`);

		if (!resposta.ok) {
			throw new Error(`ServicoGestao respondeu com status ${resposta.status}.`);
		}

		// O endpoint retorna o booleano puro (true/false).
		const ativa = (await resposta.json()) as boolean;
		return ativa === true;
	}
}

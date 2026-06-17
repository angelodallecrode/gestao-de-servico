import type { IAssinaturaCache } from "../interfaces/IAssinaturaCache.js";
import type { IGestaoClient } from "../interfaces/IGestaoClient.js";

export class ConsultarAssinaturaAtiva {
	// Cache interno de status de assinaturas.
	private readonly cache: IAssinaturaCache;
	// Cliente para consultar o ServicoGestao.
	private readonly gestaoClient: IGestaoClient;

	constructor(cache: IAssinaturaCache, gestaoClient: IGestaoClient) {
		this.cache = cache;
		this.gestaoClient = gestaoClient;
	}

	async executar(codass: number): Promise<boolean> {
		// Consulta a cache interna.
		const emCache = this.cache.obter(codass);
		if (emCache !== undefined) {
			return emCache;
		}

		// Cache miss: pergunta ao ServicoGestao e registra para consultas futuras.
		const ativa = await this.gestaoClient.assinaturaAtiva(codass);
		this.cache.registrar(codass, ativa);

		return ativa;
	}
}

import type { IAssinaturaCache } from "../../application/interfaces/IAssinaturaCache.js";

export class MemoriaAssinaturaCache implements IAssinaturaCache {
	// Cache simples em memoria desta instancia.
	private readonly entradas = new Map<number, boolean>();

	obter(codass: number): boolean | undefined {
		return this.entradas.get(codass);
	}

	registrar(codass: number, ativa: boolean): void {
		this.entradas.set(codass, ativa);
	}

	remover(codass: number): void {
		this.entradas.delete(codass);
	}
}

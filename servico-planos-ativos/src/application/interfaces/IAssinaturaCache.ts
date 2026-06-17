export interface IAssinaturaCache {
	// Retorna o status em cache, ou undefined se nao houver entrada.
	obter(codass: number): boolean | undefined;
	// Registra o status de uma assinatura.
	registrar(codass: number, ativa: boolean): void;
	// Remove a entrada da assinatura (invalidacao apos pagamento).
	remover(codass: number): void;
}

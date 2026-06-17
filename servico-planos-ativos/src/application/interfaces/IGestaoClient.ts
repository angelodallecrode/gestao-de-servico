export interface IGestaoClient {
	// Consulta no ServicoGestao se a assinatura permanece ativa.
	assinaturaAtiva(codass: number): Promise<boolean>;
}

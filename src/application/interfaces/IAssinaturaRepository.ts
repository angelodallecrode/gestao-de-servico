import { Assinatura } from "../../domain/Assinatura.js";

export interface IAssinaturaRepository {
	// Lista todas as assinaturas.
	listar(): Promise<Assinatura[]>;
	// Persiste a assinatura.
	salvar(assinatura: Assinatura): Promise<void>;
	// Lista assinaturas por cliente.
	buscarPorCliente(codCli: string): Promise<Assinatura[]>;
	// Lista assinaturas por plano.
	buscarPorPlano(codPlano: string): Promise<Assinatura[]>;
}

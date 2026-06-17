import { Cliente } from "../../domain/Cliente.js";

export interface IClienteRepository {
	// Lista todos os clientes.
	listar(): Promise<Cliente[]>;
	// Busca cliente por codigo.
	buscarPorCodigo(codigo: string): Promise<Cliente | null>;
}

import { Cliente } from "../../domain/Cliente.js";
import type { IClienteRepository } from "../interfaces/IClienteRepository.js";

export class ListarClientes {
	// Acesso ao repositorio.
	private readonly clienteRepository: IClienteRepository;

	constructor(clienteRepository: IClienteRepository) {
		this.clienteRepository = clienteRepository;
	}

	async executar(): Promise<Cliente[]> {
		// Retorna todos os clientes.
		return this.clienteRepository.listar();
	}
}

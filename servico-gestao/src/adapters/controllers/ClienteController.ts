import type { Request, Response } from "express";
import { ListarClientes } from "../../application/use-cases/ListarClientes.js";

export class ClienteController {
	// Caso de uso de listagem.
	private readonly listarClientes: ListarClientes;

	constructor(listarClientes: ListarClientes) {
		this.listarClientes = listarClientes;
	}

	async listar(req: Request, res: Response): Promise<Response> {
		try {
			// Executa listagem.
			const clientes = await this.listarClientes.executar();

			return res.status(200).json(clientes);
		} catch (error) {
			// Retorna erro generico.
			return res.status(500).json({ message: "Erro ao listar clientes." });
		}
	}
}

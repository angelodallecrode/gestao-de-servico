import { Prisma, PrismaClient } from "../../../generated/prisma/client.js";
import { Cliente } from "../../domain/Cliente.js";
import type { IClienteRepository } from "../../application/interfaces/IClienteRepository.js";

export class PrismaClienteRepository implements IClienteRepository {
	// Cliente Prisma.
	private readonly prisma: PrismaClient;

	constructor(prismaClient?: PrismaClient) {
		// Cria cliente Prisma com opcoes tipadas.
		this.prisma =
			prismaClient ??
			new PrismaClient({} as unknown as Prisma.Subset<Prisma.PrismaClientOptions, Prisma.PrismaClientOptions>);
	}

	async listar(): Promise<Cliente[]> {
		// Busca todos os clientes.
		const clientes = await this.prisma.cliente.findMany();

		return clientes.map((cliente) =>
			new Cliente({
				codigo: cliente.codigo,
				nome: cliente.nome,
				email: cliente.email,
			})
		);
	}

	async buscarPorCodigo(codigo: number): Promise<Cliente | null> {
		// Busca cliente por codigo.
		const cliente = await this.prisma.cliente.findUnique({
			where: { codigo },
		});

		if (!cliente) {
			return null;
		}

		return new Cliente({
			codigo: cliente.codigo,
			nome: cliente.nome,
			email: cliente.email,
		});
	}
}

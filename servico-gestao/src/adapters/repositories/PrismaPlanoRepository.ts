import { Prisma, PrismaClient } from "../../../generated/prisma/client.js";
import { Plano } from "../../domain/Plano.js";
import type { IPlanoRepository } from "../../application/interfaces/IPlanoRepository.js";

export class PrismaPlanoRepository implements IPlanoRepository {
	// Cliente Prisma.
	private readonly prisma: PrismaClient;

	constructor(prismaClient?: PrismaClient) {
		// Cria cliente Prisma com opcoes tipadas.
		this.prisma =
			prismaClient ??
			new PrismaClient({} as unknown as Prisma.Subset<Prisma.PrismaClientOptions, Prisma.PrismaClientOptions>);
	}

	async listar(): Promise<Plano[]> {
		// Busca todos os planos.
		const planos = await this.prisma.plano.findMany();

		return planos.map((plano) =>
			new Plano({
				codigo: plano.codigo,
				nome: plano.nome,
				custoMensal: plano.custoMensal,
				data: plano.data,
				descricao: plano.descricao,
			})
		);
	}

	async buscarPorCodigo(codigo: number): Promise<Plano | null> {
		// Busca plano por codigo.
		const plano = await this.prisma.plano.findUnique({
			where: { codigo },
		});

		if (!plano) {
			return null;
		}

		return new Plano({
			codigo: plano.codigo,
			nome: plano.nome,
			custoMensal: plano.custoMensal,
			data: plano.data,
			descricao: plano.descricao,
		});
	}

	async atualizarCusto(codigo: number, custoMensal: number): Promise<Plano> {
		// Atualiza apenas o custo mensal.
		const plano = await this.prisma.plano.update({
			where: { codigo },
			data: { custoMensal },
		});

		return new Plano({
			codigo: plano.codigo,
			nome: plano.nome,
			custoMensal: plano.custoMensal,
			data: plano.data,
			descricao: plano.descricao,
		});
	}
}

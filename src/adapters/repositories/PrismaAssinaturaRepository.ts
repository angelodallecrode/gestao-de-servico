import { Prisma, PrismaClient } from "../../../generated/prisma/client.js";
import { Assinatura } from "../../domain/Assinatura.js";
import type { IAssinaturaRepository } from "../../application/interfaces/IAssinaturaRepository.js";

export class PrismaAssinaturaRepository implements IAssinaturaRepository {
	// Cliente Prisma.
	private readonly prisma: PrismaClient;

	constructor(prismaClient?: PrismaClient) {
		// Cria cliente Prisma com opcoes tipadas.
		this.prisma =
			prismaClient ??
			new PrismaClient({} as unknown as Prisma.Subset<Prisma.PrismaClientOptions, Prisma.PrismaClientOptions>);
	}

	async listar(): Promise<Assinatura[]> {
		// Busca todas as assinaturas.
		const assinaturas = await this.prisma.assinatura.findMany();

		return assinaturas.map((assinatura: AssinaturaRecord) => this.mapToDomain(assinatura));
	}

	async salvar(assinatura: Assinatura): Promise<void> {
		// Cria nova assinatura.
		await this.prisma.assinatura.create({
			data: {
				codigo: assinatura.codigo,
				codPlano: assinatura.codPlano,
				codCli: assinatura.codCli,
				inicioFidelidade: assinatura.inicioFidelidade,
				fimFidelidade: assinatura.fimFidelidade,
				dataUltimoPagamento: assinatura.dataUltimoPagamento,
			},
		});
	}

	async buscarPorCliente(codCli: string): Promise<Assinatura[]> {
		// Busca assinaturas pelo cliente.
		const assinaturas = await this.prisma.assinatura.findMany({
			where: { codCli },
		});

		return assinaturas.map((assinatura: AssinaturaRecord) => this.mapToDomain(assinatura));
	}

	async buscarPorPlano(codPlano: string): Promise<Assinatura[]> {
		// Busca assinaturas pelo plano.
		const assinaturas = await this.prisma.assinatura.findMany({
			where: { codPlano },
		});

		return assinaturas.map((assinatura: AssinaturaRecord) => this.mapToDomain(assinatura));
	}

	private mapToDomain(assinatura: AssinaturaRecord): Assinatura {
		// Converte dados do Prisma para dominio.
		return new Assinatura({
			codigo: assinatura.codigo,
			codPlano: assinatura.codPlano,
			codCli: assinatura.codCli,
			inicioFidelidade: assinatura.inicioFidelidade,
			fimFidelidade: assinatura.fimFidelidade,
			dataUltimoPagamento: assinatura.dataUltimoPagamento,
		});
	}
}

type AssinaturaRecord = {
	// Campos retornados pelo Prisma.
	codigo: string;
	codPlano: string;
	codCli: string;
	inicioFidelidade: Date;
	fimFidelidade: Date;
	dataUltimoPagamento: Date | null;
};

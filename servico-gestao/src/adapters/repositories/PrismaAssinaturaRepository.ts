import { Prisma, PrismaClient } from "../../../generated/prisma/client.js";
import { Assinatura } from "../../domain/Assinatura.js";
import type { IAssinaturaRepository, NovaAssinatura } from "../../application/interfaces/IAssinaturaRepository.js";

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

	async salvar(dados: NovaAssinatura): Promise<Assinatura> {
		// Cria nova assinatura; o codigo e gerado pelo banco (autoincrement).
		const assinatura = await this.prisma.assinatura.create({
			data: {
				codPlano: dados.codPlano,
				codCli: dados.codCli,
				inicioFidelidade: dados.inicioFidelidade,
				fimFidelidade: dados.fimFidelidade,
				dataUltimoPagamento: dados.dataUltimoPagamento ?? null,
				custoFinal: dados.custoFinal,
				descricao: dados.descricao,
			},
		});

		return this.mapToDomain(assinatura);
	}

	async buscarPorCliente(codCli: number): Promise<Assinatura[]> {
		// Busca assinaturas pelo cliente.
		const assinaturas = await this.prisma.assinatura.findMany({
			where: { codCli },
		});

		return assinaturas.map((assinatura: AssinaturaRecord) => this.mapToDomain(assinatura));
	}

	async buscarPorPlano(codPlano: number): Promise<Assinatura[]> {
		// Busca assinaturas pelo plano.
		const assinaturas = await this.prisma.assinatura.findMany({
			where: { codPlano },
		});

		return assinaturas.map((assinatura: AssinaturaRecord) => this.mapToDomain(assinatura));
	}

	async buscarPorCodigo(codigo: number): Promise<Assinatura | null> {
		// Busca assinatura pelo codigo.
		const assinatura = await this.prisma.assinatura.findUnique({
			where: { codigo },
		});

		if (!assinatura) {
			return null;
		}

		return this.mapToDomain(assinatura);
	}

	async atualizarDataUltimoPagamento(codigo: number, dataUltimoPagamento: Date): Promise<Assinatura> {
		// Atualiza apenas a data do ultimo pagamento.
		const assinatura = await this.prisma.assinatura.update({
			where: { codigo },
			data: { dataUltimoPagamento },
		});

		return this.mapToDomain(assinatura);
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
			custoFinal: assinatura.custoFinal,
			descricao: assinatura.descricao,
		});
	}
}

type AssinaturaRecord = {
	// Campos retornados pelo Prisma.
	codigo: number;
	codPlano: number;
	codCli: number;
	inicioFidelidade: Date;
	fimFidelidade: Date;
	dataUltimoPagamento: Date | null;
	custoFinal: number;
	descricao: string;
};

import { Prisma, PrismaClient } from "../../../generated/prisma/client.js";
import { Pagamento } from "../../domain/Pagamento.js";
import type { IPagamentoRepository, NovoPagamento } from "../../application/interfaces/IPagamentoRepository.js";

export class PrismaPagamentoRepository implements IPagamentoRepository {
	// Cliente Prisma.
	private readonly prisma: PrismaClient;

	constructor(prismaClient?: PrismaClient) {
		// Cria cliente Prisma com opcoes tipadas.
		this.prisma =
			prismaClient ??
			new PrismaClient({} as unknown as Prisma.Subset<Prisma.PrismaClientOptions, Prisma.PrismaClientOptions>);
	}

	async salvar(dados: NovoPagamento): Promise<Pagamento> {
		// Persiste o pagamento; o codigo e gerado pelo banco (autoincrement).
		const pagamento = await this.prisma.pagamento.create({
			data: {
				codAss: dados.codAss,
				valorPago: dados.valorPago,
				dataPagamento: dados.dataPagamento,
			},
		});

		return new Pagamento({
			codigo: pagamento.codigo,
			codAss: pagamento.codAss,
			valorPago: pagamento.valorPago,
			dataPagamento: pagamento.dataPagamento,
		});
	}
}

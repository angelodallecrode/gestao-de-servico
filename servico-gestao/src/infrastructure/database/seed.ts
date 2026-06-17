import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../../../generated/prisma/client.js";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
	// Dados fixos de clientes.
	const clientes = [
		{ codigo: 1, nome: "Ana Lima", email: "ana.lima@email.com" },
		{ codigo: 2, nome: "Bruno Souza", email: "bruno.souza@email.com" },
		{ codigo: 3, nome: "Carla Reis", email: "carla.reis@email.com" },
		{ codigo: 4, nome: "Diego Alves", email: "diego.alves@email.com" },
		{ codigo: 5, nome: "Ester Nunes", email: "ester.nunes@email.com" },
		{ codigo: 6, nome: "Fabio Moreira", email: "fabio.moreira@email.com" },
		{ codigo: 7, nome: "Gabi Rocha", email: "gabi.rocha@email.com" },
		{ codigo: 8, nome: "Helio Costa", email: "helio.costa@email.com" },
		{ codigo: 9, nome: "Iris Araujo", email: "iris.araujo@email.com" },
		{ codigo: 10, nome: "Joao Matos", email: "joao.matos@email.com" },
	];

	// Dados fixos de planos.
	const planos = [
		{
			codigo: 1,
			nome: "Basico",
			custoMensal: 29.9,
			data: new Date("2026-01-01"),
			descricao: "Plano basico com acesso essencial.",
		},
		{
			codigo: 2,
			nome: "Padrao",
			custoMensal: 59.9,
			data: new Date("2026-01-10"),
			descricao: "Plano padrao com recursos extras.",
		},
		{
			codigo: 3,
			nome: "Premium",
			custoMensal: 99.9,
			data: new Date("2026-02-01"),
			descricao: "Plano premium com suporte prioritario.",
		},
		{
			codigo: 4,
			nome: "Equipe",
			custoMensal: 149.9,
			data: new Date("2026-02-15"),
			descricao: "Plano para pequenas equipes.",
		},
		{
			codigo: 5,
			nome: "Enterprise",
			custoMensal: 249.9,
			data: new Date("2026-03-01"),
			descricao: "Plano corporativo completo.",
		},
	];

	// Dados fixos de assinaturas (custoFinal com desconto de fidelidade de 10%).
	const assinaturas = [
		{
			codigo: 1,
			codPlano: 1,
			codCli: 1,
			inicioFidelidade: new Date("2026-03-01"),
			fimFidelidade: new Date("2027-03-01"),
			dataUltimoPagamento: new Date("2026-06-01"),
			custoFinal: 26.91,
			descricao: "Desconto de fidelidade de 10% no primeiro ano.",
		},
		{
			codigo: 2,
			codPlano: 2,
			codCli: 2,
			inicioFidelidade: new Date("2026-03-10"),
			fimFidelidade: new Date("2027-03-10"),
			dataUltimoPagamento: new Date("2026-06-05"),
			custoFinal: 53.91,
			descricao: "Desconto de fidelidade de 10% no primeiro ano.",
		},
		{
			codigo: 3,
			codPlano: 3,
			codCli: 3,
			inicioFidelidade: new Date("2026-03-15"),
			fimFidelidade: new Date("2027-03-15"),
			dataUltimoPagamento: new Date("2026-06-10"),
			custoFinal: 89.91,
			descricao: "Desconto de fidelidade de 10% no primeiro ano.",
		},
		{
			codigo: 4,
			codPlano: 4,
			codCli: 4,
			inicioFidelidade: new Date("2026-04-01"),
			fimFidelidade: new Date("2027-04-01"),
			dataUltimoPagamento: new Date("2026-06-14"),
			custoFinal: 134.91,
			descricao: "Desconto de fidelidade de 10% no primeiro ano.",
		},
		{
			codigo: 5,
			codPlano: 5,
			codCli: 5,
			inicioFidelidade: new Date("2026-04-10"),
			fimFidelidade: new Date("2027-04-10"),
			dataUltimoPagamento: new Date("2026-06-16"),
			custoFinal: 224.91,
			descricao: "Desconto de fidelidade de 10% no primeiro ano.",
		},
	];

	// Insere clientes.
	for (const cliente of clientes) {
		await prisma.cliente.upsert({
			where: { codigo: cliente.codigo },
			update: {},
			create: cliente,
		});
	}

	// Insere planos.
	for (const plano of planos) {
		await prisma.plano.upsert({
			where: { codigo: plano.codigo },
			update: {},
			create: plano,
		});
	}

	// Insere assinaturas.
	for (const assinatura of assinaturas) {
		await prisma.assinatura.upsert({
			where: { codigo: assinatura.codigo },
			update: {},
			create: assinatura,
		});
	}
}

main()
	.catch((error) => {
		// Loga erro no seed.
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		// Encerra conexao.
		await prisma.$disconnect();
	});

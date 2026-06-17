import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../../../generated/prisma/client.js";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
	// Dados fixos de clientes.
	const clientes = [
		{ codigo: "CLI-001", nome: "Ana Lima", email: "ana.lima@email.com" },
		{ codigo: "CLI-002", nome: "Bruno Souza", email: "bruno.souza@email.com" },
		{ codigo: "CLI-003", nome: "Carla Reis", email: "carla.reis@email.com" },
		{ codigo: "CLI-004", nome: "Diego Alves", email: "diego.alves@email.com" },
		{ codigo: "CLI-005", nome: "Ester Nunes", email: "ester.nunes@email.com" },
		{ codigo: "CLI-006", nome: "Fabio Moreira", email: "fabio.moreira@email.com" },
		{ codigo: "CLI-007", nome: "Gabi Rocha", email: "gabi.rocha@email.com" },
		{ codigo: "CLI-008", nome: "Helio Costa", email: "helio.costa@email.com" },
		{ codigo: "CLI-009", nome: "Iris Araujo", email: "iris.araujo@email.com" },
		{ codigo: "CLI-010", nome: "Joao Matos", email: "joao.matos@email.com" },
	];

	// Dados fixos de planos.
	const planos = [
		{
			codigo: "PLA-001",
			nome: "Basico",
			custoMensal: 29.9,
			data: new Date("2026-01-01"),
			descricao: "Plano basico com acesso essencial.",
		},
		{
			codigo: "PLA-002",
			nome: "Padrao",
			custoMensal: 59.9,
			data: new Date("2026-01-10"),
			descricao: "Plano padrao com recursos extras.",
		},
		{
			codigo: "PLA-003",
			nome: "Premium",
			custoMensal: 99.9,
			data: new Date("2026-02-01"),
			descricao: "Plano premium com suporte prioritario.",
		},
		{
			codigo: "PLA-004",
			nome: "Equipe",
			custoMensal: 149.9,
			data: new Date("2026-02-15"),
			descricao: "Plano para pequenas equipes.",
		},
		{
			codigo: "PLA-005",
			nome: "Enterprise",
			custoMensal: 249.9,
			data: new Date("2026-03-01"),
			descricao: "Plano corporativo completo.",
		},
	];

	// Dados fixos de assinaturas.
	const assinaturas = [
		{
			codigo: "ASS-001",
			codPlano: "PLA-001",
			codCli: "CLI-001",
			inicioFidelidade: new Date("2026-03-01"),
			fimFidelidade: new Date("2027-03-01"),
			dataUltimoPagamento: new Date("2026-06-01"),
		},
		{
			codigo: "ASS-002",
			codPlano: "PLA-002",
			codCli: "CLI-002",
			inicioFidelidade: new Date("2026-03-10"),
			fimFidelidade: new Date("2027-03-10"),
			dataUltimoPagamento: new Date("2026-06-05"),
		},
		{
			codigo: "ASS-003",
			codPlano: "PLA-003",
			codCli: "CLI-003",
			inicioFidelidade: new Date("2026-03-15"),
			fimFidelidade: new Date("2027-03-15"),
			dataUltimoPagamento: new Date("2026-06-10"),
		},
		{
			codigo: "ASS-004",
			codPlano: "PLA-004",
			codCli: "CLI-004",
			inicioFidelidade: new Date("2026-04-01"),
			fimFidelidade: new Date("2027-04-01"),
			dataUltimoPagamento: new Date("2026-06-14"),
		},
		{
			codigo: "ASS-005",
			codPlano: "PLA-005",
			codCli: "CLI-005",
			inicioFidelidade: new Date("2026-04-10"),
			fimFidelidade: new Date("2027-04-10"),
			dataUltimoPagamento: new Date("2026-06-16"),
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

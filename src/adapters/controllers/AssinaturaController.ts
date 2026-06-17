import type { Request, Response } from "express";
import type { Assinatura } from "../../domain/Assinatura.js";
import { CriarAssinatura } from "../../application/use-cases/CriarAssinatura.js";
import { ListarAssinaturas } from "../../application/use-cases/ListarAssinaturas.js";

const TIPOS_VALIDOS = ["TODOS", "ATIVOS", "CANCELADOS"] as const;
type Tipo = (typeof TIPOS_VALIDOS)[number];

export class AssinaturaController {
	private readonly criarAssinatura: CriarAssinatura;
	private readonly listarAssinaturas: ListarAssinaturas;

	constructor(criarAssinatura: CriarAssinatura, listarAssinaturas: ListarAssinaturas) {
		this.criarAssinatura = criarAssinatura;
		this.listarAssinaturas = listarAssinaturas;
	}

	async criar(req: Request, res: Response): Promise<Response> {
		try {
			const { codCli, codPlano, custoFinal, descricao } = req.body as {
				codCli?: string;
				codPlano?: string;
				custoFinal?: number;
				descricao?: string;
			};

			if (!codCli || !codPlano || typeof custoFinal !== "number" || !descricao) {
				return res.status(400).json({ message: "Dados invalidos." });
			}

			const assinatura = await this.criarAssinatura.executar({
				codCli,
				codPlano,
				custoFinal,
				descricao,
			});

			return res.status(201).json(assinatura);
		} catch (error) {
			return res.status(500).json({ message: "Erro ao criar assinatura." });
		}
	}

	async listarPorTipo(req: Request, res: Response): Promise<Response> {
		try {
			const tipo = (req.params.tipo as string).toUpperCase() as Tipo;

			if (!TIPOS_VALIDOS.includes(tipo)) {
				return res.status(400).json({ message: "Tipo invalido. Use TODOS, ATIVOS ou CANCELADOS." });
			}

			const todas = await this.listarAssinaturas.executar({});
			const agora = new Date();

			const filtradas = todas.filter((a) => {
				if (tipo === "TODOS") return true;
				const ativo = a.fimFidelidade > agora;
				return tipo === "ATIVOS" ? ativo : !ativo;
			});

			return res.status(200).json(filtradas.map(AssinaturaController.toResponseDTO));
		} catch (error) {
			return res.status(500).json({ message: "Erro ao listar assinaturas." });
		}
	}

	async listarPorCliente(req: Request, res: Response): Promise<Response> {
		try {
			const codcli = req.params.codcli as string;

			if (!codcli) {
				return res.status(400).json({ message: "Dados invalidos." });
			}

			const assinaturas = await this.listarAssinaturas.executar({ codCli: codcli });

			return res.status(200).json(assinaturas.map(AssinaturaController.toResponseDTO));
		} catch (error) {
			return res.status(500).json({ message: "Erro ao listar assinaturas." });
		}
	}

	async listarPorPlano(req: Request, res: Response): Promise<Response> {
		try {
			const codplano = req.params.codplano as string;

			if (!codplano) {
				return res.status(400).json({ message: "Dados invalidos." });
			}

			const assinaturas = await this.listarAssinaturas.executar({ codPlano: codplano });

			return res.status(200).json(assinaturas.map(AssinaturaController.toResponseDTO));
		} catch (error) {
			return res.status(500).json({ message: "Erro ao listar assinaturas." });
		}
	}

	private static toResponseDTO(assinatura: Assinatura) {
		const status = assinatura.fimFidelidade > new Date() ? "ATIVO" : "CANCELADO";
		return {
			codigo: assinatura.codigo,
			codCli: assinatura.codCli,
			codPlano: assinatura.codPlano,
			inicioFidelidade: assinatura.inicioFidelidade,
			fimFidelidade: assinatura.fimFidelidade,
			status,
		};
	}
}

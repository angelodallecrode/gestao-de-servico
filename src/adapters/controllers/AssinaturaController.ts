import type { Request, Response } from "express";
import type { Assinatura } from "../../domain/Assinatura.js";
import { CriarAssinatura } from "../../application/use-cases/CriarAssinatura.js";
import { ListarAssinaturas } from "../../application/use-cases/ListarAssinaturas.js";
import { VerificarAssinaturaAtiva } from "../../application/use-cases/VerificarAssinaturaAtiva.js";

const TIPOS_VALIDOS = ["TODOS", "ATIVOS", "CANCELADOS"] as const;
type Tipo = (typeof TIPOS_VALIDOS)[number];

export class AssinaturaController {
	private readonly criarAssinatura: CriarAssinatura;
	private readonly listarAssinaturas: ListarAssinaturas;
	private readonly verificarAssinaturaAtiva: VerificarAssinaturaAtiva;

	constructor(
		criarAssinatura: CriarAssinatura,
		listarAssinaturas: ListarAssinaturas,
		verificarAssinaturaAtiva: VerificarAssinaturaAtiva
	) {
		this.criarAssinatura = criarAssinatura;
		this.listarAssinaturas = listarAssinaturas;
		this.verificarAssinaturaAtiva = verificarAssinaturaAtiva;
	}

	async criar(req: Request, res: Response): Promise<Response> {
		try {
			const { codCli, codPlano, custoFinal, descricao } = req.body as {
				codCli?: number;
				codPlano?: number;
				custoFinal?: number;
				descricao?: string;
			};

			if (
				typeof codCli !== "number" ||
				typeof codPlano !== "number" ||
				typeof custoFinal !== "number" ||
				!descricao
			) {
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
				const ativo = a.estaAtiva(agora);
				return tipo === "ATIVOS" ? ativo : !ativo;
			});

			return res.status(200).json(filtradas.map(AssinaturaController.toResponseDTO));
		} catch (error) {
			return res.status(500).json({ message: "Erro ao listar assinaturas." });
		}
	}

	async listarPorCliente(req: Request, res: Response): Promise<Response> {
		try {
			const codcli = Number(req.params.codcli);

			if (!Number.isInteger(codcli)) {
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
			const codplano = Number(req.params.codplano);

			if (!Number.isInteger(codplano)) {
				return res.status(400).json({ message: "Dados invalidos." });
			}

			const assinaturas = await this.listarAssinaturas.executar({ codPlano: codplano });

			return res.status(200).json(assinaturas.map(AssinaturaController.toResponseDTO));
		} catch (error) {
			return res.status(500).json({ message: "Erro ao listar assinaturas." });
		}
	}

	async verificarAtiva(req: Request, res: Response): Promise<Response> {
		try {
			const codass = Number(req.params.codass);

			if (!Number.isInteger(codass)) {
				return res.status(400).json({ message: "Dados invalidos." });
			}

			// Responde apenas o booleano de atividade da assinatura.
			const ativa = await this.verificarAssinaturaAtiva.executar(codass);

			return res.status(200).json(ativa);
		} catch (error) {
			return res.status(500).json({ message: "Erro ao verificar assinatura." });
		}
	}

	private static toResponseDTO(assinatura: Assinatura) {
		const status = assinatura.estaAtiva() ? "ATIVO" : "CANCELADO";
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

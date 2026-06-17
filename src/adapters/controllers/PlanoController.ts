import type { Request, Response } from "express";
import { AtualizarCustoPlano } from "../../application/use-cases/AtualizarCustoPlano.js";
import { ListarPlanos } from "../../application/use-cases/ListarPlanos.js";

export class PlanoController {
	// Caso de uso de listagem.
	private readonly listarPlanos: ListarPlanos;
	// Caso de uso de atualizacao.
	private readonly atualizarCustoPlano: AtualizarCustoPlano;

	constructor(listarPlanos: ListarPlanos, atualizarCustoPlano: AtualizarCustoPlano) {
		this.listarPlanos = listarPlanos;
		this.atualizarCustoPlano = atualizarCustoPlano;
	}

	async listar(req: Request, res: Response): Promise<Response> {
		try {
			// Executa listagem.
			const planos = await this.listarPlanos.executar();

			return res.status(200).json(planos);
		} catch (error) {
			// Retorna erro generico.
			return res.status(500).json({ message: "Erro ao listar planos." });
		}
	}

	async atualizarCusto(req: Request, res: Response): Promise<Response> {
		try {
			// Extrai dados da requisicao.
			const { codigo, idPlano } = req.params as { codigo?: string; idPlano?: string };
			const { custoMensal } = req.body as { custoMensal?: number };
			const codigoPlano = codigo ?? idPlano;

			if (!codigoPlano || typeof custoMensal !== "number") {
				return res.status(400).json({ message: "Dados invalidos." });
			}

			const plano = await this.atualizarCustoPlano.executar({
				codigo: codigoPlano,
				custoMensal,
			});

			return res.status(200).json(plano);
		} catch (error) {
			// Retorna erro generico.
			return res.status(500).json({ message: "Erro ao atualizar plano." });
		}
	}
}

import type { Request, Response } from "express";
import { ConsultarAssinaturaAtiva } from "../../application/use-cases/ConsultarAssinaturaAtiva.js";

export class PlanosAtivosController {
	private readonly consultarAssinaturaAtiva: ConsultarAssinaturaAtiva;

	constructor(consultarAssinaturaAtiva: ConsultarAssinaturaAtiva) {
		this.consultarAssinaturaAtiva = consultarAssinaturaAtiva;
	}

	async consultar(req: Request, res: Response): Promise<Response> {
		try {
			const codass = Number(req.params.codass);

			if (!Number.isInteger(codass)) {
				return res.status(400).json({ message: "Dados invalidos." });
			}

			// Responde apenas o booleano de atividade.
			const ativa = await this.consultarAssinaturaAtiva.executar(codass);

			return res.status(200).json(ativa);
		} catch (error) {
			return res.status(500).json({ message: "Erro ao consultar plano ativo." });
		}
	}
}

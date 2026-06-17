import type { Request, Response } from "express";
import { RegistrarPagamento } from "../../application/use-cases/RegistrarPagamento.js";

export class PagamentoController {
	private readonly registrarPagamento: RegistrarPagamento;

	constructor(registrarPagamento: RegistrarPagamento) {
		this.registrarPagamento = registrarPagamento;
	}

	async registrar(req: Request, res: Response): Promise<Response> {
		try {
			const { dia, mes, ano, codigoAssinatura, valorPago } = req.body as {
				dia?: number;
				mes?: number;
				ano?: number;
				codigoAssinatura?: number;
				valorPago?: number;
			};

			// Validacao basica dos parametros de entrada.
			if (
				typeof dia !== "number" ||
				typeof mes !== "number" ||
				typeof ano !== "number" ||
				typeof codigoAssinatura !== "number" ||
				typeof valorPago !== "number"
			) {
				return res.status(400).json({ message: "Dados invalidos." });
			}

			await this.registrarPagamento.executar({ dia, mes, ano, codigoAssinatura, valorPago });

			// JSON resposta: nenhum.
			return res.status(201).send();
		} catch (error) {
			return res.status(500).json({ message: "Erro ao registrar pagamento." });
		}
	}
}

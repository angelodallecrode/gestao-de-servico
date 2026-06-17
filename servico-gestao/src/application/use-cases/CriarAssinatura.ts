import { Assinatura } from "../../domain/Assinatura.js";
import type { IAssinaturaRepository } from "../interfaces/IAssinaturaRepository.js";

type CriarAssinaturaInput = {
	// Codigo do cliente.
	codCli: number;
	// Codigo do plano.
	codPlano: number;
	// Valor final informado (com desconto de fidelidade).
	custoFinal: number;
	// Descricao informada.
	descricao: string;
};

export class CriarAssinatura {
	// Acesso ao repositorio.
	private readonly assinaturaRepository: IAssinaturaRepository;

	constructor(assinaturaRepository: IAssinaturaRepository) {
		this.assinaturaRepository = assinaturaRepository;
	}

	async executar({ codCli, codPlano, custoFinal, descricao }: CriarAssinaturaInput): Promise<Assinatura> {
		// Define inicio como hoje.
		const inicioFidelidade = new Date();
		// Soma 365 dias para o fim (fidelidade de um ano).
		const fimFidelidade = new Date(inicioFidelidade);
		fimFidelidade.setDate(fimFidelidade.getDate() + 365);

		// Persiste e retorna a assinatura criada (codigo gerado pelo banco).
		return this.assinaturaRepository.salvar({
			codPlano,
			codCli,
			inicioFidelidade,
			fimFidelidade,
			// Pagamento inicial no ato da criacao: assinatura nasce ATIVA pela regra dos 30 dias.
			dataUltimoPagamento: inicioFidelidade,
			custoFinal,
			descricao,
		});
	}
}

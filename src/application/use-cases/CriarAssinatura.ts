import { Assinatura } from "../../domain/Assinatura.js";
import type { IAssinaturaRepository } from "../interfaces/IAssinaturaRepository.js";

type CriarAssinaturaInput = {
	// Codigo do cliente.
	codCli: string;
	// Codigo do plano.
	codPlano: string;
	// Valor final informado.
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

	async executar({ codCli, codPlano }: CriarAssinaturaInput): Promise<Assinatura> {
		// Define inicio como hoje.
		const inicioFidelidade = new Date();
		// Soma 365 dias para o fim.
		const fimFidelidade = new Date(inicioFidelidade);
		fimFidelidade.setDate(fimFidelidade.getDate() + 365);

		const assinatura = new Assinatura({
			// Codigo simples gerado internamente.
			codigo: CriarAssinatura.gerarCodigo(codCli, codPlano),
			codPlano,
			codCli,
			inicioFidelidade,
			fimFidelidade,
			// Pagamento inicial no ato da criacao: assinatura nasce ATIVA pela regra dos 30 dias.
			dataUltimoPagamento: inicioFidelidade,
		});

		// Persiste a assinatura.
		await this.assinaturaRepository.salvar(assinatura);

		return assinatura;
	}

	private static gerarCodigo(codCli: string, codPlano: string): string {
		// Gera um codigo simples com timestamp.
		return `${codCli}-${codPlano}-${Date.now()}`;
	}
}

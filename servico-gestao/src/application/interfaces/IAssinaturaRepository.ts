import { Assinatura } from "../../domain/Assinatura.js";

// Dados para criar uma assinatura (o codigo e gerado pelo banco).
export type NovaAssinatura = {
	codPlano: number;
	codCli: number;
	inicioFidelidade: Date;
	fimFidelidade: Date;
	dataUltimoPagamento?: Date | null;
	custoFinal: number;
	descricao: string;
};

export interface IAssinaturaRepository {
	// Lista todas as assinaturas.
	listar(): Promise<Assinatura[]>;
	// Persiste a assinatura e retorna a entidade criada (com codigo).
	salvar(dados: NovaAssinatura): Promise<Assinatura>;
	// Lista assinaturas por cliente.
	buscarPorCliente(codCli: number): Promise<Assinatura[]>;
	// Lista assinaturas por plano.
	buscarPorPlano(codPlano: number): Promise<Assinatura[]>;
	// Busca uma assinatura pelo codigo.
	buscarPorCodigo(codigo: number): Promise<Assinatura | null>;
	// Atualiza a data do ultimo pagamento de uma assinatura.
	atualizarDataUltimoPagamento(codigo: number, dataUltimoPagamento: Date): Promise<Assinatura>;
}

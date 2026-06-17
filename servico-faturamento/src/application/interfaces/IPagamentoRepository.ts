import { Pagamento } from "../../domain/Pagamento.js";

// Dados para registrar um pagamento (o codigo e gerado pelo banco).
export type NovoPagamento = {
	codAss: number;
	valorPago: number;
	dataPagamento: Date;
};

export interface IPagamentoRepository {
	// Persiste o pagamento na base propria e retorna a entidade criada.
	salvar(dados: NovoPagamento): Promise<Pagamento>;
}

# Sistema de Gestão de Assinaturas

Arquitetura mista (serviço principal + microsserviços) integrada por **API Gateway** e
**message broker**.

## Componentes

| Componente            | Tecnologia            | Porta (host) | Responsabilidade                                              |
| --------------------- | --------------------- | ------------ | ------------------------------------------------------------ |
| **api-gateway**       | Nginx                 | `8080`       | Ponto de entrada único e hub de comunicação entre serviços   |
| **servico-gestao**    | Express + Prisma/SQLite | `3000`     | Clientes, planos e assinaturas; valida atividade de assinatura |
| **servico-faturamento** | Express + Prisma/SQLite | `3001`   | Registra pagamentos (base própria) e gera eventos            |
| **servico-planos-ativos** | Express + cache em memória | `3002` | Responde rapidamente se uma assinatura está ativa            |
| **rabbitmq**          | RabbitMQ              | `5672` / `15672` | Broker dos eventos de pagamento                          |

Diagrama de componentes (PlantUML) na especificação: cada serviço fala com seu armazenamento
(BancoDeDadosGestao, BancoDeDadosFaturamento, Cache) e com o Broker.

## Como executar

Pré-requisito: Docker + Docker Compose.

```bash
docker compose up --build
```

Isso sobe o RabbitMQ, aplica as migrações, popula o banco do ServicoGestao (seed) e inicia os
três serviços atrás do API Gateway.

Painel do RabbitMQ: <http://localhost:15672> (guest / guest).

### Escalar o ServicoPlanosAtivos (múltiplas instâncias)

```bash
docker compose up --build --scale servico-planos-ativos=3
```

Cada instância mantém sua própria cache e declara sua própria fila no broker (fanout), de modo
que **todas** recebem o evento de invalidação. (Remova o mapeamento de porta `3002:3002` ao
escalar para evitar conflito de portas no host.)

## Endpoints (via API Gateway — `http://localhost:8080`)

### ServicoGestao
- `GET  /gestao/clientes`
- `GET  /gestao/planos`
- `PATCH /gestao/planos/:idPlano`
- `POST /gestao/assinaturas`
- `GET  /gestao/assinaturas/:codass/ativa` → booleano (consulta de atividade)
- `GET  /gestao/assinaturas/:tipo` (TODOS | ATIVOS | CANCELADOS)
- `GET  /gestao/assinaturascliente/:codcli`
- `GET  /gestao/assinaturasplano/:codplano`

### ServicoFaturamento
- `POST /registrarpagamento`
  ```json
  { "dia": 17, "mes": 6, "ano": 2026, "codigoAssinatura": 1, "valorPago": 29.9 }
  ```
  Resposta: `201` sem corpo.

### ServicoPlanosAtivos
- `GET /planosativos/:codass` → `true` ou `false`

## Fluxo de eventos (pagamento)

1. Cliente chama `POST /registrarpagamento` no **ServicoFaturamento**.
2. ServicoFaturamento grava o pagamento na sua base e publica nos exchanges (fanout):
   - `PagamentoPlanoServicoGestao`
   - `PagamentoPlanoServicoPlanosAtivos`
3. **ServicoGestao** consome `PagamentoPlanoServicoGestao` e atualiza `dataUltimoPagamento`
   da assinatura (regra dos 30 dias).
4. **ServicoPlanosAtivos** consome `PagamentoPlanoServicoPlanosAtivos` e **remove** a entrada
   da cache. Na próxima consulta `GET /planosativos/:codass`, havendo cache miss, ele pergunta
   ao ServicoGestao (via gateway) e regrava a resposta atualizada.

## Regra de atividade da assinatura

Uma assinatura está **ATIVA** se houve pagamento (`dataUltimoPagamento`) nos últimos **30 dias**;
caso contrário, **CANCELADA**. Implementada em `Assinatura.estaAtiva()` no ServicoGestao.

## Seed

O `seed` do ServicoGestao popula **10 clientes**, **5 planos** e **5 assinaturas**.

import { Router } from "express";
import { PagamentoController } from "../../adapters/controllers/PagamentoController.js";
import { PrismaPagamentoRepository } from "../../adapters/repositories/PrismaPagamentoRepository.js";
import { RegistrarPagamento } from "../../application/use-cases/RegistrarPagamento.js";
import { prisma } from "../database/prismaClient.js";
import { RabbitMQPagamentoPublisher } from "../messaging/RabbitMQPagamentoPublisher.js";

const routes = Router();

// Repositorio e publicador.
const pagamentoRepository = new PrismaPagamentoRepository(prisma);
const eventPublisher = new RabbitMQPagamentoPublisher();

// Caso de uso.
const registrarPagamento = new RegistrarPagamento(pagamentoRepository, eventPublisher);

// Controlador.
const pagamentoController = new PagamentoController(registrarPagamento);

// Rota de registro de pagamento.
routes.post("/registrarpagamento", (req, res) => pagamentoController.registrar(req, res));

export { routes };

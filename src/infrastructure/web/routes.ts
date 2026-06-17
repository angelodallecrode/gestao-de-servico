import { Router } from "express";
import { AssinaturaController } from "../../adapters/controllers/AssinaturaController.js";
import { ClienteController } from "../../adapters/controllers/ClienteController.js";
import { PlanoController } from "../../adapters/controllers/PlanoController.js";
import { PrismaAssinaturaRepository } from "../../adapters/repositories/PrismaAssinaturaRepository.js";
import { PrismaClienteRepository } from "../../adapters/repositories/PrismaClienteRepository.js";
import { PrismaPlanoRepository } from "../../adapters/repositories/PrismaPlanoRepository.js";
import { AtualizarCustoPlano } from "../../application/use-cases/AtualizarCustoPlano.js";
import { CriarAssinatura } from "../../application/use-cases/CriarAssinatura.js";
import { ListarAssinaturas } from "../../application/use-cases/ListarAssinaturas.js";
import { ListarClientes } from "../../application/use-cases/ListarClientes.js";
import { ListarPlanos } from "../../application/use-cases/ListarPlanos.js";
import { prisma } from "../database/prismaClient.js";

const routes = Router();

// Repositorios Prisma.
const clienteRepository = new PrismaClienteRepository(prisma);
const planoRepository = new PrismaPlanoRepository(prisma);
const assinaturaRepository = new PrismaAssinaturaRepository(prisma);

// Casos de uso.
const listarClientes = new ListarClientes(clienteRepository);
const listarPlanos = new ListarPlanos(planoRepository);
const atualizarCustoPlano = new AtualizarCustoPlano(planoRepository);
const criarAssinatura = new CriarAssinatura(assinaturaRepository);
const listarAssinaturas = new ListarAssinaturas(assinaturaRepository);

// Controladores.
const clienteController = new ClienteController(listarClientes);
const planoController = new PlanoController(listarPlanos, atualizarCustoPlano);
const assinaturaController = new AssinaturaController(criarAssinatura, listarAssinaturas);

// Rotas de clientes.
routes.get("/gestao/clientes", (req, res) => clienteController.listar(req, res));

// Rotas de planos.
routes.get("/gestao/planos", (req, res) => planoController.listar(req, res));
routes.patch("/gestao/planos/:idPlano", (req, res) => planoController.atualizarCusto(req, res));

// Rotas de assinaturas.
routes.post("/gestao/assinaturas", (req, res) => assinaturaController.criar(req, res));
routes.get("/gestao/assinaturas/:tipo", (req, res) => assinaturaController.listarPorTipo(req, res));
routes.get("/gestao/assinaturascliente/:codcli", (req, res) => assinaturaController.listarPorCliente(req, res));
routes.get("/gestao/assinaturasplano/:codplano", (req, res) => assinaturaController.listarPorPlano(req, res));

export { routes };

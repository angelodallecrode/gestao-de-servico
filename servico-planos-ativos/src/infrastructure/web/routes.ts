import { Router } from "express";
import { PlanosAtivosController } from "../../adapters/controllers/PlanosAtivosController.js";
import { ConsultarAssinaturaAtiva } from "../../application/use-cases/ConsultarAssinaturaAtiva.js";
import { MemoriaAssinaturaCache } from "../../adapters/cache/MemoriaAssinaturaCache.js";
import { HttpGestaoClient } from "../../adapters/gateways/HttpGestaoClient.js";

const routes = Router();

// Cache em memoria compartilhada entre as rotas e o consumidor de eventos.
const cache = new MemoriaAssinaturaCache();
const gestaoClient = new HttpGestaoClient();

// Caso de uso.
const consultarAssinaturaAtiva = new ConsultarAssinaturaAtiva(cache, gestaoClient);

// Controlador.
const planosAtivosController = new PlanosAtivosController(consultarAssinaturaAtiva);

// Rota de consulta de plano ativo.
routes.get("/planosativos/:codass", (req, res) => planosAtivosController.consultar(req, res));

export { routes, cache };

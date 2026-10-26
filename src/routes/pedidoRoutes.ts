import { Router } from "express";
import { CafeteriaService } from "../services/cafeteriaService";

export function crearRutasPedidos(service: CafeteriaService): Router {
  const router = Router();
  router.get("/", (_req, res) => res.json(service.getPedidos()));
  router.get("/:id", (req, res) => {
    const pedido = service.getPedidoById(req.params.id as string);
    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json(pedido);
  });
  return router;
}
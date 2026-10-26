import { Router, Request, Response } from "express";
import { Pedido } from "../models/pedido";
import { CafeteriaService } from "../services/cafeteriaService";

export function crearRutasPedidos(service: CafeteriaService): Router {
  const router = Router();

  router.post("/", (req: Request, res: Response) => {
    const { id, items, estado } = req.body;
    if (typeof id !== "string" || id.trim().length === 0 || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Faltan datos obligatorios o el formato de items es incorrecto" });
    }

    for (const item of items) {
      if (!item || typeof item !== "object" || Array.isArray(item) || typeof item.productoId !== "string" || item.productoId.trim().length === 0) {
        return res.status(400).json({ error: "Cada item debe incluir un productoId válido" });
      }
      if (!service.getProductoById(item.productoId)) {
        return res.status(400).json({ error: `El producto no existe: ${item.productoId}` });
      }
      if (!Number.isInteger(item.cantidad) || item.cantidad <= 0) {
        return res.status(400).json({ error: "La cantidad debe ser un entero positivo" });
      }
    }

    const pedido = new Pedido(id, items, estado);
    service.crearPedido(pedido);
    res.status(201).json({ pedido, total: pedido.calcularTotal(new Map(service.getProductos().map(p => [p.getId(), p]))) });
  });

  router.get("/", (_req: Request, res: Response) => res.json(service.getPedidos()));
  router.get("/:id", (req: Request, res: Response) => {
    const pedido = service.getPedidoById(req.params.id as string);
    if (!pedido) return res.status(404).json({ error: "Pedido no encontrado" });
    res.json(pedido);
  });

  return router;
}
import { Router } from "express";
import { Pedido } from "../models/pedido";
import { CafeteriaService } from "../services/cafeteriaService";

export function crearRutasTest(service: CafeteriaService): Router {
  const router = Router();

  router.post("/reset", (_req, res) => {
    service.resetear();
    res.json({ mensaje: "Estado reiniciado" });
  });

  router.post("/seed", (_req, res) => {
    service.resetear();
    service.crearPedido(new Pedido("pedido-test-1", [
      { productoId: "c1", cantidad: 2 },
      { productoId: "p1", cantidad: 1 },
    ]));
    service.crearPedido(new Pedido("pedido-test-2", [
      { productoId: "p2", cantidad: 1 },
    ]));

    res.json({
      mensaje: "Datos de prueba cargados",
      productos: service.getProductos().length,
      pedidos: service.getPedidos().length,
    });
  });

  return router;
}

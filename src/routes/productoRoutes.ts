import { Router } from "express";
import { CafeteriaService } from "../services/cafeteriaService";

export function crearRutasProductos(service: CafeteriaService): Router {
  const router = Router();
  router.get("/", (_req, res) => res.json(service.getProductos()));
  router.get("/:id", (req, res) => {
    const producto = service.getProductoById(req.params.id as string);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(producto);
  });
  return router;
}

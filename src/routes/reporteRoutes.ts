import { Router } from "express";
import { CafeteriaService } from "../services/cafeteriaService";


export function crearRutasReportes(service: CafeteriaService): Router {
  const router = Router();
  router.get("/facturacion", (_req, res) => res.json({ facturacionTotal: service.getFacturacionTotal() }));
  router.get("/mas-vendido", (_req, res) => {
    const producto = service.getProductoMasVendido();
    if (!producto) return res.status(404).json({ error: "No hay ventas registradas" });
    res.json(producto);
  });
  return router;
}

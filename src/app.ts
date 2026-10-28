import express from "express";
import { CafeteriaService } from "./services/cafeteriaService";
import { crearRutasProductos } from "./routes/productoRoutes";
import { crearRutasPedidos } from "./routes/pedidoRoutes";
import { crearRutasReportes } from "./routes/reporteRoutes";

export function crearApp(service = new CafeteriaService()) {
  const app = express();
  app.use(express.json());
  app.get("/", (_req, res) => res.send("API de Cafetería Origen corriendo. Use Postman para probar los endpoints."));
  app.use("/productos", crearRutasProductos(service));
  app.use("/pedidos", crearRutasPedidos(service));
  app.use("/reportes", crearRutasReportes(service));
  return app;
}

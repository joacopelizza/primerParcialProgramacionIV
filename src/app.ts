import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import { CafeteriaService } from "./services/cafeteriaService";
import { crearRutasProductos } from "./routes/productoRoutes";
import { crearRutasPedidos } from "./routes/pedidoRoutes";
import { crearRutasReportes } from "./routes/reporteRoutes";
import { crearRutasTest } from "./routes/testRoutes";

export function crearApp(service = new CafeteriaService()) {
  const app = express();
  const corsOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(cors({ origin: corsOrigins }));
  app.use(express.json());
  app.get("/", (_req, res) => res.send("API de Cafetería Origen corriendo. Use Postman para probar los endpoints."));
  app.use("/productos", crearRutasProductos(service));
  app.use("/pedidos", crearRutasPedidos(service));
  app.use("/reportes", crearRutasReportes(service));
  if (process.env.NODE_ENV === "test") {
    app.use("/__test__", crearRutasTest(service));
  }
  app.use((_req, res) => res.status(404).json({ error: "Ruta no encontrada" }));
  app.use(((error: unknown, _req, res, _next) => {
    const statusCode =
      typeof error === "object" && error !== null && "status" in error &&
      typeof error.status === "number" && error.status >= 400 && error.status <= 599
        ? error.status
        : typeof error === "object" && error !== null && "statusCode" in error &&
          typeof error.statusCode === "number" && error.statusCode >= 400 && error.statusCode <= 599
          ? error.statusCode
          : 500;
    const message = error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Error interno del servidor";

    res.status(statusCode).json({ error: message || "Error interno del servidor" });
  }) as ErrorRequestHandler);
  return app;
}

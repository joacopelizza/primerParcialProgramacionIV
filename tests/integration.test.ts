
import { Server } from "node:http";
import { AddressInfo } from "node:net";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { crearApp } from "../src/app";
import { Pedido } from "../src/models/pedido";
import { CafeteriaService } from "../src/services/cafeteriaService";

describe("API de Cafetería Origen", () => {
  let service: CafeteriaService;
  let server: Server;
  let baseUrl: string;

  beforeEach(async () => {
    service = new CafeteriaService();
    server = crearApp(service).listen(0);
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterEach(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it("responde en la ruta principal", async () => {
    const response = await fetch(baseUrl);

    expect(response.status).toBe(200);
    expect(await response.text()).toContain("API de Cafetería Origen");
  });

  it("permite solicitudes CORS desde el frontend local", async () => {
    const response = await fetch(`${baseUrl}/productos`, {
      headers: { Origin: "http://localhost:5173" },
    });

    expect(response.headers.get("access-control-allow-origin")).toBe("http://localhost:5173");
  });

  it("responde solicitudes preflight CORS", async () => {
    const response = await fetch(`${baseUrl}/pedidos`, {
      method: "OPTIONS",
      headers: {
        Origin: "http://localhost:5173",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type",
      },
    });

    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe("http://localhost:5173");
    expect(response.headers.get("access-control-allow-methods")).toContain("POST");
    expect(response.headers.get("access-control-allow-headers")).toContain("content-type");
  });

  it("lista los 20 productos iniciales", async () => {
    const response = await fetch(`${baseUrl}/productos`);
    const productos = await response.json();

    expect(response.status).toBe(200);
    expect(productos).toHaveLength(20);
    expect(productos.find((producto: { id: string }) => producto.id === "c1")).toMatchObject({
      precio: 5020,
      tipo: "expreso",
    });
    expect(productos.find((producto: { id: string }) => producto.id === "f1")).toMatchObject({
      precio: 4040,
      tipo: "filtrado",
    });
    expect(productos.find((producto: { id: string }) => producto.id === "p1")).toMatchObject({
      precio: 2500,
      tipo: "pasteleria",
    });
  });

  it("obtiene un producto existente por ID", async () => {
    const response = await fetch(`${baseUrl}/productos/c1`);
    const producto = await response.json();

    expect(response.status).toBe(200);
    expect(producto.id).toBe("c1");
    expect(producto.nombre).toBe("Expreso Pocillo Brasil");
    expect(producto.precio).toBe(5020);
    expect(producto.tipo).toBe("expreso");
  });

  it("incluye precio calculado y tipo al buscar cada categoría por ID", async () => {
    const productosEsperados = [
      { id: "c1", precio: 5020, tipo: "expreso" },
      { id: "f1", precio: 4040, tipo: "filtrado" },
      { id: "p1", precio: 2500, tipo: "pasteleria" },
    ];

    for (const esperado of productosEsperados) {
      const response = await fetch(`${baseUrl}/productos/${esperado.id}`);
      const producto = await response.json();

      expect(response.status).toBe(200);
      expect(producto).toMatchObject({ precio: esperado.precio, tipo: esperado.tipo });
    }
  });

  it("devuelve 404 para un producto inexistente", async () => {
    const response = await fetch(`${baseUrl}/productos/desconocido`);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Producto no encontrado" });
  });

  it("devuelve errores JSON para rutas inexistentes", async () => {
    const response = await fetch(`${baseUrl}/ruta-inexistente`);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Ruta no encontrada" });
  });

  it("reinicia los pedidos y restaura el catálogo inicial en modo test", async () => {
    service.crearPedido(new Pedido("pedido-para-reset", [
      { productoId: "p1", cantidad: 1 },
    ]));

    const response = await fetch(`${baseUrl}/__test__/reset`, { method: "POST" });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ mensaje: "Estado reiniciado" });
    expect(service.getProductos()).toHaveLength(20);
    expect(service.getPedidos()).toHaveLength(0);
    expect(service.getFacturacionTotal()).toBe(0);
  });

  it("carga una fixture reproducible en modo test", async () => {
    const response = await fetch(`${baseUrl}/__test__/seed`, { method: "POST" });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      mensaje: "Datos de prueba cargados",
      productos: 20,
      pedidos: 2,
    });
    expect(service.getPedidos().map((pedido) => pedido.getId())).toEqual([
      "pedido-test-1",
      "pedido-test-2",
    ]);
    expect(service.getFacturacionTotal()).toBe(16740);

    await fetch(`${baseUrl}/__test__/seed`, { method: "POST" });
    expect(service.getPedidos()).toHaveLength(2);
  });

  it("no registra rutas de soporte fuera del modo test", async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    let nonTestServer: Server | undefined;

    try {
      process.env.NODE_ENV = "development";
      nonTestServer = crearApp(service).listen(0);
    } finally {
      if (originalNodeEnv === undefined) {
        delete process.env.NODE_ENV;
      } else {
        process.env.NODE_ENV = originalNodeEnv;
      }
    }

    await new Promise<void>((resolve) => nonTestServer?.once("listening", resolve));
    const address = nonTestServer?.address() as AddressInfo;
    const response = await fetch(`http://127.0.0.1:${address.port}/__test__/reset`, {
      method: "POST",
    });

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Ruta no encontrada" });
    await new Promise<void>((resolve, reject) => {
      nonTestServer?.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it("devuelve errores JSON para cuerpos JSON mal formados", async () => {
    const response = await fetch(`${baseUrl}/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: expect.any(String) });
  });

  it("devuelve errores JSON cuando ocurre un error interno", async () => {
    service.getProductos = () => {
      throw new Error("Fallo del servicio");
    };

    const response = await fetch(`${baseUrl}/productos`);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Fallo del servicio" });
  });

  it("crea un pedido válido y devuelve el total calculado", async () => {
    const response = await fetch(`${baseUrl}/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: "pedido-valido",
        items: [
          { productoId: "c1", cantidad: 2 },
          { productoId: "p2", cantidad: 1 },
        ],
      }),
    });
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.pedido.id).toBe("pedido-valido");
    expect(body.pedido.estado).toBe("pendiente");
    expect(body.pedido.mesaId).toBeUndefined();
    expect(body.total).toBe(14240);
    expect(service.getPedidoById("pedido-valido")).toBeDefined();
  });

  it("crea un pedido con mesaId y lo devuelve en la respuesta", async () => {
    const response = await fetch(`${baseUrl}/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: "pedido-con-mesa",
        mesaId: "mesa-4",
        items: [{ productoId: "p1", cantidad: 1 }],
      }),
    });
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.pedido.mesaId).toBe("mesa-4");
    expect(service.getPedidoById("pedido-con-mesa")?.toJSON().mesaId).toBe("mesa-4");
  });

  it("lista los pedidos guardados", async () => {
    service.crearPedido(new Pedido("pedido-lista", [
      { productoId: "p1", cantidad: 1 },
    ]));

    const response = await fetch(`${baseUrl}/pedidos`);
    const pedidos = await response.json();

    expect(response.status).toBe(200);
    expect(pedidos).toHaveLength(1);
    expect(pedidos[0].id).toBe("pedido-lista");
  });

  it("obtiene un pedido existente por ID", async () => {
      service.crearPedido(new Pedido("pedido-buscar", [
      { productoId: "p1", cantidad: 2 },
      { productoId: "c1", cantidad: 1 },
    ], "preparando"));
    
    const response = await fetch(`${baseUrl}/pedidos/pedido-buscar`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
        id: "pedido-buscar",
        estado: "preparando",
        items: [
          { productoId: "p1", cantidad: 2 },
          { productoId: "c1", cantidad: 1 },
        ],
        total: 10020,
    });
  });

  it("devuelve 404 para un pedido inexistente", async () => {
    const response = await fetch(`${baseUrl}/pedidos/no-existe`);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Pedido no encontrado" });
  });

  it("devuelve la facturación total acumulada", async () => {
    service.crearPedido(new Pedido("pedido-a", [{ productoId: "p1", cantidad: 2 }]));
    service.crearPedido(new Pedido("pedido-b", [{ productoId: "p2", cantidad: 1 }]));

    const response = await fetch(`${baseUrl}/reportes/facturacion`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ facturacionTotal: 9200 });
  });

  it("devuelve el producto más vendido", async () => {
    service.crearPedido(new Pedido("pedido-a", [{ productoId: "c1", cantidad: 3 }]));
    service.crearPedido(new Pedido("pedido-b", [{ productoId: "c1", cantidad: 2 }]));
    service.crearPedido(new Pedido("pedido-c", [{ productoId: "p2", cantidad: 6 }]));

    const response = await fetch(`${baseUrl}/reportes/mas-vendido`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ nombre: "Torta selva negra", cantidad: 6 });
  });

  it("devuelve 404 en el reporte de más vendido si aún no hay ventas", async () => {
    const response = await fetch(`${baseUrl}/reportes/mas-vendido`);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "No hay ventas registradas" });
  });
});
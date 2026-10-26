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
    baseUrl = http://127.0.0.1:${address.port};
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

  it("lista los 20 productos iniciales", async () => {
    const response = await fetch(${baseUrl}/productos);
    const productos = await response.json();

    expect(response.status).toBe(200);
    expect(productos).toHaveLength(20);
  });

  it("obtiene un producto existente por ID", async () => {
    const response = await fetch(${baseUrl}/productos/c1);
    const producto = await response.json();

    expect(response.status).toBe(200);
    expect(producto.id).toBe("c1");
    expect(producto.nombre).toBe("Expreso Pocillo Brasil");
  });

  it("devuelve 404 para un producto inexistente", async () => {
    const response = await fetch(${baseUrl}/productos/desconocido);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Producto no encontrado" });
  });

  it("crea un pedido válido y devuelve el total calculado", async () => {
    const response = await fetch(${baseUrl}/pedidos, {
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
    expect(body.total).toBe(14240);
    expect(service.getPedidoById("pedido-valido")).toBeDefined();
  });

  it("lista los pedidos guardados", async () => {
    service.crearPedido(new Pedido("pedido-lista", [
      { productoId: "p1", cantidad: 1 },
    ]));

    const response = await fetch(${baseUrl}/pedidos);
    const pedidos = await response.json();

    expect(response.status).toBe(200);
    expect(pedidos).toHaveLength(1);
    expect(pedidos[0].id).toBe("pedido-lista");
  });

  it("obtiene un pedido existente por ID", async () => {
    service.crearPedido(new Pedido("pedido-buscar", [{ productoId: "p1", cantidad: 2 }]));

    const response = await fetch(${baseUrl}/pedidos/pedido-buscar);

    expect(response.status).toBe(200);
    expect((await response.json()).id).toBe("pedido-buscar");
  });

import { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { crearApp } from "../src/app";
import { CafeteriaService } from "../src/services/cafeteriaService";

describe("Validación de pedidos", () => {
  const service = new CafeteriaService();
  const app = crearApp(service);
  let server: ReturnType<typeof app.listen>;
  let baseUrl: string;

  beforeAll(async () => {
    server = app.listen(0);
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  async function enviarPedido(body: unknown): Promise<Response> {
    return fetch(`${baseUrl}/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  it("rechaza un pedido sin ID", async () => {
    const response = await enviarPedido({ items: [{ productoId: "p1", cantidad: 1 }] });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Faltan datos obligatorios o el formato de items es incorrecto" });
  });

  it("rechaza items que no estén en un arreglo", async () => {
    const response = await enviarPedido({ id: "pedido-items-invalidos", items: "p1" });

    expect(response.status).toBe(400);
  });

  it("rechaza un pedido con items vacíos", async () => {
    const response = await enviarPedido({ id: "pedido-vacio", items: [] });

    expect(response.status).toBe(400);
  });

  it("rechaza un item que no incluye productoId", async () => {
    const response = await enviarPedido({ id: "pedido-sin-producto", items: [{ cantidad: 1 }] });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Cada item debe incluir un productoId válido" });
  });

  it("rechaza un producto inexistente y no guarda el pedido", async () => {
    const response = await enviarPedido({
      id: "pedido-producto-inexistente",
      items: [{ productoId: "no-existe", cantidad: 1 }],
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "El producto no existe: no-existe" });
    expect(service.getPedidoById("pedido-producto-inexistente")).toBeUndefined();
  });

  it.each([0, -1, 1.5])("rechaza cantidades no positivas y no enteras: %s", async (cantidad) => {
    const response = await enviarPedido({
      id: `pedido-cantidad-${cantidad}`,
      items: [{ productoId: "p1", cantidad }],
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "La cantidad debe ser un entero positivo" });
  });
});

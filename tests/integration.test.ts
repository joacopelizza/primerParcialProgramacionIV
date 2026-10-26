import { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { crearApp } from "../src/app";

describe("API de productos", () => {
  const app = crearApp();
  let server: ReturnType<typeof app.listen>;
  let baseUrl: string;
  beforeAll(async () => {
    server = app.listen(0);
    await new Promise<void>(resolve => server.once("listening", resolve));
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });
  afterAll(async () => new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())));

  it("lista productos", async () => {
    const response = await fetch(`${baseUrl}/productos`);
    expect(response.status).toBe(200);
    expect(Array.isArray(await response.json())).toBe(true);
  });
  it("obtiene por ID y responde 404 cuando no existe", async () => {
    expect((await fetch(`${baseUrl}/productos/c1`)).status).toBe(200);
    expect((await fetch(`${baseUrl}/productos/desconocido`)).status).toBe(404);
  });
});

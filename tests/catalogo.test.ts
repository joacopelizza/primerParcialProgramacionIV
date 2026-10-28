import { describe, expect, it } from "vitest";
import { Pasteleria } from "../src/models/pasteleria";
import { CafeteriaService } from "../src/services/cafeteriaService";

describe("Catálogo de productos", () => {
  it("carga 20 productos y permite buscar uno por ID", () => {
    const service = new CafeteriaService();

    expect(service.getProductos()).toHaveLength(20);
    expect(service.getProductoById("c1")?.getNombre()).toBe("Expreso Pocillo Brasil");
  });

  it("devuelve undefined cuando el producto no existe", () => {
    expect(new CafeteriaService().getProductoById("no-existe")).toBeUndefined();
  });

  it("permite agregar un producto nuevo al catálogo", () => {
    const service = new CafeteriaService();
    const producto = new Pasteleria("p3", "Alfajor", 900);
    service.agregarProducto(producto);

    expect(service.getProductoById("p3")).toBe(producto);
  });
});

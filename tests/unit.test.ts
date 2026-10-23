import { describe, expect, it } from "vitest";
import { Producto } from "../src/models/producto";

class ProductoPrueba extends Producto {
  calcularPrecio(): number { return this.getPrecioBase(); }
}

describe("Producto", () => {
  it("guarda y permite consultar sus datos", () => {
    const producto = new ProductoPrueba("x1", "Producto", 1200);
    expect(producto.getId()).toBe("x1");
    expect(producto.getNombre()).toBe("Producto");
    expect(producto.getPrecioBase()).toBe(1200);
  });

  it("permite actualizar nombre y precio base", () => {
    const producto = new ProductoPrueba("x1", "Producto", 1200);
    producto.setNombre("Actualizado");
    producto.setPrecioBase(1500);
    expect(producto.getNombre()).toBe("Actualizado");
    expect(producto.getPrecioBase()).toBe(1500);
  });

  it("serializa sus datos y precio calculado", () => {
    const producto = new ProductoPrueba("x1", "Producto", 1200);
    expect(producto.toJSON()).toEqual({ id: "x1", nombre: "Producto", precioBase: 1200, precio: 1200 });
  });
});

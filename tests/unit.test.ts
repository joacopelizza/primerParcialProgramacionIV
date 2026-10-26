import { describe, expect, it } from "vitest";
import { Pedido } from "../src/models/pedido";
import { Producto } from "../src/models/producto";
import { Cafe } from "../src/models/cafe";
import { Pasteleria } from "../src/models/pasteleria";

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

class ProductoParaPedido extends Producto {
  calcularPrecio(): number { return this.getPrecioBase(); }
}

describe("Pedido: cálculo del total", () => {
  it("multiplica el precio de un producto por su cantidad", () => {
    const productos = new Map<string, Producto>([["p1", new ProductoParaPedido("p1", "Café", 1000)]]);
    const pedido = new Pedido("ped1", [{ productoId: "p1", cantidad: 3 }]);
    expect(pedido.calcularTotal(productos)).toBe(3000);
  });

  it("suma varios productos", () => {
    const productos = new Map<string, Producto>([
      ["p1", new ProductoParaPedido("p1", "Café", 1000)],
      ["p2", new ProductoParaPedido("p2", "Torta", 2500)],
    ]);
    const pedido = new Pedido("ped1", [
      { productoId: "p1", cantidad: 2 }, { productoId: "p2", cantidad: 1 },
    ]);
    expect(pedido.calcularTotal(productos)).toBe(4500);
  });

  it("devuelve cero si el pedido está vacío", () => {
    expect(new Pedido("ped1", []).calcularTotal(new Map<string, Producto>())).toBe(0);
  });
});

describe("Cafe", () => {
  it("suma precio base y gramos por precio por gramo", () => {
    expect(new Cafe("c1", "Expreso", 2500, 18, 140).calcularPrecio()).toBe(5020);
  });
  it("incluye los datos propios en JSON", () => {
    expect(new Cafe("c1", "Expreso", 2500, 18, 140).toJSON()).toMatchObject({
      gramos: 18, precioPorGramo: 140, precio: 5020,
    });
  });
});

describe("Pasteleria", () => {
  it("usa el precio base como precio final", () => {
    const producto = new Pasteleria("p1", "Muffin", 2500);
    expect(producto.calcularPrecio()).toBe(2500);
  });
});

import { Pedido } from "../src/models/pedido";
import { Producto } from "../src/models/producto";

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

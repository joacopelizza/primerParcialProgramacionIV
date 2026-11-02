import { describe, expect, it } from "vitest";
import { Cafe } from "../src/models/cafe";
import { Pasteleria } from "../src/models/pasteleria";

describe("Modelos de productos", () => {
  it("expone los datos comunes de Producto y serializa su precio calculado", () => {
    const producto = new Pasteleria("p-base", "Muffin", 2500);
    producto.setNombre("Muffin de vainilla");

    expect(producto.getId()).toBe("p-base");
    expect(producto.getNombre()).toBe("Muffin de vainilla");
    expect(producto.getPrecioBase()).toBe(2500);
    expect(producto.toJSON()).toEqual({
      id: "p-base",
      nombre: "Muffin de vainilla",
      precioBase: 2500,
      precio: 2500,
    });
  });

  it("calcula el precio final de un café", () => {
    expect(new Cafe("c1", "Expreso", 2500, 18, 140).calcularPrecio()).toBe(5020);
  });

  it("calcula el precio final de un café filtrado", () => {
    expect(new Cafe("f1", "Filtrado", 3200, 15, 180).calcularPrecio()).toBe(5900);
  });

  it("recalcula el precio del café después de modificar sus gramos y precio por gramo", () => {
    const cafe = new Cafe("c1", "Café", 100, 20, 5);
    cafe.setGramos(10);
    cafe.setPrecioPorGramo(8);

    expect(cafe.calcularPrecio()).toBe(180);
  });

  it("usa el precio base como precio final de pastelería", () => {
    const producto = new Pasteleria("p1", "Muffin", 2500);
    producto.setPrecioBase(2800);

    expect(producto.calcularPrecio()).toBe(2800);
  });
});

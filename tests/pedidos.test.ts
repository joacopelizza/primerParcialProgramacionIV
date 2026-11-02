import { describe, expect, it } from "vitest";
import { Cafe } from "../src/models/cafe";
import { Pedido } from "../src/models/pedido";
import { Pasteleria } from "../src/models/pasteleria";
import { Producto } from "../src/models/producto";
import { CafeteriaService } from "../src/services/cafeteriaService";

describe("Pedidos", () => {
  it("calcula el total de un pedido con varios productos", () => {
    const cafe = new Cafe("c1", "Expreso", 2500, 18, 140);
    const torta = new Pasteleria("p2", "Torta", 4200);
    const productos = new Map<string, Producto>([["c1", cafe], ["p2", torta]]);
    const pedido = new Pedido("ped1", [
      { productoId: "c1", cantidad: 2 },
      { productoId: "p2", cantidad: 1 },
    ]);

    expect(pedido.calcularTotal(productos)).toBe(14240);
  });

  it("inicia pedidos en estado pendiente y permite cambiar el estado", () => {
    const pedido = new Pedido("ped1", []);
    expect(pedido.getEstado()).toBe("pendiente");

    pedido.setEstado("entregado");
    expect(pedido.getEstado()).toBe("entregado");
  });

  it("devuelve cero para un pedido vacío", () => {
    expect(new Pedido("ped1", []).calcularTotal(new Map<string, Producto>())).toBe(0);
  });
});

describe("Servicio de pedidos y reportes", () => {
  it("guarda pedidos y los puede buscar por ID", () => {
    const service = new CafeteriaService();
    const pedido = new Pedido("ped1", [{ productoId: "p1", cantidad: 2 }]);
    service.crearPedido(pedido);

    expect(service.getPedidoById("ped1")).toBe(pedido);
    expect(service.getPedidos()).toContain(pedido);
  });

  it("suma la facturación de varios pedidos", () => {
    const service = new CafeteriaService();
    service.crearPedido(new Pedido("ped1", [{ productoId: "p1", cantidad: 2 }]));
    service.crearPedido(new Pedido("ped2", [{ productoId: "p2", cantidad: 1 }]));

    expect(service.getFacturacionTotal()).toBe(9200);
  });

  it("devuelve el producto más vendido o null si todavía no hay ventas", () => {
    const service = new CafeteriaService();
    expect(service.getProductoMasVendido()).toBeNull();

    service.crearPedido(new Pedido("ped1", [{ productoId: "c1", cantidad: 2 }]));
    service.crearPedido(new Pedido("ped2", [{ productoId: "c1", cantidad: 3 }]));
    service.crearPedido(new Pedido("ped3", [{ productoId: "p2", cantidad: 4 }]));

    expect(service.getProductoMasVendido()).toEqual({ nombre: "Expreso Pocillo Brasil", cantidad: 5 });
  });
});
